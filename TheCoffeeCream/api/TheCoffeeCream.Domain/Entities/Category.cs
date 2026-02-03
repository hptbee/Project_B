using System;

namespace TheCoffeeCream.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; }
        public string ShopId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public int Rank { get; set; }
        public bool IsActive { get; set; } = true;
        
        public ICollection<Product> Products { get; set; } = new List<Product>();

        public Category() { }

        public Category(Guid id, string shopId, string name, int rank = 0)
        {
            if (id == Guid.Empty) throw new ArgumentException("id required", nameof(id));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));

            Id = id;
            ShopId = shopId;
            Name = name;
            Rank = rank;
        }
    }
}
