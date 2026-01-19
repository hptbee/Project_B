using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeCream.Domain.Entities;
using TheCoffeCream.Infrastructure.Interfaces;

namespace TheCoffeCream.Application.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return (await _productRepository.GetAllAsync()).ToList();
        }

        public async Task<Api.DTOs.MenuDto> GetMenuAsync()
        {
            var products = (await _productRepository.GetAllAsync()).ToList();
            var categories = (await _productRepository.GetCategoriesAsync()).ToList();
            var toppings = (await _productRepository.GetToppingsAsync()).ToList();

            var dto = new Api.DTOs.MenuDto
            {
                Categories = categories.Select(c => new Api.DTOs.CategoryDto { Id = c.Id, Name = c.Name }).ToList(),
                Products = products.Select(p => new Api.DTOs.ProductMenuDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    CategoryId = p.CategoryId,
                    ImageUrl = p.ImageUrl,
                    AllowedToppingIds = p.AllowedToppingIds.ToList()
                }).ToList(),
                Toppings = toppings.Select(t => new Api.DTOs.ToppingDto { Id = t.Id, Name = t.Name, Price = t.Price }).ToList()
            };

            return dto;
        }
    }
}
