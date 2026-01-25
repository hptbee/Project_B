using System;
using System.Collections.Generic;

namespace TheCoffeeCream.Application.DTOs
{
    public class ProductUpsertRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsTopping { get; set; } = false;
        public List<Guid> ToppingIds { get; set; } = new();
    }

    public class CategoryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Rank { get; set; }
    }
}
