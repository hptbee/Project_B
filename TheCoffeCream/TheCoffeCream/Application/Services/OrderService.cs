using System;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeCream.Api.DTOs;
using TheCoffeCream.Domain.Entities;
using TheCoffeCream.Infrastructure.Interfaces;

namespace TheCoffeCream.Application.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly TheCoffeCream.Infrastructure.Interfaces.IProductRepository _productRepository;

        public OrderService(IOrderRepository orderRepository, TheCoffeCream.Infrastructure.Interfaces.IProductRepository productRepository)
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

            // Build items, snapshot topping prices if provided
            var toppings = (await _productRepository.GetToppingsAsync()).ToDictionary(t => t.Id);

            var items = request.Items.Select(i =>
            {
                List<Domain.Entities.OrderItemTopping>? selected = null;
                if (i.SelectedToppingIds != null && i.SelectedToppingIds.Any())
                {
                    selected = i.SelectedToppingIds.Where(id => toppings.ContainsKey(id))
                        .Select(id => new Domain.Entities.OrderItemTopping(id, toppings[id].Name, toppings[id].Price))
                        .ToList();
                }

                if (selected == null)
                    return new OrderItem(i.ProductId, i.Name, i.UnitPrice, i.Quantity);

                return new OrderItem(i.ProductId, i.Name, i.UnitPrice, i.Quantity, selected);
            });

            var order = new Order(request.ClientOrderId, orderType, items, request.TableNumber);

            await _orderRepository.AddAsync(order);

            return order;
        }
    }
}
