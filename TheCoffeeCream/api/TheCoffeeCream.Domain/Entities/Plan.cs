using System;

namespace TheCoffeeCream.Domain.Entities
{
    public class Plan
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Code { get; set; } = string.Empty; // e.g., BASIC_30
        public string Name { get; set; } = string.Empty; // e.g., Basic Plan (30 Days)
        public int DurationDays { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsDefault { get; set; } = false;
    }
}
