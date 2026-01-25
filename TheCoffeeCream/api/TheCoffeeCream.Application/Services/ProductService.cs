using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Application.DTOs;

namespace TheCoffeeCream.Application.Services
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
            var categories = await _productRepository.GetCategoriesAsync();
            var productsById = products.ToDictionary(p => p.Id);

            return new MenuDto
            {
                Categories = categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name, Rank = c.Rank }).ToList(),
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
                    Toppings = ResolveToppings(p, productsById).Select(MapToDto).ToList()
                }).ToList()
            };
        }

        private static IEnumerable<Product> ResolveToppings(Product product, Dictionary<Guid, Product> productsById)
        {
            if (product.Toppings?.Any() == true) return product.Toppings;
            if (string.IsNullOrWhiteSpace(product.ToppingMapping)) return Enumerable.Empty<Product>();

            return product.ToppingMapping.Split(';')
                .Select(s => Guid.TryParse(s.Trim(), out var gid) && productsById.TryGetValue(gid, out var topping) ? topping : null)
                .Where(t => t != null)!;
        }

        public async Task<IEnumerable<CategoryResponse>> GetCategoriesAsync()
        {
            var categories = await _productRepository.GetCategoriesAsync();
            return categories.Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name,
                Rank = c.Rank
            });
        }

        public async Task<ProductDto?> GetByIdAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;
            return MapToDto(product);
        }

        public async Task<ProductDto> CreateAsync(ProductUpsertRequest request)
        {
            var toppingMapping = request.ToppingIds != null && request.ToppingIds.Any()
                ? string.Join(";", request.ToppingIds)
                : string.Empty;

            var product = new Product(
                Guid.NewGuid(),
                request.Name,
                request.Price,
                request.IsTopping,
                request.Category,
                request.Code,
                request.Cost,
                request.ImageUrl,
                request.IsActive,
                null,
                toppingMapping
            );

            await _productRepository.CreateAsync(product);
            return MapToDto(product);
        }

        public async Task<ProductDto?> UpdateAsync(Guid id, ProductUpsertRequest request)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;

            var toppingMapping = request.ToppingIds != null && request.ToppingIds.Any()
                ? string.Join(";", request.ToppingIds)
                : string.Empty;

            product.Name = request.Name;
            product.Category = request.Category;
            product.Code = request.Code;
            product.Cost = request.Cost;
            product.Price = request.Price;
            product.ImageUrl = request.ImageUrl;
            product.IsActive = request.IsActive;
            product.IsTopping = request.IsTopping;
            product.ToppingMapping = toppingMapping;

            await _productRepository.UpdateAsync(product);
            return MapToDto(product);
        }

        public async Task<bool> ToggleActiveAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return false;

            await _productRepository.ToggleActiveAsync(id);
            return true;
        }

        private ProductDto MapToDto(Product p)
        {
            return new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Category = p.Category,
                Code = p.Code,
                Cost = p.Cost,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                IsTopping = p.IsTopping,
                Toppings = p.Toppings.Select(t => new ProductDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Category = t.Category,
                    Price = t.Price,
                    IsActive = t.IsActive,
                    IsTopping = true
                }).ToList()
            };
        }
    }
}
