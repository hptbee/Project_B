using System;
using System.Collections.Generic;

namespace TheCoffeCream.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; private set; }
        public string Category { get; private set; } = string.Empty;
        public string Code { get; private set; } = string.Empty;
        public string Name { get; private set; } = string.Empty;
        public decimal Cost { get; private set; }
        public decimal Price { get; private set; }
        public string ImageUrl { get; private set; } = string.Empty;
        public bool IsActive { get; private set; }
        public bool IsTopping { get; private set; }
        // New mapping string: stores topping product ids separated by ';'
        public string ToppingMapping { get; private set; } = string.Empty;
        
        // Embedded toppings (now Products themselves)
        public IReadOnlyList<Product> Toppings => _toppings.AsReadOnly();

        private readonly List<Product> _toppings = new();

        private Product() { }

        public Product(Guid id, string name, decimal price, bool isTopping = false, string? category = null, string? code = null, decimal cost = 0, string? imageUrl = null, bool isActive = true, IEnumerable<Product>? toppings = null, string? toppingMapping = null)
        {
            if (id == Guid.Empty) throw new ArgumentException("id required", nameof(id));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));
            if (price < 0) throw new ArgumentException("price must be >= 0", nameof(price));

            Id = id;
            Name = name;
            Price = price;
            IsTopping = isTopping;
            Category = category ?? string.Empty;
            Code = code ?? string.Empty;
            Cost = cost;
            ImageUrl = imageUrl ?? string.Empty;
            IsActive = isActive;
            ToppingMapping = toppingMapping ?? string.Empty;

            if (toppings != null)
                _toppings.AddRange(toppings);
        }
    }
}
