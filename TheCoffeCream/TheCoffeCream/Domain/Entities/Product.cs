using System;

namespace TheCoffeCream.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;
        public decimal Price { get; private set; }
        public Guid? CategoryId { get; private set; }
        public string ImageUrl { get; private set; } = string.Empty;
        // Allowed topping ids for this product definition
        public IReadOnlyList<Guid> AllowedToppingIds => _allowedToppingIds.AsReadOnly();

        private readonly List<Guid> _allowedToppingIds = new();

        private Product() { }

        public Product(Guid id, string name, decimal price, string? description = null, Guid? categoryId = null, string? imageUrl = null, IEnumerable<Guid>? allowedToppingIds = null)
        {
            if (id == Guid.Empty) throw new ArgumentException("id required", nameof(id));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));
            if (price < 0) throw new ArgumentException("price must be >= 0", nameof(price));

            Id = id;
            Name = name;
            Price = price;
            Description = description ?? string.Empty;
            CategoryId = categoryId;
            ImageUrl = imageUrl ?? string.Empty;

            if (allowedToppingIds != null)
                _allowedToppingIds.AddRange(allowedToppingIds);
        }
    }
}
