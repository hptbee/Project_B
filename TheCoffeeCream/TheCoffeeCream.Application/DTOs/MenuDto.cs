using System;
using System.Collections.Generic;

namespace TheCoffeeCream.Application.DTOs
{
    public class MenuDto
    {
        public List<CategoryDto> Categories { get; set; } = new();
        public List<ProductMenuDto> Products { get; set; } = new();
    }

    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Rank { get; set; }
    }

    public class ProductMenuDto
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsTopping { get; set; }

        public List<ProductDto> Toppings { get; set; } = new();
    }
}
