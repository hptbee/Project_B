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
            // idempotency check - allow if it's a draft update
            var existing = await _orderRepository.GetByClientOrderIdAsync(request.ClientOrderId);
            if (existing != null && existing.Status != OrderStatus.DRAFT)
                throw new InvalidOperationException("This order has already been finalized and cannot be modified.");

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

                return new OrderItem(i.ProductId, i.Name, i.UnitPrice, i.Quantity, selected, itemDiscountType, i.DiscountValue, i.Note);
            });

            DiscountType? orderDiscountType = null;
            if (!string.IsNullOrEmpty(request.DiscountType) && Enum.TryParse<DiscountType>(request.DiscountType, true, out var odt))
                orderDiscountType = odt;

            if (!Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var paymentMethod))
                paymentMethod = PaymentMethod.CASH;

            if (!Enum.TryParse<OrderStatus>(request.Status, true, out var status))
                status = OrderStatus.SUCCESS;

            Guid? existingId = existing?.Id;

            var order = new Order(
                request.ClientOrderId, 
                orderType, 
                items, 
                request.TableNumber,
                paymentMethod,
                request.CashAmount,
                request.TransferAmount,
                orderDiscountType,
                request.DiscountValue,
                status,
                request.Note,
                existingId);

            await _orderRepository.AddAsync(order);

            return order;
        }
        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            return await _orderRepository.GetOrdersByDateRangeAsync(startDate, endDate);
        }

        public async Task<Order?> GetOrderByIdAsync(Guid id)
        {
            return await _orderRepository.GetByIdAsync(id);
        }
    }
}
