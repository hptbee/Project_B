using System;

namespace TheCoffeeCream.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;

        public int Rank { get; private set; }

        private Category() { }

        public Category(Guid id, string name, int rank = 0)
        {
            if (id == Guid.Empty) throw new ArgumentException("id required", nameof(id));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));

            Id = id;
            Name = name;
            Rank = rank;
        }
    }
}
