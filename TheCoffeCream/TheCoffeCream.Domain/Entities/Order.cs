using System;
using System.Collections.Generic;
using System.Linq;

namespace TheCoffeCream.Domain.Entities
{
    public class Order
    {
        public Guid Id { get; private set; }
        public Guid ClientOrderId { get; private set; }
        public DateTimeOffset CreatedAt { get; private set; }
        public OrderType OrderType { get; private set; }
        public int? TableNumber { get; private set; }
        public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();

        private readonly List<OrderItem> _items = new();

        public decimal Total => _items.Sum(i => i.Total);

        private Order() { }

        public Order(Guid clientOrderId, OrderType orderType, IEnumerable<OrderItem> items, int? tableNumber = null)
        {
            if (clientOrderId == Guid.Empty) throw new ArgumentException("clientOrderId required", nameof(clientOrderId));
            if (items == null) throw new ArgumentNullException(nameof(items));

            var itemList = items.ToList();
            if (!itemList.Any()) throw new ArgumentException("Order must contain at least one item", nameof(items));

            if (orderType == OrderType.DINE_IN && tableNumber == null)
                throw new ArgumentException("DINE_IN orders must have a table number", nameof(tableNumber));

            Id = Guid.NewGuid();
            ClientOrderId = clientOrderId;
            CreatedAt = DateTimeOffset.UtcNow;
            OrderType = orderType;
            TableNumber = tableNumber;

            _items.AddRange(itemList);
        }
    }
}
