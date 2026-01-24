using System;
using System.Collections.Generic;

namespace TheCoffeeCream.Application.DTOs
{
    public class OrderResponse
    {
        public Guid Id { get; set; }
        public Guid ClientOrderId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public string OrderType { get; set; } = string.Empty;
        public int? TableNumber { get; set; }
        public decimal SubTotal { get; set; }
        public string? DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public decimal DiscountAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal CashAmount { get; set; }
        public decimal TransferAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public List<OrderItemResponse> Items { get; set; } = new();
        public decimal Total { get; set; }
    }

    public class OrderItemResponse
    {
        public Guid ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public string? DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal Total { get; set; }
        public string Note { get; set; } = string.Empty;
        public List<ProductDto>? SelectedToppings { get; set; }
    }
}
