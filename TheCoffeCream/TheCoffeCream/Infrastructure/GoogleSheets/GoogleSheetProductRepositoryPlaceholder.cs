using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TheCoffeCream.Domain.Entities;
using TheCoffeCream.Application.Interfaces;

namespace TheCoffeCream.Infrastructure.GoogleSheets
{
    // Simple in-memory placeholder until a real product repository is implemented.
    public class GoogleSheetProductRepositoryPlaceholder : IProductRepository
    {
        private static readonly Guid CategoryBeverages = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        private static readonly Guid CategoryFood = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

        private static readonly Guid ToppingMilk = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd");
        private static readonly Guid ToppingChocolate = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee");

        private static readonly List<Topping> _toppings = new()
        {
            new Topping(ToppingMilk, "Extra Milk", 0.50m),
            new Topping(ToppingChocolate, "Chocolate Shot", 0.75m)
        };

        private static readonly List<Category> _categories = new()
        {
            new Category(CategoryBeverages, "Beverages"),
            new Category(CategoryFood, "Food")
        };

        private static readonly List<Product> _products = new()
        {
            new Product(Guid.Parse("11111111-1111-1111-1111-111111111111"), "Americano", 2.50m, "Classic americano", CategoryBeverages, "", null),
            new Product(Guid.Parse("22222222-2222-2222-2222-222222222222"), "Latte", 3.50m, "Milk and espresso", CategoryBeverages, "", new[] { ToppingMilk, ToppingChocolate }),
            new Product(Guid.Parse("33333333-3333-3333-3333-333333333333"), "Croissant", 1.75m, "Buttery pastry", CategoryFood, "", null)
        };

        public Task<IEnumerable<Product>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Product>>(_products);
        }

        public Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            return Task.FromResult<IEnumerable<Category>>(_categories);
        }

        public Task<IEnumerable<Topping>> GetToppingsAsync()
        {
            return Task.FromResult<IEnumerable<Topping>>(_toppings);
        }
    }
}
