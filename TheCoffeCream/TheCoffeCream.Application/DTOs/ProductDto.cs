using System;
using System.Collections.Generic;

namespace TheCoffeCream.Application.DTOs
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsTopping { get; set; }
        public List<ProductDto> Toppings { get; set; } = new();
    }
}
