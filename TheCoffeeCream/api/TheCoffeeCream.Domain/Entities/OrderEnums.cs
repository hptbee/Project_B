namespace TheCoffeeCream.Domain.Entities
{
    public enum PaymentMethod
    {
        CASH,
        TRANSFER,
        COMBINED
    }

    public enum DiscountType
    {
        FIXED,
        PERCENTAGE
    }

    public enum OrderStatus
    {
        DRAFT,
        PENDING,
        SUCCESS,
        REMOVED
    }
}
