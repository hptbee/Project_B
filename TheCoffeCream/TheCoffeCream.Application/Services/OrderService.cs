using System;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeCream.Application.DTOs;
using TheCoffeCream.Domain.Entities;
using TheCoffeCream.Application.Interfaces;

namespace TheCoffeCream.Application.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
        {
            // idempotency check
            if (await _orderRepository.ExistsByClientOrderIdAsync(request.ClientOrderId))
                throw new InvalidOperationException("Order with this clientOrderId already exists");

            if (!Enum.TryParse<OrderType>(request.OrderType, true, out var orderType))
                throw new ArgumentException("Invalid orderType", nameof(request.OrderType));

            // Load all products to lookup toppings
            var allProducts = (await _productRepository.GetAllAsync()).ToDictionary(p => p.Id);

            var items = request.Items.Select(i =>
            {
                System.Collections.Generic.List<OrderItemTopping>? selected = null;
                DiscountType? itemDiscountType = null;
                if (!string.IsNullOrEmpty(i.DiscountType) && Enum.TryParse<DiscountType>(i.DiscountType, true, out var dt))
                    itemDiscountType = dt;

                if (allProducts.TryGetValue(i.ProductId, out var product))
                { 
                     if (i.SelectedToppingNames != null && i.SelectedToppingNames.Any())
                     {
                        // Match selected topping names with product's available toppings
                        var productToppings = product.Toppings.ToDictionary(t => t.Name, StringComparer.OrdinalIgnoreCase);
                        
                        selected = i.SelectedToppingNames
                            .Where(name => productToppings.ContainsKey(name))
                            .Select(name => new OrderItemTopping(productToppings[name].Id, productToppings[name].Name, productToppings[name].Price))
                            .ToList();
                     }
                }

                return new OrderItem(i.ProductId, i.Name, i.UnitPrice, i.Quantity, selected, itemDiscountType, i.DiscountValue);
            });

            DiscountType? orderDiscountType = null;
            if (!string.IsNullOrEmpty(request.DiscountType) && Enum.TryParse<DiscountType>(request.DiscountType, true, out var odt))
                orderDiscountType = odt;

            if (!Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var paymentMethod))
                paymentMethod = PaymentMethod.CASH;

            var order = new Order(
                request.ClientOrderId, 
                orderType, 
                items, 
                request.TableNumber,
                paymentMethod,
                request.CashAmount,
                request.TransferAmount,
                orderDiscountType,
                request.DiscountValue);

            await _orderRepository.AddAsync(order);

            return order;
        }
    }
}
