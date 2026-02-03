using System;

namespace TheCoffeeCream.Application.DTOs
{
    public class ShopDto
    {
        public string Id { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
        public string SubscriptionPlan { get; set; } = string.Empty;
        public DateTimeOffset ExpiryDate { get; set; }
        public bool IsActive { get; set; }
    }
}
