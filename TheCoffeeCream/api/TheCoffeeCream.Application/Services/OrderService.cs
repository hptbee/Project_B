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
        private readonly Microsoft.AspNetCore.Http.IHttpContextAccessor _httpContextAccessor;

        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository, Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetShopId()
        {
            var shopId = _httpContextAccessor.HttpContext?.User?.FindFirst("shopId")?.Value;
            if (string.IsNullOrEmpty(shopId)) throw new System.UnauthorizedAccessException("ShopId not found in user context.");
            return shopId;
        }

        public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
        {
            var shopId = GetShopId();
            var existing = await _orderRepository.GetByClientOrderIdAsync(request.ClientOrderId, shopId);
            if (existing != null && existing.Status != OrderStatus.DRAFT)
                throw new InvalidOperationException("This order has already been finalized and cannot be modified.");

            var orderType = ParseEnum<OrderType>(request.OrderType, OrderType.DINE_IN);
            var allProducts = (await _productRepository.GetAllAsync(shopId)).ToDictionary(p => p.Id);

            var items = request.Items.Select(i =>
            {
                var itemDiscountType = ParseNullableEnum<DiscountType>(i.DiscountType);
                var selected = ResolveToppings(i, allProducts);
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
                existing?.Id)
            {
                ShopId = shopId
            };

            await _orderRepository.AddAsync(order);
            return order;
        }

        public async Task UpdateOrderAsync(Guid id, CreateOrderRequest request)
        {
            var shopId = GetShopId();
            var existing = await _orderRepository.GetByIdAsync(id, shopId);
            if (existing == null) throw new ArgumentException("Order not found");

            var allProducts = (await _productRepository.GetAllAsync(shopId)).ToDictionary(p => p.Id);

            var items = request.Items.Select(i =>
            {
                var selected = ResolveToppings(i, allProducts);
                return new OrderItem(
                    i.ProductId,
                    i.Name,
                    i.UnitPrice,
                    i.Quantity,
                    selected,
                    ParseNullableEnum<DiscountType>(i.DiscountType),
                    i.DiscountValue,
                    i.Note);
            });

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

        private System.Collections.Generic.List<OrderItemTopping>? ResolveToppings(CreateOrderItemRequest itemRequest, System.Collections.Generic.Dictionary<Guid, Product> allProducts)
        {
            if (!allProducts.TryGetValue(itemRequest.ProductId, out var product)) return null;
            if ((itemRequest.SelectedToppingNames?.Any() != true) && (itemRequest.SelectedToppingCodes?.Any() != true)) return null;

            var selected = new System.Collections.Generic.List<OrderItemTopping>();
            var productToppings = product.Toppings;

            if (itemRequest.SelectedToppingNames?.Any() == true)
            {
                foreach (var name in itemRequest.SelectedToppingNames)
                {
                    var match = productToppings.FirstOrDefault(t => t.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                    if (match != null) selected.Add(new OrderItemTopping(match.Id, match.Name, match.Price, match.Code));
                }
            }

            if (itemRequest.SelectedToppingCodes?.Any() == true)
            {
                foreach (var code in itemRequest.SelectedToppingCodes)
                {
                    if (selected.Any(s => s.Code.Equals(code, StringComparison.OrdinalIgnoreCase))) continue;

                    var match = productToppings.FirstOrDefault(t => t.Code.Equals(code, StringComparison.OrdinalIgnoreCase));
                    if (match != null) selected.Add(new OrderItemTopping(match.Id, match.Name, match.Price, match.Code));
                }
            }

            return selected.Any() ? selected : null;
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
            return await _orderRepository.GetOrdersByDateRangeAsync(startDate, endDate, GetShopId());
        }

        public async Task<Order?> GetOrderByIdAsync(Guid id)
        {
            return await _orderRepository.GetByIdAsync(id, GetShopId());
        }

        public async Task SoftDeleteOrderAsync(Guid id)
        {
            await _orderRepository.ToggleActiveAsync(id, GetShopId());
        }

        public async Task UpdateOrderPaymentMethodAsync(Guid id, UpdatePaymentMethodRequest request)
        {
            var existing = await _orderRepository.GetByIdAsync(id, GetShopId());
            if (existing == null) throw new ArgumentException("Order not found");

            var paymentMethod = ParseEnum<PaymentMethod>(request.PaymentMethod, PaymentMethod.CASH);
            
            // Re-construct the order with new payment details
            // Order is immutable-ish but we can use the constructor to create a modified copy (or just modify properties)
            // Since Order properties like PaymentMethod are public with set, we could modify them directly if domain allows.
            // Checking Order.cs... properties have public setters.
            
            // Start with partial amounts from request
            existing.PaymentMethod = paymentMethod;
            existing.CashAmount = request.CashAmount;
            existing.TransferAmount = request.TransferAmount;

            // Enforce Full Amount for Single Payment Methods
            if (existing.PaymentMethod == PaymentMethod.CASH)
            {
                existing.CashAmount = existing.Total;
                existing.TransferAmount = 0;
            }
            else if (existing.PaymentMethod == PaymentMethod.TRANSFER)
            {
                existing.TransferAmount = existing.Total;
                existing.CashAmount = 0;
            }
            else if (existing.PaymentMethod == PaymentMethod.COMBINED)
            {
                if (Math.Abs(existing.CashAmount + existing.TransferAmount - existing.Total) > 0.001m)
                    throw new ArgumentException($"Cash amount ({existing.CashAmount}) + Transfer amount ({existing.TransferAmount}) must equal Total ({existing.Total})");
            }

            await _orderRepository.UpdateAsync(existing);
        }
    }
}
