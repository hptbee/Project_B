using System;
using System.Collections.Generic;
using Xunit;
using FluentAssertions;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Tests
{
    public class DomainTests
    {
        [Fact]
        public void Order_Constructor_ShouldThrow_WhenClientIdEmpty()
        {
            var items = new List<OrderItem> { new OrderItem(Guid.NewGuid(), "Item", 10, 1, null, null, 0, "") };
            Action act = () => new Order(Guid.Empty, OrderType.TAKE_AWAY, items);
            act.Should().Throw<ArgumentException>().WithParameterName("clientOrderId");
        }

        [Fact]
        public void Order_Constructor_ShouldThrow_WhenItemsEmpty()
        {
            Action act = () => new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem>());
            act.Should().Throw<ArgumentException>().WithMessage("*at least one item*");
        }

        [Fact]
        public void Order_Constructor_ShouldThrow_WhenDineInMissingTable()
        {
            var items = new List<OrderItem> { new OrderItem(Guid.NewGuid(), "Item", 10, 1, null, null, 0, "") };
            Action act = () => new Order(Guid.NewGuid(), OrderType.DINE_IN, items, tableNumber: null);
            act.Should().Throw<ArgumentException>().WithMessage("*table number*");
        }

        [Fact]
        public void Order_Constructor_ShouldThrow_WhenCombinedPaymentMismatch()
        {
            var items = new List<OrderItem> { new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "") };
            // Total = 100. Cash(50) + Transfer(40) = 90 != 100
            Action act = () => new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, items, 
                paymentMethod: PaymentMethod.COMBINED, cashAmount: 50, transferAmount: 40);
            act.Should().Throw<ArgumentException>().WithMessage("*must equal Total*");
        }

        [Fact]
        public void Order_Properties_ShouldCalculateCorrectly()
        {
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            var order = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem> { item }, 
                discountType: DiscountType.PERCENTAGE, discountValue: 10);

            order.SubTotal.Should().Be(100);
            order.DiscountAmount.Should().Be(10);
            order.Total.Should().Be(90);

            var fixedOrder = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem> { item }, 
                discountType: DiscountType.FIXED, discountValue: 15);
            fixedOrder.DiscountAmount.Should().Be(15);
            fixedOrder.Total.Should().Be(85);
        }

        [Fact]
        public void Order_Constructor_ShouldAutoFillAmounts_ForSinglePayment()
        {
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            
            var cashOrder = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem> { item }, paymentMethod: PaymentMethod.CASH);
            cashOrder.CashAmount.Should().Be(100);
            cashOrder.TransferAmount.Should().Be(0);

            var transferOrder = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem> { item }, paymentMethod: PaymentMethod.TRANSFER);
            transferOrder.TransferAmount.Should().Be(100);
            transferOrder.CashAmount.Should().Be(0);
        }

        [Fact]
        public void Order_Constructor_ShouldNotAutoFill_WhenAmountProvided()
        {
            var item = new OrderItem(Guid.NewGuid(), "Item", 100, 1, null, null, 0, "");
            
            var cashOrder = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem> { item }, paymentMethod: PaymentMethod.CASH, cashAmount: 50);
            cashOrder.CashAmount.Should().Be(50); // Not auto-filled to 100

            var transferOrder = new Order(Guid.NewGuid(), OrderType.TAKE_AWAY, new List<OrderItem> { item }, paymentMethod: PaymentMethod.TRANSFER, transferAmount: 60);
            transferOrder.TransferAmount.Should().Be(60); // Not auto-filled to 100
        }

        [Fact]
        public void OrderItem_Constructor_ShouldThrow_WhenUnitPriceNegative()
        {
            Action act = () => new OrderItem(Guid.NewGuid(), "Item", -1, 1);
            act.Should().Throw<ArgumentException>().WithMessage("*unitPrice*");
        }

        [Fact]
        public void OrderItem_Constructor_ShouldThrow_WhenQuantityNonPositive()
        {
            Action act = () => new OrderItem(Guid.NewGuid(), "Item", 10, 0);
            act.Should().Throw<ArgumentException>().WithMessage("*quantity*");
        }

        [Fact]
        public void OrderItem_Total_ShouldIncludeToppings()
        {
            var topping = new OrderItemTopping(Guid.NewGuid(), "Sugar", 5, "S01");
            var item = new OrderItem(Guid.NewGuid(), "Coffee", 10, 2, new List<OrderItemTopping> { topping }, null, 0, "");
            
            // (10 + 5) * 2 = 30
            item.Total.Should().Be(30);
        }

        [Fact]
        public void Product_Constructor_ShouldThrow_WhenIdEmpty()
        {
            Action act = () => new Product(Guid.Empty, "Name", 10);
            act.Should().Throw<ArgumentException>().WithParameterName("id");
        }

        [Fact]
        public void Product_Constructor_ShouldThrow_WhenNameEmpty()
        {
            Action act = () => new Product(Guid.NewGuid(), "", 10);
            act.Should().Throw<ArgumentException>().WithParameterName("name");
        }
    }
}
