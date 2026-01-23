using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeCream.Domain.Entities;
using TheCoffeCream.Application.Interfaces;
using TheCoffeCream.Application.DTOs;

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

        public async Task<MenuDto> GetMenuAsync()
        {
            var products = (await _productRepository.GetAllAsync()).ToList();
            var categories = (await _productRepository.GetCategoriesAsync()).ToList();

            var dto = new MenuDto
            {
                Categories = categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name }).ToList(),
                Products = products.Select(p => new ProductMenuDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Category = p.Category,
                    Code = p.Code,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    IsActive = p.IsActive,
                    IsTopping = p.IsTopping,
                    Toppings = p.Toppings.Select(t => new ProductDto
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Category = t.Category,
                        Code = t.Code,
                        Price = t.Price,
                        ImageUrl = t.ImageUrl,
                        IsActive = t.IsActive,
                        IsTopping = t.IsTopping
                    }).ToList()
                }).ToList()
            };

            return dto;
        }
    }
}
