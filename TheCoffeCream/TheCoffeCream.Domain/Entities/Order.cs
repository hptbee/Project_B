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
        public PaymentMethod PaymentMethod { get; private set; }
        public decimal CashAmount { get; private set; }
        public decimal TransferAmount { get; private set; }
        public DiscountType? DiscountType { get; private set; }
        public decimal DiscountValue { get; private set; }

        public OrderStatus Status { get; private set; }
        public string Note { get; private set; } = string.Empty;

        public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();

        private readonly List<OrderItem> _items = new();

        public decimal SubTotal => _items.Sum(i => i.Total);

        public decimal DiscountAmount
        {
            get
            {
                if (DiscountType == Entities.DiscountType.PERCENTAGE)
                    return SubTotal * (DiscountValue / 100);
                if (DiscountType == Entities.DiscountType.FIXED)
                    return DiscountValue;
                return 0;
            }
        }

        public decimal Total => SubTotal - DiscountAmount;

        private Order() { }

        public Order(
            Guid clientOrderId, 
            OrderType orderType, 
            IEnumerable<OrderItem> items, 
            int? tableNumber = null,
            PaymentMethod paymentMethod = PaymentMethod.CASH,
            decimal cashAmount = 0,
            decimal transferAmount = 0,
            DiscountType? discountType = null,
            decimal discountValue = 0,
            OrderStatus status = OrderStatus.SUCCESS,
            string? note = null,
            Guid? id = null)
        {
            if (clientOrderId == Guid.Empty) throw new ArgumentException("clientOrderId required", nameof(clientOrderId));
            if (items == null) throw new ArgumentNullException(nameof(items));

            var itemList = items.ToList();
            if (!itemList.Any()) throw new ArgumentException("Order must contain at least one item", nameof(items));

            if (orderType == OrderType.DINE_IN && tableNumber == null)
                throw new ArgumentException("DINE_IN orders must have a table number", nameof(tableNumber));

            Id = id ?? Guid.NewGuid();
            ClientOrderId = clientOrderId;
            CreatedAt = DateTimeOffset.UtcNow;
            OrderType = orderType;
            TableNumber = tableNumber;
            PaymentMethod = paymentMethod;
            CashAmount = cashAmount;
            TransferAmount = transferAmount;
            DiscountType = discountType;
            DiscountValue = discountValue;
            Status = status;
            Note = note ?? string.Empty;

            _items.AddRange(itemList);

            // Validation
            if (paymentMethod == PaymentMethod.CASH && cashAmount == 0) CashAmount = Total;
            if (paymentMethod == PaymentMethod.TRANSFER && transferAmount == 0) TransferAmount = Total;

            if (paymentMethod == PaymentMethod.COMBINED && Math.Abs(CashAmount + TransferAmount - Total) > 0.001m)
                throw new ArgumentException($"Cash amount ({CashAmount}) + Transfer amount ({TransferAmount}) must equal Total ({Total}) for combined payment");
        }
    }
}
