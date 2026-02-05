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
using BC = BCrypt.Net.BCrypt;

namespace TheCoffeeCream.Tests
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IShopContext> _shopContextMock;
        private readonly UserService _userService;
        private readonly string _shopId = "test-shop-id";

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _shopContextMock = new Mock<IShopContext>();

            _userService = new UserService(
                _userRepositoryMock.Object,
                _shopContextMock.Object
            );

            SetupShopContext();
        }

        private void SetupShopContext(string? shopId = "test-shop-id")
        {
            _shopContextMock.Setup(x => x.GetShopId()).Returns(shopId!);
        }

        [Fact]
        public async Task CreateUserAsync_ShouldUseResolvedShopId()
        {
            // Arrange
            SetupShopContext(_shopId);
            var request = new UserUpsertRequest { Username = "test", Email = "test@test.com", Role = "Staff", IsActive = false };

            // Act
            var result = await _userService.CreateUserAsync(request);

            // Assert
            _userRepositoryMock.Verify(r => r.CreateAsync(It.Is<User>(u => u.ShopId == _shopId)), Times.Once);
        }

        [Fact]
        public async Task CreateUserAsync_ShouldHandleMissingPassword()
        {
            // Arrange
            SetupShopContext(_shopId);
            var request = new UserUpsertRequest { Username = "nopass", IsActive = false };

            // Act
            await _userService.CreateUserAsync(request);

            // Assert
            _userRepositoryMock.Verify(r => r.CreateAsync(It.Is<User>(u => u.PasswordHash == string.Empty)), Times.Once);
        }

        [Fact]
        public async Task CreateUserAsync_ShouldCreateUser_WhenLimitNotReached()
        {
            // Arrange
            SetupShopContext(_shopId);
            var request = new UserUpsertRequest { Username = "newstaff", Role = "Staff", IsActive = true, Password = "pass" };
            var existingUsers = new List<User>(); // No users
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(existingUsers);

            // Act
            var result = await _userService.CreateUserAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.Username.Should().Be(request.Username);
            _userRepositoryMock.Verify(r => r.CreateAsync(It.Is<User>(u => u.Username == request.Username && u.ShopId == _shopId)), Times.Once);
        }

        [Fact]
        public async Task CreateUserAsync_ShouldThrow_WhenStaffLimitReached()
        {
            // Arrange
            SetupShopContext(_shopId);
            var request = new UserUpsertRequest { Username = "newstaff", Role = "Staff", IsActive = true, Password = "pass" };
            var existingUsers = Enumerable.Range(0, 5).Select(i => new User { ShopId = _shopId, Role = "Staff", IsActive = true }).ToList();
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(existingUsers);

            // Act
            Func<Task> act = async () => await _userService.CreateUserAsync(request);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*limit of 5 active staff*");
        }

        [Fact]
        public async Task CreateUserAsync_ShouldAllowInactive_WhenLimitReached()
        {
            // Arrange
            SetupShopContext(_shopId);
            var request = new UserUpsertRequest { Username = "newstaff", Role = "Staff", IsActive = false, Password = "pass" };
            var existingUsers = Enumerable.Range(0, 5).Select(i => new User { ShopId = _shopId, Role = "Staff", IsActive = true }).ToList();
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(existingUsers);

            // Act
            var result = await _userService.CreateUserAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.IsActive.Should().BeFalse();
             _userRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<User>()), Times.Once);
        }

        [Fact]
        public async Task UpdateUserAsync_ShouldUpdateUser_WhenValid()
        {
            // Arrange
            SetupShopContext(_shopId);
            var userId = Guid.NewGuid().ToString();
            var existingUser = new User { Id = userId, ShopId = _shopId, Role = "Staff", IsActive = true };
            var request = new UserUpsertRequest { Username = "updated", Email = "up@test.com", Role = "Staff", IsActive = true };
            
            _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(existingUser);

            // Act
            var result = await _userService.UpdateUserAsync(userId, request);

            // Assert
            result.Username.Should().Be("updated");
            _userRepositoryMock.Verify(r => r.UpdateAsync(It.Is<User>(u => u.Id == userId)), Times.Once);
        }

        [Fact]
        public async Task ToggleUserActiveAsync_ShouldToggle_WhenValid()
        {
            // Arrange
            SetupShopContext(_shopId);
            var userId = Guid.NewGuid().ToString();
            var user = new User { Id = userId, ShopId = _shopId, IsActive = true };
            _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

            // Act
            var result = await _userService.ToggleUserActiveAsync(userId);

            // Assert
            result.Should().BeTrue();
            _userRepositoryMock.Verify(r => r.ToggleActiveAsync(userId), Times.Once);
        }

        [Fact]
        public async Task UpdateUserAsync_ShouldThrow_WhenActivatingAndLimitReached()
        {
            // Arrange
            SetupShopContext(_shopId);
            var userId = Guid.NewGuid().ToString();
            var existingUser = new User { Id = userId, ShopId = _shopId, Role = "Staff", IsActive = false };
            var request = new UserUpsertRequest { Username = "staff", Role = "Staff", IsActive = true };
            
            _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(existingUser);
            
            var allUsers = Enumerable.Range(0, 5).Select(i => new User { ShopId = _shopId, Role = "Staff", IsActive = true }).ToList();
            // currently existingUser is not active, so not in 'allUsers' count effectively if we fetched all
            // But GetAll usually returns all.
            // Let's mock GetAll to return the 5 active ones + our inactive one
            allUsers.Add(existingUser);
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(allUsers);

            // Act
            Func<Task> act = async () => await _userService.UpdateUserAsync(userId, request);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>();
        }

        [Fact]
        public async Task ToggleUserActiveAsync_ShouldThrow_WhenActivatingAndLimitReached()
        {
            // Arrange
            SetupShopContext(_shopId);
            var userId = Guid.NewGuid().ToString();
            var user = new User { Id = userId, ShopId = _shopId, Role = "Staff", IsActive = false };
            _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

            var allUsers = Enumerable.Range(0, 5).Select(i => new User { ShopId = _shopId, Role = "Staff", IsActive = true }).ToList();
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(allUsers);

            // Act
            Func<Task> act = async () => await _userService.ToggleUserActiveAsync(userId);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>();
        }

        [Fact]
        public async Task ToggleUserActiveAsync_ShouldReturnFalse_WhenUserNotFound()
        {
            // Arrange
            _userRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<string>())).ReturnsAsync((User)null);

            // Act
            var result = await _userService.ToggleUserActiveAsync("invalid");

            // Assert
            result.Should().BeFalse();
        }
    }
}
