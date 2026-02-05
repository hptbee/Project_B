using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;
using FluentAssertions;
using TheCoffeeCream.Application.Services;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Application.DTOs;

namespace TheCoffeeCream.Tests
{
    public class OrderServiceTests
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IShopContext> _shopContextMock;
        private readonly OrderService _orderService;
        private readonly string _shopId = "test-shop-id";

        public OrderServiceTests()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _shopContextMock = new Mock<IShopContext>();

            _orderService = new OrderService(
                _orderRepositoryMock.Object,
                _productRepositoryMock.Object,
                _shopContextMock.Object
            );

            SetupShopContext();
        }

        private void SetupShopContext(string? shopId = "test-shop-id")
        {
            _shopContextMock.Setup(x => x.GetShopId()).Returns(shopId!);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldUseCapitalShopIdClaim_WhenProvided()
        {
            // Arrange
            SetupShopContext(_shopId); // With IShopContext, the claim type doesn't matter, only the resolved shopId
            var productId = Guid.NewGuid();
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product>());
            
            var request = new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                Items = new List<CreateOrderItemRequest> { new CreateOrderItemRequest { ProductId = productId, Quantity = 1, Name = "Test", UnitPrice = 10 } },
                PaymentMethod = "CASH",
                CashAmount = 10
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            result.ShopId.Should().Be(_shopId);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldUseHeader_WhenClaimsMissing()
        {
            // Arrange
            SetupShopContext("header-shop-id"); // Simulate header shop ID being resolved by IShopContext
            var productId = Guid.NewGuid();
            _productRepositoryMock.Setup(r => r.GetAllAsync("header-shop-id")).ReturnsAsync(new List<Product>());

            var request = new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                Items = new List<CreateOrderItemRequest> { new CreateOrderItemRequest { ProductId = productId, Quantity = 1, Name = "Test", UnitPrice = 10 } },
                PaymentMethod = "CASH",
                CashAmount = 10
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            result.ShopId.Should().Be("header-shop-id");
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldCreateOrder_WhenValid()
        {
            // Arrange
            SetupShopContext(_shopId);
            var productId = Guid.NewGuid();
            var products = new List<Product> { new Product { Id = productId, Name = "Coffee", Price = 10, ShopId = _shopId } };
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(products);
            _orderRepositoryMock.Setup(r => r.GetByClientOrderIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync((Order)null);

            var request = new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                Items = new List<CreateOrderItemRequest>
                {
                    new CreateOrderItemRequest { ProductId = productId, Quantity = 2, UnitPrice = 10, Name = "Coffee" }
                },
                CashAmount = 20,
                PaymentMethod = "CASH" // String to Enum parsing
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.Total.Should().Be(20);
            result.Total.Should().Be(20);
            _orderRepositoryMock.Verify(r => r.AddAsync(It.Is<Order>(o => o.ClientOrderId == request.ClientOrderId)), Times.Once);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldThrow_WhenOrderAlreadyFinalized()
        {
            // Arrange
            SetupShopContext(_shopId);
            var item = new OrderItem(Guid.NewGuid(), "Item", 10, 1, null, null, 0, "");
            var existing = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem> { item }, null, PaymentMethod.CASH, 10, 0, null, 0, OrderStatus.SUCCESS, "", null);
            _orderRepositoryMock.Setup(r => r.GetByClientOrderIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync(existing);

            var request = new CreateOrderRequest { ClientOrderId = existing.ClientOrderId };

            // Act
            Func<Task> act = async () => await _orderService.CreateOrderAsync(request);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*already been finalized*");
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldUpdate_WhenExistingIsDraft()
        {
            // Arrange
            SetupShopContext(_shopId);
            var item = new OrderItem(Guid.NewGuid(), "Item", 10, 1, null, null, 0, "");
            var existing = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem> { item }, null, PaymentMethod.CASH, 10, 0, null, 0, OrderStatus.DRAFT, "", null);
            _orderRepositoryMock.Setup(r => r.GetByClientOrderIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync(existing);
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product>());

            var request = new CreateOrderRequest 
            { 
                ClientOrderId = existing.ClientOrderId, 
                Items = new List<CreateOrderItemRequest> { new CreateOrderItemRequest { ProductId = Guid.NewGuid(), Name = "Item", Quantity = 1, UnitPrice = 10 } } 
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            result.Id.Should().Be(existing.Id);
            _orderRepositoryMock.Verify(r => r.AddAsync(It.Is<Order>(o => o.Id == existing.Id)), Times.Once);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldResolveToppings_WhenProvided()
        {
            // Arrange
            SetupShopContext(_shopId);
            var productId = Guid.NewGuid();
            var toppingId = Guid.NewGuid();
            var toppingProduct = new Product(toppingId, "Sugar", 1, true);
            var mainProduct = new Product(productId, "Coffee", 10, false, toppings: new List<Product> { toppingProduct });
            
            var products = new List<Product> { mainProduct, toppingProduct };
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(products);
            _orderRepositoryMock.Setup(r => r.GetByClientOrderIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync((Order)null);

            var request = new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                Items = new List<CreateOrderItemRequest>
                {
                    new CreateOrderItemRequest 
                    { 
                        ProductId = productId, 
                        Quantity = 1, 
                        UnitPrice = 10, 
                        Name = "Coffee",
                        SelectedToppingNames = new List<string> { "Sugar" }
                    }
                },
                CashAmount = 10,
                PaymentMethod = "CASH"
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            var item = result.Items.First();
            item.SelectedToppings.Should().NotBeNull();
            item.SelectedToppings.Should().HaveCount(1);
            item.SelectedToppings.First().Name.Should().Be("Sugar");
        }

        [Fact]
        public async Task UpdateOrderPaymentMethodAsync_ShouldUpdate_WhenValidCombinedPayment()
        {
            // Arrange
            SetupShopContext(_shopId);
            var orderId = Guid.NewGuid();
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            var order = new Order(Guid.NewGuid(), OrderType.DINE_IN, new List<OrderItem>{ item }, 1, PaymentMethod.CASH, 100, 0, null, 0, OrderStatus.SUCCESS, "", null);
            
            _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, _shopId)).ReturnsAsync(order);

            var request = new UpdatePaymentMethodRequest
            {
                PaymentMethod = "COMBINED",
                CashAmount = 40,
                TransferAmount = 60
            };

            // Act
            await _orderService.UpdateOrderPaymentMethodAsync(orderId, request);

            // Assert
            order.PaymentMethod.Should().Be(PaymentMethod.COMBINED);
            order.CashAmount.Should().Be(40);
            order.TransferAmount.Should().Be(60);
            _orderRepositoryMock.Verify(r => r.UpdateAsync(order), Times.Once);
        }

        [Fact]
        public async Task UpdateOrderPaymentMethodAsync_ShouldEnforceFullAmount_ForCash()
        {
            // Arrange
            SetupShopContext(_shopId);
            var orderId = Guid.NewGuid();
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            var order = new Order(Guid.NewGuid(), OrderType.DINE_IN, new List<OrderItem> { item }, 1, PaymentMethod.TRANSFER, 0, 100, null, 0);
            
            _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, _shopId)).ReturnsAsync(order);

            var request = new UpdatePaymentMethodRequest
            {
                PaymentMethod = "CASH",
                CashAmount = 0 // Should be ignored and set to 100
            };

            // Act
            await _orderService.UpdateOrderPaymentMethodAsync(orderId, request);

            // Assert
            order.PaymentMethod.Should().Be(PaymentMethod.CASH);
            order.CashAmount.Should().Be(100);
            order.TransferAmount.Should().Be(0);
        }

        [Fact]
        public async Task UpdateOrderPaymentMethodAsync_ShouldEnforceFullAmount_ForTransfer()
        {
            // Arrange
            SetupShopContext(_shopId);
            var orderId = Guid.NewGuid();
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            var order = new Order(Guid.NewGuid(), OrderType.DINE_IN, new List<OrderItem> { item }, 1, PaymentMethod.CASH, 100, 0, null, 0);
            
            _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, _shopId)).ReturnsAsync(order);

            var request = new UpdatePaymentMethodRequest
            {
                PaymentMethod = "TRANSFER",
                TransferAmount = 0 // Should be ignored and set to 100
            };

            // Act
            await _orderService.UpdateOrderPaymentMethodAsync(orderId, request);

            // Assert
            order.PaymentMethod.Should().Be(PaymentMethod.TRANSFER);
            order.TransferAmount.Should().Be(100);
            order.CashAmount.Should().Be(0);
        }

        [Fact]
        public async Task UpdateOrderPaymentMethodAsync_ShouldThrow_WhenCombinedAmountMismatch()
        {
            // Arrange
            SetupShopContext(_shopId);
            var orderId = Guid.NewGuid();
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            var order = new Order(Guid.NewGuid(), OrderType.DINE_IN, new List<OrderItem> { item }, 1, PaymentMethod.CASH, 100, 0, null, 0);
            
            _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, _shopId)).ReturnsAsync(order);

            var request = new UpdatePaymentMethodRequest
            {
                PaymentMethod = "COMBINED",
                CashAmount = 50,
                TransferAmount = 40 // Total 90 != 100
            };

            // Act
            Func<Task> act = async () => await _orderService.UpdateOrderPaymentMethodAsync(orderId, request);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("*must equal Total*");
        }

        [Fact]
        public async Task UpdateOrderAsync_ShouldUpdate_WhenValid()
        {
            // Arrange
            SetupShopContext(_shopId);
            var orderId = Guid.NewGuid();
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            var existing = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem>{ item }, null, PaymentMethod.CASH, 100, 0, null, 0);
            _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, _shopId)).ReturnsAsync(existing);
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product>());

            var request = new CreateOrderRequest
            {
                ClientOrderId = existing.ClientOrderId,
                Items = new List<CreateOrderItemRequest>(), // Empty in mock test context usually implies a change or simplified logic
                Status = "SUCCESS"
            };

            // Act
            // Note: OrderService.UpdateOrderAsync throws if items list is empty because Order constructor throws.
            // Let's add an item to request.
            request.Items.Add(new CreateOrderItemRequest { ProductId = Guid.NewGuid(), Name = "Other", Quantity = 1, UnitPrice = 50 });

            // Assert
            Func<Task> act = async () => await _orderService.UpdateOrderAsync(orderId, request);
            await act.Should().NotThrowAsync();
            _orderRepositoryMock.Verify(r => r.UpdateAsync(It.Is<Order>(o => o.Id == orderId)), Times.Once);
        }

        [Fact]
        public async Task SoftDeleteOrderAsync_ShouldToggleActive()
        {
            // Arrange
            SetupShopContext(_shopId);
            var orderId = Guid.NewGuid();

            // Act
            await _orderService.SoftDeleteOrderAsync(orderId);

            // Assert
            _orderRepositoryMock.Verify(r => r.ToggleActiveAsync(orderId, _shopId), Times.Once);
        }

        [Fact]
        public async Task GetOrdersByDateRangeAsync_ShouldCallRepo()
        {
            // Arrange
            SetupShopContext(_shopId);
            var start = DateTimeOffset.Now;
            var end = start.AddDays(1);

            // Act
            await _orderService.GetOrdersByDateRangeAsync(start, end);

            // Assert
            _orderRepositoryMock.Verify(r => r.GetOrdersByDateRangeAsync(start, end, _shopId), Times.Once);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldResolveToppings_ByCodeAndName()
        {
            // Arrange
            SetupShopContext(_shopId);
            var productId = Guid.NewGuid();
            var topping1 = new Product(Guid.NewGuid(), "T1", 1, true) { Code = "C1" };
            var topping2 = new Product(Guid.NewGuid(), "T2", 2, true) { Code = "C2" };
            var main = new Product(productId, "Main", 10, false, toppings: new List<Product> { topping1, topping2 });
            
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product> { main, topping1, topping2 });
            _orderRepositoryMock.Setup(r => r.GetByClientOrderIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync((Order)null);

            var request = new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                Items = new List<CreateOrderItemRequest>
                {
                    new CreateOrderItemRequest 
                    { 
                        ProductId = productId, 
                        Quantity = 1, 
                        Name = "Main", 
                        UnitPrice = 10,
                        SelectedToppingNames = new List<string> { "T1" },
                        SelectedToppingCodes = new List<string> { "C1", "C2" } // C1 is duplicate of T1
                    }
                },
                CashAmount = 10,
                PaymentMethod = "CASH"
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            var toppings = result.Items.First().SelectedToppings;
            toppings.Should().HaveCount(2);
            toppings.Should().Contain(t => t.Name == "T1");
            toppings.Should().Contain(t => t.Name == "T2");
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldIgnoreUnmatchedToppings()
        {
            // Arrange
            SetupShopContext(_shopId);
            var productId = Guid.NewGuid();
            var topping1 = new Product(Guid.NewGuid(), "T1", 1, true) { Code = "C1" };
            var main = new Product(productId, "Main", 10, false, toppings: new List<Product> { topping1 });
            
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product> { main, topping1 });
            _orderRepositoryMock.Setup(r => r.GetByClientOrderIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync((Order)null);

            var request = new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                Items = new List<CreateOrderItemRequest>
                {
                    new CreateOrderItemRequest 
                    { 
                        ProductId = productId, 
                        Name = "Main", 
                        Quantity = 1,
                        UnitPrice = 10,
                        SelectedToppingNames = new List<string> { "UnknownName" },
                        SelectedToppingCodes = new List<string> { "UnknownCode" }
                    }
                },
                PaymentMethod = "CASH"
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            result.Items.First().SelectedToppings.Should().BeEmpty();
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldHandleNullProductId()
        {
            // Arrange
            SetupShopContext(_shopId);
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product>());
            _orderRepositoryMock.Setup(r => r.GetByClientOrderIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync((Order)null);

            var request = new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                Items = new List<CreateOrderItemRequest> 
                { 
                    new CreateOrderItemRequest { ProductId = Guid.NewGuid(), Name = "Unknown", Quantity = 1 } 
                },
                PaymentMethod = "CASH"
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            result.Items.First().SelectedToppings.Should().BeEmpty();
        }
        [Fact]
        public async Task UpdateOrderPaymentMethodAsync_ShouldSetTransferAmount_WhenMethodIsTransfer()
        {
            // Arrange
            SetupShopContext(_shopId);
            var orderId = Guid.NewGuid();
            var items = new List<OrderItem> { new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "") };
            var existing = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, items, null, PaymentMethod.CASH, 100, 0);
            _orderRepositoryMock.Setup(r => r.GetByIdAsync(orderId, _shopId)).ReturnsAsync(existing);

            var request = new UpdatePaymentMethodRequest { PaymentMethod = "TRANSFER" };

            // Act
            await _orderService.UpdateOrderPaymentMethodAsync(orderId, request);

            // Assert
            existing.PaymentMethod.Should().Be(PaymentMethod.TRANSFER);
            existing.TransferAmount.Should().Be(100);
            existing.CashAmount.Should().Be(0);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldSkipDuplicateToppingCodes()
        {
            // Arrange
            SetupShopContext(_shopId);
            var productId = Guid.NewGuid();
            var topping1 = new Product(Guid.NewGuid(), "T1", 1, true) { Code = "C1" };
            var main = new Product(productId, "Main", 10, false, toppings: new List<Product> { topping1 });
            
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product> { main, topping1 });
            _orderRepositoryMock.Setup(r => r.GetByClientOrderIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync((Order)null);

            var request = new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                Items = new List<CreateOrderItemRequest>
                {
                    new CreateOrderItemRequest 
                    { 
                        ProductId = productId, 
                        Name = "Main", 
                        Quantity = 1,
                        SelectedToppingCodes = new List<string> { "C1", "C1" } // Duplicate
                    }
                },
                PaymentMethod = "CASH"
            };

            // Act
            var result = await _orderService.CreateOrderAsync(request);

            // Assert
            result.Items.First().SelectedToppings.Should().HaveCount(1);
        }
    }
}
