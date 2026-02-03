using System.ComponentModel.DataAnnotations;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.DTOs
{
    public class RegisterShopDto
    {
        // Shop Details
        [Required]
        public string ShopName { get; set; } = string.Empty;
        
        [Required]
        public string ShopCode { get; set; } = string.Empty; // Unique identifier

        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string ShopEmail { get; set; } = string.Empty;
        public string TaxCode { get; set; } = string.Empty;

        // Admin User Details
        [Required]
        public string AdminUsername { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string AdminEmail { get; set; } = string.Empty;
        
        [Required]
        public string AdminPassword { get; set; } = string.Empty;

        // Subscription
        [Required]
        public SubscriptionPlanType PlanType { get; set; }
    }
}
