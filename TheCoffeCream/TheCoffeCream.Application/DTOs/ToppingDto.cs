using System;

namespace TheCoffeCream.Application.DTOs
{
    public class ToppingDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
