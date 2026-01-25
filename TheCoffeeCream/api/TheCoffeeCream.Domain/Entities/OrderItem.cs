using System;
using System.Collections.Generic;
using System.Linq;

namespace TheCoffeeCream.Domain.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }

        public DiscountType? DiscountType { get; set; }
        public decimal DiscountValue { get; set; }

        public string Note { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public IReadOnlyList<OrderItemTopping> SelectedToppings => _selectedToppings.AsReadOnly();

        private readonly List<OrderItemTopping> _selectedToppings = new();

        public decimal DiscountAmount
        {
            get
            {
                var baseTotal = UnitPrice * Quantity + _selectedToppings.Sum(t => t.Price) * Quantity;
                if (DiscountType == Entities.DiscountType.PERCENTAGE)
                    return baseTotal * (DiscountValue / 100);
                if (DiscountType == Entities.DiscountType.FIXED)
                    return DiscountValue;
                return 0;
            }
        }

        public decimal Total => (UnitPrice * Quantity + _selectedToppings.Sum(t => t.Price) * Quantity) - DiscountAmount;

        private OrderItem() { }

        // Backwards-compatible constructor (no toppings, no discount, no note)
        public OrderItem(Guid productId, string name, decimal unitPrice, int quantity)
            : this(productId, name, unitPrice, quantity, null, null, 0, null)
        {
        }

        // New constructor supporting selected topping snapshots, discounts and notes
        public OrderItem(Guid productId, string name, decimal unitPrice, int quantity, IEnumerable<OrderItemTopping>? selectedToppings, DiscountType? discountType = null, decimal discountValue = 0, string? note = null)
        {
            if (productId == Guid.Empty) throw new ArgumentException("productId required", nameof(productId));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));
            if (unitPrice < 0) throw new ArgumentException("unitPrice must be >= 0", nameof(unitPrice));
            if (quantity <= 0) throw new ArgumentException("quantity must be > 0", nameof(quantity));

            ProductId = productId;
            Name = name;
            UnitPrice = unitPrice;
            Quantity = quantity;
            DiscountType = discountType;
            DiscountValue = discountValue;
            Note = note ?? string.Empty;

            if (selectedToppings != null)
                _selectedToppings.AddRange(selectedToppings);
        }
    }
}
