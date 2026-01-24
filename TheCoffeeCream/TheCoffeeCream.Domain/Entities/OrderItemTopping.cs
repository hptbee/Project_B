using System;

namespace TheCoffeeCream.Domain.Entities
{
    // Snapshot of a topping at order time
    public class OrderItemTopping
    {
        public Guid ProductId { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public decimal Price { get; private set; }

        private OrderItemTopping() { }

        public OrderItemTopping(Guid productId, string name, decimal price)
        {
            if (productId == Guid.Empty) throw new ArgumentException("productId required", nameof(productId));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));
            if (price < 0) throw new ArgumentException("price must be >= 0", nameof(price));

            ProductId = productId;
            Name = name;
            Price = price;
        }
    }
}
