using System;
using System.Collections.Generic;
using System.Linq;

namespace TheCoffeCream.Domain.Entities
{
    public class OrderItem
    {
        public Guid ProductId { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public decimal UnitPrice { get; private set; }
        public int Quantity { get; private set; }

        public IReadOnlyList<OrderItemTopping> SelectedToppings => _selectedToppings.AsReadOnly();

        private readonly List<OrderItemTopping> _selectedToppings = new();

        public decimal Total => UnitPrice * Quantity + _selectedToppings.Sum(t => t.Price);

        private OrderItem() { }

        // Backwards-compatible constructor (no toppings)
        public OrderItem(Guid productId, string name, decimal unitPrice, int quantity)
            : this(productId, name, unitPrice, quantity, null)
        {
        }

        // New constructor supporting selected topping snapshots
        public OrderItem(Guid productId, string name, decimal unitPrice, int quantity, IEnumerable<OrderItemTopping>? selectedToppings)
        {
            if (productId == Guid.Empty) throw new ArgumentException("productId required", nameof(productId));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));
            if (unitPrice < 0) throw new ArgumentException("unitPrice must be >= 0", nameof(unitPrice));
            if (quantity <= 0) throw new ArgumentException("quantity must be > 0", nameof(quantity));

            ProductId = productId;
            Name = name;
            UnitPrice = unitPrice;
            Quantity = quantity;

            if (selectedToppings != null)
                _selectedToppings.AddRange(selectedToppings);
        }
    }
}
