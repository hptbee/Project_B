using System;
using System.Collections.Generic;

namespace TheCoffeCream.Application.DTOs
{
    public class CreateOrderRequest
    {
        public Guid ClientOrderId { get; set; }
        public string OrderType { get; set; } = "TAKE_AWAY";
        public int? TableNumber { get; set; }
        public string PaymentMethod { get; set; } = "CASH";
        public decimal CashAmount { get; set; }
        public decimal TransferAmount { get; set; }
        public string? DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public string Status { get; set; } = "SUCCESS";
        public string? Note { get; set; }
        public List<CreateOrderItemRequest> Items { get; set; } = new();
    }

    public class CreateOrderItemRequest
    {
        public Guid ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public string? DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public string? Note { get; set; }
        // Optional: selected topping names to snapshot prices at order time.
        public List<string>? SelectedToppingNames { get; set; }
    }
}
