using System;

namespace TheCoffeeCream.Domain.Entities
{
    public class SubscriptionHistory
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ShopId { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public int DurationDays { get; set; }
        public DateTimeOffset PurchaseDate { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset NewExpiryDate { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = "SUCCESS"; // SUCCESS, PENDING, CANCELLED
        public string? ShopName { get; set; } // Populated from join
    }
}
