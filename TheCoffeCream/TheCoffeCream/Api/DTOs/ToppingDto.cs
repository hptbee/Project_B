using System;

namespace TheCoffeCream.Api.DTOs
{
    public class ToppingDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
