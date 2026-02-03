using System;

namespace TheCoffeeCream.Domain.Entities
{
    public class Shop
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
        public string TaxCode { get; set; } = string.Empty;
        public string SubscriptionPlan { get; set; } = "TRIAL"; // TRIAL, BASIC, PREMIUM
        public DateTimeOffset StartDate { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset ExpiryDate { get; set; } = DateTimeOffset.UtcNow.AddDays(15);
        public bool IsActive { get; set; } = true;
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
