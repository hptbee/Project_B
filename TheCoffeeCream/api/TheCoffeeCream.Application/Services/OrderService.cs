using System;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Application.Interfaces;

namespace TheCoffeeCream.Application.Services
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
            var existing = await _orderRepository.GetByClientOrderIdAsync(request.ClientOrderId);
            if (existing != null && existing.Status != OrderStatus.DRAFT)
                throw new InvalidOperationException("This order has already been finalized and cannot be modified.");

            var orderType = ParseEnum<OrderType>(request.OrderType, OrderType.DINE_IN);
            var allProducts = (await _productRepository.GetAllAsync()).ToDictionary(p => p.Id);

            var items = request.Items.Select(i =>
            {
                var itemDiscountType = ParseNullableEnum<DiscountType>(i.DiscountType);
                System.Collections.Generic.List<OrderItemTopping>? selected = null;

                if (allProducts.TryGetValue(i.ProductId, out var product) && i.SelectedToppingNames?.Any() == true)
                {
                    var productToppings = product.Toppings.ToDictionary(t => t.Name, StringComparer.OrdinalIgnoreCase);
                    selected = i.SelectedToppingNames
                        .Where(name => productToppings.ContainsKey(name))
                        .Select(name => new OrderItemTopping(productToppings[name].Id, productToppings[name].Name, productToppings[name].Price))
                        .ToList();
                }

                return new OrderItem(i.ProductId, i.Name, i.UnitPrice, i.Quantity, selected, itemDiscountType, i.DiscountValue, i.Note);
            });

            var order = new Order(
                request.ClientOrderId,
                orderType,
                items,
                request.TableNumber,
                ParseEnum<PaymentMethod>(request.PaymentMethod, PaymentMethod.CASH),
                request.CashAmount,
                request.TransferAmount,
                ParseNullableEnum<DiscountType>(request.DiscountType),
                request.DiscountValue,
                ParseEnum<OrderStatus>(request.Status, OrderStatus.SUCCESS),
                request.Note,
                existing?.Id);

            await _orderRepository.AddAsync(order);
            return order;
        }

        public async Task UpdateOrderAsync(Guid id, CreateOrderRequest request)
        {
            var existing = await _orderRepository.GetByIdAsync(id);
            if (existing == null) throw new ArgumentException("Order not found");

            var items = request.Items.Select(i => new OrderItem(
                i.ProductId,
                i.Name,
                i.UnitPrice,
                i.Quantity,
                null,
                ParseNullableEnum<DiscountType>(i.DiscountType),
                i.DiscountValue,
                i.Note));

            var order = new Order(
                request.ClientOrderId,
                ParseEnum<OrderType>(request.OrderType, OrderType.DINE_IN),
                items,
                request.TableNumber,
                ParseEnum<PaymentMethod>(request.PaymentMethod, PaymentMethod.CASH),
                request.CashAmount,
                request.TransferAmount,
                ParseNullableEnum<DiscountType>(request.DiscountType),
                request.DiscountValue,
                ParseEnum<OrderStatus>(request.Status, OrderStatus.SUCCESS),
                request.Note,
                id)
            {
                CreatedAt = existing.CreatedAt,
                IsActive = existing.IsActive
            };

            await _orderRepository.UpdateAsync(order);
        }

        private static T ParseEnum<T>(string value, T defaultValue) where T : struct
        {
            if (string.IsNullOrEmpty(value)) return defaultValue;
            return Enum.TryParse<T>(value, true, out var result) ? result : defaultValue;
        }

        private static T? ParseNullableEnum<T>(string value) where T : struct
        {
            if (string.IsNullOrEmpty(value)) return null;
            return Enum.TryParse<T>(value, true, out var result) ? result : (T?)null;
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            return await _orderRepository.GetOrdersByDateRangeAsync(startDate, endDate);
        }

        public async Task<Order?> GetOrderByIdAsync(Guid id)
        {
            return await _orderRepository.GetByIdAsync(id);
        }

        public async Task SoftDeleteOrderAsync(Guid id)
        {
            await _orderRepository.ToggleActiveAsync(id);
        }
    }
}
