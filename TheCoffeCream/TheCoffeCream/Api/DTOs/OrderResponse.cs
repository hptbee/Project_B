using System;
using System.Collections.Generic;

namespace TheCoffeCream.Api.DTOs
{
    public class OrderResponse
    {
        public Guid Id { get; set; }
        public Guid ClientOrderId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public string OrderType { get; set; } = string.Empty;
        public int? TableNumber { get; set; }
        public List<OrderItemResponse> Items { get; set; } = new();
        public decimal Total { get; set; }
    }

    public class OrderItemResponse
    {
        public Guid ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Total { get; set; }
        public List<ToppingDto>? SelectedToppings { get; set; }
    }
}
