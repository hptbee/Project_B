using System;

namespace TheCoffeCream.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;

        private Category() { }

        public Category(Guid id, string name)
        {
            if (id == Guid.Empty) throw new ArgumentException("id required", nameof(id));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("name required", nameof(name));

            Id = id;
            Name = name;
        }
    }
}
