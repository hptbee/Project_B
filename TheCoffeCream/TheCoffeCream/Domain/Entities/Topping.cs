using System;

namespace TheCoffeCream.Domain.Entities
{
    public class Topping
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public decimal Price { get; private set; }

        private Topping() { }

        public Topping(Guid id, string name, decimal price)
        {
            if (id == Guid.Empty) throw new ArgumentException("id required", nameof(id));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));
            if (price < 0) throw new ArgumentException("price must be >= 0", nameof(price));

            Id = id;
            Name = name;
            Price = price;
        }
    }
}
