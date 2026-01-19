using System;
using System.Collections.Generic;

namespace TheCoffeCream.Application.DTOs
{
    public class MenuDto
    {
        public List<CategoryDto> Categories { get; set; } = new();
        public List<ProductMenuDto> Products { get; set; } = new();
        public List<ToppingDto> Toppings { get; set; } = new();
    }

    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class ProductMenuDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public Guid? CategoryId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public List<Guid> AllowedToppingIds { get; set; } = new();
    }
}
