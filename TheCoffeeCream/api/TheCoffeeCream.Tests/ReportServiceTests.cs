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
    public class ReportServiceTests
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IShopContext> _shopContextMock;
        private readonly ReportService _reportService;
        private readonly string _shopId = "test-shop-id";

        public ReportServiceTests()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _shopContextMock = new Mock<IShopContext>();

            _reportService = new ReportService(
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
        public async Task GetRevenueReportAsync_ShouldUseCapitalShopIdClaim()
        {
            // Arrange
            SetupShopContext(_shopId);
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(new List<Order>());

            // Act
            await _reportService.GetRevenueReportAsync(DateTimeOffset.Now, DateTimeOffset.Now, "day");

            // Assert
            _orderRepositoryMock.Verify(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId), Times.Once);
        }

        private Order CreateOrder(DateTimeOffset createdAt, decimal total, decimal discount = 0)
        {
            var item = new OrderItem(Guid.NewGuid(), "Item", total, 1, null, null, 0, "");
            var order = new Order(
                Guid.NewGuid(), // ClientOrderId
                OrderType.TAKE_AWAY,
                new List<OrderItem> { item },
                null, 
                PaymentMethod.CASH, 
                total, // CashAmount must equal total for CASH type
                0,
                discount > 0 ? DiscountType.FIXED : null,
                discount,
                OrderStatus.SUCCESS
            );
            order.CreatedAt = createdAt;
            return order;
        }

        [Fact]
        public async Task GetRevenueReportAsync_ShouldAggregateByDay()
        {
            // Arrange
            var date = DateTimeOffset.UtcNow.Date; // Today 00:00 UTC
            
            // Order 1: Total 90 (100 - 10 discount)
            var o1 = CreateOrder(date, 100, 10);
            // This is tricky because Constructor sets Total.
            // If I pass cashAmount=100 in helper, logic might validate against Total.
            // Total = 100 - 10 = 90.
            // So CashAmount should be 90.
            
            // Let's refine helper or manually create
            var item1 = new OrderItem(Guid.NewGuid(), "Item1", 100, 1, null, null, 0, "");
            var order1 = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem>{ item1 }, null, PaymentMethod.CASH, 90, 0, DiscountType.FIXED, 10);
            order1.CreatedAt = date;

            var item2 = new OrderItem(Guid.NewGuid(), "Item2", 200, 1, null, null, 0, "");
            var order2 = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem>{ item2 }, null, PaymentMethod.CASH, 200, 0, null, 0);
            order2.CreatedAt = date;

            var item3 = new OrderItem(Guid.NewGuid(), "Item3", 50, 1, null, null, 0, "");
            var order3 = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem>{ item3 }, null, PaymentMethod.CASH, 50, 0, null, 0);
            order3.CreatedAt = date.AddDays(-1);

            var orders = new List<Order> { order1, order2, order3 };
            
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(orders);

            // Act
            var result = await _reportService.GetRevenueReportAsync(date.AddDays(-5), date.AddDays(1), "day");

            // Assert
            result.Should().HaveCount(2); // Today and Yesterday
            
            var todayReport = result.First(r => r.Period == date.ToString("yyyy-MM-dd"));
            todayReport.TotalRevenue.Should().Be(300); // 100 + 200 (SubTotal)
            todayReport.NetRevenue.Should().Be(290); // 90 + 200 (Total)
            todayReport.OrderCount.Should().Be(2);

            var yesterdayReport = result.First(r => r.Period == date.AddDays(-1).ToString("yyyy-MM-dd"));
            yesterdayReport.NetRevenue.Should().Be(50);
        }

        [Fact]
        public async Task GetProductSalesReportAsync_ShouldAggregateSales()
        {
            // Arrange
            var p1Id = Guid.NewGuid();
            var p2Id = Guid.NewGuid();
            var products = new List<Product>
            {
                new Product { Id = p1Id, Name = "Coffee", Price = 10 },
                new Product { Id = p2Id, Name = "Cake", Price = 5 }
            };
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(products);

            var orders = new List<Order>
            {
                new Order(
                    Guid.NewGuid(), // ClientOrderId 
                    OrderType.DINE_IN, 
                    new List<OrderItem> 
                    { 
                        new OrderItem(p1Id, "Coffee", 10, 2, null, null, 0, ""), // 2 Coffee = 20
                        new OrderItem(p2Id, "Cake", 5, 1, null, null, 0, "")     // 1 Cake = 5
                    }, 
                    1, PaymentMethod.CASH, 25, 0, null, 0, OrderStatus.SUCCESS, "", null)
            };
             _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(orders);

            // Act
            var result = await _reportService.GetProductSalesReportAsync(DateTimeOffset.Now, DateTimeOffset.Now);

            // Assert
            result.Should().HaveCount(2);
            
            var coffeeReport = result.First(p => p.ProductId == p1Id);
            coffeeReport.QuantitySold.Should().Be(2);
            coffeeReport.Revenue.Should().Be(20);

            var cakeReport = result.First(p => p.ProductId == p2Id);
            cakeReport.QuantitySold.Should().Be(1);
            cakeReport.Revenue.Should().Be(5);
        }

        [Fact]
        public async Task GetPaymentMethodReportAsync_ShouldAggregateByMethod()
        {
            // Arrange
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            var orders = new List<Order>
            {
                new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem>{ item }, null, PaymentMethod.CASH, 100, 0),
                new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem>{ item }, null, PaymentMethod.TRANSFER, 0, 100)
            };
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(orders);

            // Act
            var result = await _reportService.GetPaymentMethodReportAsync(DateTimeOffset.Now, DateTimeOffset.Now);

            // Assert
            result.Should().HaveCount(2);
            result.First(r => r.PaymentMethod == "CASH").Revenue.Should().Be(100);
        }

        [Fact]
        public async Task GetRevenueReportAsync_ShouldAggregateByWeek()
        {
            // Arrange
            var date = new DateTimeOffset(2024, 1, 15, 0, 0, 0, TimeSpan.Zero); // A Monday
            var o1 = CreateOrder(date, 100);
            var o2 = CreateOrder(date.AddDays(1), 200);
            
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(new List<Order> { o1, o2 });

            // Act
            var result = await _reportService.GetRevenueReportAsync(date.AddDays(-5), date.AddDays(10), "week");

            // Assert
            result.Should().HaveCount(1);
            result.First().Period.Should().Contain("Week of");
        }

        [Fact]
        public async Task GetRevenueReportAsync_ShouldAggregateByMonth()
        {
            // Arrange
            var date = new DateTimeOffset(2024, 1, 15, 0, 0, 0, TimeSpan.Zero);
            var o1 = CreateOrder(date, 100);
            var o2 = CreateOrder(date.AddMonths(1), 200);
            
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(new List<Order> { o1, o2 });

            // Act
            var result = await _reportService.GetRevenueReportAsync(date.AddDays(-5), date.AddMonths(2), "month");

            // Assert
            result.Should().HaveCount(2);
            result.First().Period.Should().Be("2024-01");
        }

        [Fact]
        public async Task GetDailyReportAsync_ShouldReturnReport()
        {
            // Arrange
            var date = DateTimeOffset.Now;
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 2, null, null, 0, "");
            var order = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem>{ item }, null, PaymentMethod.CASH, 100, 0);
            
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(new List<Order> { order });

            // Act
            var result = await _reportService.GetDailyReportAsync(date);

            // Assert
            result.OrderCount.Should().Be(1);
            result.TotalRevenue.Should().Be(200);
            result.RegularCupCount.Should().Be(2);
        }

        [Fact]
        public async Task GetRevenueReportAsync_ShouldAggregateByYear()
        {
            // Arrange
            var date = new DateTimeOffset(2024, 1, 15, 0, 0, 0, TimeSpan.Zero);
            var o1 = CreateOrder(date, 100);
            var o2 = CreateOrder(date.AddYears(1), 200);
            
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(new List<Order> { o1, o2 });

            // Act
            var result = await _reportService.GetRevenueReportAsync(date.AddDays(-5), date.AddYears(2), "year");

            // Assert
            result.Should().HaveCount(2);
            result.First().Period.Should().Be("2024");
        }

        [Fact]
        public async Task GetRevenueReportAsync_ShouldFallbackToDay_WhenGroupingInvalid()
        {
            // Arrange
            var date = DateTimeOffset.UtcNow.Date;
            var o1 = CreateOrder(date, 100);
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(new List<Order> { o1 });

            // Act
            var result = await _reportService.GetRevenueReportAsync(date, date.AddDays(1), "invalid");

            // Assert
            result.First().Period.Should().Be(date.ToString("yyyy-MM-dd"));
        }

        [Fact]
        public async Task GetProductSalesReportAsync_ShouldFilterByCategory()
        {
            // Arrange
            var p1Id = Guid.NewGuid();
            var products = new List<Product>
            {
                new Product { Id = p1Id, Name = "Coffee", Price = 10, Category = new Category { Name = "Drinks" } }
            };
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(products);

            var orders = new List<Order>
            {
                new Order(Guid.NewGuid(), OrderType.DINE_IN, new List<OrderItem> { new OrderItem(p1Id, "Coffee", 10, 1, null, null, 0, "") }, 1, PaymentMethod.CASH, 10, 0)
            };
             _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(It.IsAny<DateTimeOffset>(), It.IsAny<DateTimeOffset>(), _shopId))
                .ReturnsAsync(orders);

            // Act
            var result = await _reportService.GetProductSalesReportAsync(DateTimeOffset.Now, DateTimeOffset.Now, "Drinks");

            // Assert
            result.Should().HaveCount(1);
            
            var result2 = await _reportService.GetProductSalesReportAsync(DateTimeOffset.Now, DateTimeOffset.Now, "Food");
            result2.Should().BeEmpty();
        }

        [Theory]
        [InlineData("DAY")]
        [InlineData("WEEK")]
        [InlineData("MONTH")]
        [InlineData("YEAR")]
        [InlineData("INVALID")]
        public async Task GetRevenueReportAsync_ShouldWorkWithVariousGroupings(string groupBy)
        {
            // Arrange
            _shopContextMock.Setup(s => s.GetShopId()).Returns(_shopId);
            var start = DateTimeOffset.UtcNow.AddMonths(-1);
            var end = DateTimeOffset.UtcNow;
            _orderRepositoryMock.Setup(r => r.GetOrdersByDateRangeAsync(start, end, _shopId)).ReturnsAsync(new List<Order>());

            // Act
            await _reportService.GetRevenueReportAsync(start, end, groupBy);

            // Assert
            _orderRepositoryMock.Verify(r => r.GetOrdersByDateRangeAsync(start, end, _shopId), Times.Once);
        }
    }
}
