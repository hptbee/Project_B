using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;
using FluentAssertions;
using TheCoffeeCream.Application.Services;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Application.DTOs;

namespace TheCoffeeCream.Tests
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IShopContext> _shopContextMock;
        private readonly ProductService _productService;
        private readonly string _shopId = "test-shop-id";

        public ProductServiceTests()
        {
            _productRepositoryMock = new Mock<IProductRepository>();
            _shopContextMock = new Mock<IShopContext>();

            _productService = new ProductService(
                _productRepositoryMock.Object,
                _shopContextMock.Object
            );
        }

        private void SetupShopContext(string? shopId = "test-shop-id", bool shouldThrow = false)
        {
            if (shouldThrow)
            {
                _shopContextMock.Setup(x => x.GetShopId()).Throws(new UnauthorizedAccessException());
            }
            else
            {
                _shopContextMock.Setup(x => x.GetShopId()).Returns(shopId!);
            }
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnProducts_WhenShopIdExists()
        {
            // Arrange
            SetupShopContext(_shopId);
            var products = new List<Product> { new Product { Id = Guid.NewGuid(), Name = "Coffee", ShopId = _shopId } };
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(products);

            // Act
            var result = await _productService.GetAllAsync();

            // Assert
            result.Should().HaveCount(1);
            result.First().Name.Should().Be("Coffee");
        }

        [Fact]
        public async Task GetAllAsync_ShouldThrow_WhenNoShopIdContext()
        {
            // Arrange
            SetupShopContext(shouldThrow: true);

            // Act
            Func<Task> act = async () => await _productService.GetAllAsync();

            // Assert
            await act.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Fact]
        public async Task CreateAsync_ShouldResolveCategory_WhenNameProvided()
        {
            // Arrange
            SetupShopContext(_shopId);
            var categoryId = Guid.NewGuid();
            var categories = new List<Category> { new Category { Id = categoryId, Name = "Drinks" } };
            _productRepositoryMock.Setup(r => r.GetCategoriesAsync(_shopId)).ReturnsAsync(categories);
            
            var request = new ProductUpsertRequest { Name = "Latte", Category = "Drinks", Price = 5 };

            // Act
            await _productService.CreateAsync(request);

            // Assert
            _productRepositoryMock.Verify(r => r.CreateAsync(It.Is<Product>(p => p.CategoryId == categoryId)), Times.Once);
        }

        [Fact]
        public async Task GetMenuAsync_ShouldReturnMenuWithCategoriesAndToppings()
        {
            // Arrange
            SetupShopContext(_shopId);
            var catId = Guid.NewGuid();
            var categories = new List<Category> { new Category { Id = catId, Name = "Drinks", Rank = 1 } };
            
            var toppingId = Guid.NewGuid();
            var toppingProduct = new Product { Id = toppingId, Name = "Sugar", IsTopping = true, Price = 0 };
            var mainProduct = new Product(
                Guid.NewGuid(), 
                "Tea", 
                10, 
                false, 
                catId, 
                null, 
                "TEA01", 
                5, 
                null, 
                true, 
                new List<Product> { toppingProduct }, 
                toppingId.ToString()
            );
            
            var products = new List<Product> { mainProduct, toppingProduct };

            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(products);
            _productRepositoryMock.Setup(r => r.GetCategoriesAsync(_shopId)).ReturnsAsync(categories);

            // Act
            var result = await _productService.GetMenuAsync();

            // Assert
            result.Categories.Should().HaveCount(1);
            result.Products.Should().HaveCount(2); // Main + Topping (since topping is also a product)
            
            var menuProduct = result.Products.First(p => p.Name == "Tea");
            menuProduct.Toppings.Should().HaveCount(1);
            menuProduct.Toppings.First().Name.Should().Be("Sugar");
        }

        [Fact]
        public async Task CreateAsync_ShouldReturnGuidEmpty_WhenCategoryNotFound()
        {
            // Arrange
            SetupShopContext(_shopId);
            _productRepositoryMock.Setup(r => r.GetCategoriesAsync(_shopId)).ReturnsAsync(new List<Category>());
            
            var request = new ProductUpsertRequest { Name = "Latte", Category = "NonExistent", Price = 5 };

            // Act
            await _productService.CreateAsync(request);

            // Assert
            _productRepositoryMock.Verify(r => r.CreateAsync(It.Is<Product>(p => p.CategoryId == Guid.Empty)), Times.Once);
        }

        [Fact]
        public async Task GetMenuAsync_ShouldHandleInvalidToppingMapping()
        {
            // Arrange
            SetupShopContext(_shopId);
            var product = new Product(Guid.NewGuid(), "Coffee", 10, false, Guid.Empty, null, "C01", 5, null, true, null, "invalid-guid; " + Guid.NewGuid());
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product> { product });
            _productRepositoryMock.Setup(r => r.GetCategoriesAsync(_shopId)).ReturnsAsync(new List<Category>());

            // Act
            var result = await _productService.GetMenuAsync();

            // Assert
            result.Products.First().Toppings.Should().BeEmpty();
        }

        [Fact]
        public async Task GetMenuAsync_ShouldHandleMissingToppingMapping()
        {
            // Arrange
            SetupShopContext(_shopId);
            var product = new Product(Guid.NewGuid(), "Coffee", 10, false, Guid.Empty, null, "C01", 5, null, true, null, ""); // Empty string
            _productRepositoryMock.Setup(r => r.GetAllAsync(_shopId)).ReturnsAsync(new List<Product> { product });
            _productRepositoryMock.Setup(r => r.GetCategoriesAsync(_shopId)).ReturnsAsync(new List<Category>());

            // Act
            var result = await _productService.GetMenuAsync();

            // Assert
            result.Products.First().Toppings.Should().BeEmpty();
        }

        [Fact]
        public async Task ToggleActiveAsync_ShouldReturnFalse_WhenNotFound()
        {
            // Arrange
            SetupShopContext(_shopId);
            _productRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), _shopId)).ReturnsAsync((Product)null);

            // Act
            var result = await _productService.ToggleActiveAsync(Guid.NewGuid());

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task CreateAsync_ShouldResolveCategoryByName()
        {
            // Arrange
            SetupShopContext(_shopId);
            var categoryId = Guid.NewGuid();
            var category = new Category { Id = categoryId, Name = "Drinks" };
            _productRepositoryMock.Setup(r => r.GetCategoriesAsync(_shopId)).ReturnsAsync(new List<Category> { category });

            var dto = new ProductUpsertRequest { Name = "New", Price = 10, Category = "Drinks" };

            // Act
            await _productService.CreateAsync(dto);

            // Assert
            _productRepositoryMock.Verify(r => r.CreateAsync(It.Is<Product>(p => p.CategoryId == categoryId)), Times.Once);
        }
    }
}
