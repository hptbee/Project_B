using System;
using System.Collections.Generic;

namespace TheCoffeCream.Api.DTOs
{
    public class CreateOrderRequest
    {
        public Guid ClientOrderId { get; set; }
        public string OrderType { get; set; } = "TAKE_AWAY";
        public int? TableNumber { get; set; }
        public List<CreateOrderItemRequest> Items { get; set; } = new();
    }

    public class CreateOrderItemRequest
    {
        public Guid ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        // Optional: selected topping ids to snapshot prices at order time. Backwards compatible when omitted.
        public List<Guid>? SelectedToppingIds { get; set; }
    }
}
