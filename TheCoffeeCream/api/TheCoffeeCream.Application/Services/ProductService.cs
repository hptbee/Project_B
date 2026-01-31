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

            return new MenuDto
            {
                Categories = categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name, Rank = c.Rank }).ToList(),
                Products = products.Select(p => new ProductMenuDto
                {
                    Id = p.Id,
                    CategoryId = p.CategoryId,
                    Name = p.Name,
                    Category = p.Category?.Name ?? string.Empty,
                    Code = p.Code,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    IsActive = p.IsActive,
                    IsTopping = p.IsTopping,
                    Toppings = MapToDto(p).Toppings
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
            var categoryId = await ResolveCategoryId(request.CategoryId, request.Category);
            
            var toppingMapping = request.ToppingIds != null && request.ToppingIds.Any()
                ? string.Join(";", request.ToppingIds)
                : string.Empty;

            var product = new Product(
                Guid.NewGuid(),
                request.Name,
                request.Price,
                request.IsTopping,
                categoryId,
                null, // Category object will be resolved by repo or later
                request.Code,
                request.Cost,
                request.ImageUrl,
                request.IsActive,
                null,
                toppingMapping
            );

            await _productRepository.CreateAsync(product);
            
            // Re-fetch to get resolved toppings and category
            var createdProduct = await _productRepository.GetByIdAsync(product.Id);
            return MapToDto(createdProduct ?? product);
        }

        public async Task<ProductDto?> UpdateAsync(Guid id, ProductUpsertRequest request)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;

            var categoryId = await ResolveCategoryId(request.CategoryId, request.Category);

            var toppingMapping = request.ToppingIds != null && request.ToppingIds.Any()
                ? string.Join(";", request.ToppingIds)
                : string.Empty;

            product.Name = request.Name;
            product.CategoryId = categoryId;
            product.Code = request.Code;
            product.Cost = request.Cost;
            product.Price = request.Price;
            product.ImageUrl = request.ImageUrl;
            product.IsActive = request.IsActive;
            product.IsTopping = request.IsTopping;
            product.ToppingMapping = toppingMapping;

            await _productRepository.UpdateAsync(product);

            // Re-fetch to get resolved toppings and category
            var updatedProduct = await _productRepository.GetByIdAsync(id);
            return MapToDto(updatedProduct ?? product);
        }

        private async Task<Guid> ResolveCategoryId(Guid categoryId, string categoryName)
        {
            if (categoryId != Guid.Empty) return categoryId;
            if (string.IsNullOrWhiteSpace(categoryName)) return Guid.Empty;

            var categories = await _productRepository.GetCategoriesAsync();
            var matched = categories.FirstOrDefault(c => c.Name.Equals(categoryName, System.StringComparison.OrdinalIgnoreCase));
            return matched?.Id ?? Guid.Empty;
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
                CategoryId = p.CategoryId,
                Category = p.Category?.Name ?? string.Empty,
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
                    CategoryId = t.CategoryId,
                    Category = t.Category?.Name ?? string.Empty,
                    Price = t.Price,
                    IsActive = t.IsActive,
                    IsTopping = true
                }).ToList()
            };
        }
    }
}
