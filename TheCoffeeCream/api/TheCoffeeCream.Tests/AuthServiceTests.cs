using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
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
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IShopRepository> _shopRepositoryMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly Mock<ITokenService> _tokenServiceMock;
        private readonly Mock<IPlanRepository> _planRepositoryMock;
        private readonly Mock<ISubscriptionHistoryRepository> _subscriptionHistoryRepositoryMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _shopRepositoryMock = new Mock<IShopRepository>();
            _emailServiceMock = new Mock<IEmailService>();
            _tokenServiceMock = new Mock<ITokenService>();
            _planRepositoryMock = new Mock<IPlanRepository>();
            _subscriptionHistoryRepositoryMock = new Mock<ISubscriptionHistoryRepository>();

            _authService = new AuthService(
                _userRepositoryMock.Object,
                _shopRepositoryMock.Object,
                _emailServiceMock.Object,
                _tokenServiceMock.Object,
                _planRepositoryMock.Object,
                _subscriptionHistoryRepositoryMock.Object
            );
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValidAndShopActive()
        {
            // Arrange
            var password = "password123";
            var hashedPassword = BC.HashPassword(password);
            var userId = Guid.NewGuid().ToString();
            var shopId = Guid.NewGuid().ToString();
            var user = new User { Id = userId, Username = "admin", PasswordHash = hashedPassword, ShopId = shopId, Role = "Admin" };
            var shop = new Shop { Id = shopId, IsActive = true, ExpiryDate = DateTimeOffset.UtcNow.AddDays(10) };

            _userRepositoryMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(user);
            _shopRepositoryMock.Setup(r => r.GetByIdAsync(shopId)).ReturnsAsync(shop);
            _tokenServiceMock.Setup(s => s.GenerateToken(user)).Returns("valid-token");

            // Act
            var result = await _authService.LoginAsync("admin", password);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().Be("valid-token");
            result.User.Should().Be(user);
            _userRepositoryMock.Verify(r => r.UpdateAsync(user), Times.Once); // Should update session token
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenUserNotFound()
        {
            // Arrange
            _userRepositoryMock.Setup(r => r.GetByUsernameAsync("unknown")).ReturnsAsync((User)null);

            // Act
            var result = await _authService.LoginAsync("unknown", "pass");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenPasswordIsInvalid()
        {
            // Arrange
            var password = "password123";
            var hashedPassword = BC.HashPassword(password);
            var user = new User { Username = "admin", PasswordHash = hashedPassword };

            _userRepositoryMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(user);

            // Act
            var result = await _authService.LoginAsync("admin", "wrongpass");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenShopIsExpired()
        {
             // Arrange
            var password = "password123";
            var hashedPassword = BC.HashPassword(password);
            var shopId = Guid.NewGuid().ToString();
            var user = new User { Username = "admin", PasswordHash = hashedPassword, ShopId = shopId, Role = "Admin" };
            var shop = new Shop { Id = shopId, IsActive = true, ExpiryDate = DateTimeOffset.UtcNow.AddDays(-1) }; // Expired

            _userRepositoryMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(user);
            _shopRepositoryMock.Setup(r => r.GetByIdAsync(shopId)).ReturnsAsync(shop);

            // Act
            var result = await _authService.LoginAsync("admin", password);

            // Assert
            result.Should().BeNull();
        }
        
        [Fact]
        public async Task RegisterShopAsync_ShouldCreateShopAndUser_WhenDataIsValid()
        {
             // Arrange
             var dto = new RegisterShopDto { 
                 ShopCode = "SHOP1", 
                 AdminUsername = "admin", 
                 AdminEmail = "admin@test.com", 
                 AdminPassword = "pass",
                 PlanType = SubscriptionPlanType.TRIAL_15_DAYS
             };
             
             var plan = new Plan { Code = "TRIAL_15_DAYS", DurationDays = 15, IsDefault = true, Price = 0, Name = "Trial" };
             _planRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Plan> { plan });
             
             _shopRepositoryMock.Setup(r => r.GetByCodeAsync(dto.ShopCode)).ReturnsAsync((Shop)null);
             _userRepositoryMock.Setup(r => r.GetByUsernameAsync(dto.AdminUsername)).ReturnsAsync((User)null);
             _userRepositoryMock.Setup(r => r.GetByEmailAsync(dto.AdminEmail)).ReturnsAsync((User)null);
             
             _tokenServiceMock.Setup(t => t.GenerateEmailVerificationToken(It.IsAny<User>())).Returns("verify-token");

             // Act
             var result = await _authService.RegisterShopAsync(dto);

             // Assert
             result.Should().NotBeNull();
             result.Code.Should().Be(dto.ShopCode);
             _shopRepositoryMock.Verify(r => r.CreateAsync(It.Is<Shop>(s => s.Code == dto.ShopCode)), Times.Once);
             _userRepositoryMock.Verify(r => r.CreateAsync(It.Is<User>(u => u.Username == dto.AdminUsername)), Times.Once);
             _subscriptionHistoryRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<SubscriptionHistory>()), Times.Once);
             _emailServiceMock.Verify(e => e.SendEmailAsync(dto.AdminEmail, It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task RegisterShopAsync_ShouldThrow_WhenEmailExists()
        {
             // Arrange
             var dto = new RegisterShopDto { ShopCode = "S1", AdminEmail = "EXISTING@test.com" };
             _planRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Plan> { new Plan() });
             _shopRepositoryMock.Setup(r => r.GetByCodeAsync(It.IsAny<string>())).ReturnsAsync((Shop)null);
             _userRepositoryMock.Setup(r => r.GetByEmailAsync("EXISTING@test.com")).ReturnsAsync(new User());

             // Act
             Func<Task> act = async () => await _authService.RegisterShopAsync(dto);

             // Assert
             await act.Should().ThrowAsync<Exception>().WithMessage("*Email*already taken*");
        }

        [Fact]
        public async Task RegisterShopAsync_ShouldThrow_WhenUsernameExists()
        {
             // Arrange
             var dto = new RegisterShopDto { ShopCode = "S1", AdminUsername = "EXISTING" };
             _planRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Plan> { new Plan() });
             _shopRepositoryMock.Setup(r => r.GetByCodeAsync(It.IsAny<string>())).ReturnsAsync((Shop)null);
             _userRepositoryMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User)null);
             _userRepositoryMock.Setup(r => r.GetByUsernameAsync("EXISTING")).ReturnsAsync(new User());

             // Act
             Func<Task> act = async () => await _authService.RegisterShopAsync(dto);

             // Assert
             await act.Should().ThrowAsync<Exception>().WithMessage("*Username*already taken*");
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenShopIsInactive()
        {
             // Arrange
            var password = "pass";
            var shopId = Guid.NewGuid().ToString();
            var user = new User { Username = "admin", PasswordHash = BC.HashPassword(password), ShopId = shopId, Role = "Admin" };
            var shop = new Shop { Id = shopId, IsActive = false, ExpiryDate = DateTimeOffset.UtcNow.AddDays(10) };

            _userRepositoryMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(user);
            _shopRepositoryMock.Setup(r => r.GetByIdAsync(shopId)).ReturnsAsync(shop);

            // Act
            var result = await _authService.LoginAsync("admin", password);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task VerifyEmailAsync_ShouldActivateUser_WhenTokenIsValid()
        {
            // Arrange
            var userId = Guid.NewGuid().ToString();
            var token = "valid-token";
            var claims = new List<Claim> 
            { 
                new Claim("type", "email_verification"),
                new Claim(ClaimTypes.NameIdentifier, userId)
            };
            var identity = new ClaimsIdentity(claims);
            var principal = new ClaimsPrincipal(identity);

            _tokenServiceMock.Setup(t => t.GetPrincipalFromToken(token)).Returns(principal);
            
            var user = new User { Id = userId, IsActive = false };
            _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

            // Act
            var result = await _authService.VerifyEmailAsync(token);

            // Assert
            result.Should().BeTrue();
            user.IsActive.Should().BeTrue();
            _userRepositoryMock.Verify(r => r.UpdateAsync(user), Times.Once);
        }

        [Fact]
        public async Task VerifyEmailAsync_ShouldReturnFalse_WhenTokenHasWrongType()
        {
            // Arrange
            var claims = new List<Claim> { new Claim("type", "wrong_type"), new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()) };
            var principal = new ClaimsPrincipal(new ClaimsIdentity(claims));
            _tokenServiceMock.Setup(t => t.GetPrincipalFromToken(It.IsAny<string>())).Returns(principal);

            // Act
            var result = await _authService.VerifyEmailAsync("token");

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task VerifyEmailAsync_ShouldReturnFalse_WhenUserNotFoundOrActive()
        {
            // Arrange
            var userId = Guid.NewGuid().ToString();
            var claims = new List<Claim> { new Claim("type", "email_verification"), new Claim(ClaimTypes.NameIdentifier, userId) };
            var principal = new ClaimsPrincipal(new ClaimsIdentity(claims));
            _tokenServiceMock.Setup(t => t.GetPrincipalFromToken(It.IsAny<string>())).Returns(principal);
            _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync((User)null);

            // Act
            var result = await _authService.VerifyEmailAsync("token");

            // Assert
            result.Should().BeFalse();
        }
        [Fact]
        public async Task LoginAsync_ShouldReturnNull_WhenShopNotFound()
        {
             // Arrange
            var password = "pass";
            var shopId = Guid.NewGuid().ToString();
            var user = new User { Username = "admin", PasswordHash = BC.HashPassword(password), ShopId = shopId, Role = "Admin" };

            _userRepositoryMock.Setup(r => r.GetByUsernameAsync("admin")).ReturnsAsync(user);
            _shopRepositoryMock.Setup(r => r.GetByIdAsync(shopId)).ReturnsAsync((Shop)null);

            // Act
            var result = await _authService.LoginAsync("admin", password);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task LogoutAsync_ShouldClearLastLoginToken_WhenUserExists()
        {
            // Arrange
            var userId = Guid.NewGuid().ToString();
            var user = new User { Id = userId, LastLoginToken = "active-token" };
            _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

            // Act
            await _authService.LogoutAsync(userId);

            // Assert
            user.LastLoginToken.Should().BeEmpty();
            _userRepositoryMock.Verify(r => r.UpdateAsync(It.Is<User>(u => u.LastLoginToken == string.Empty)), Times.Once);
        }

        [Fact]
        public async Task RegisterShopAsync_ShouldFallbackToDefaultPlan()
        {
             // Arrange
             var dto = new RegisterShopDto { ShopCode = "S1", AdminEmail = "test@test.com", PlanType = SubscriptionPlanType.TRIAL_15_DAYS };
             // No plan with matching code, but one IsDefault=true
             var defaultPlan = new Plan { Name = "Default", Code = "OTHER", IsDefault = true, DurationDays = 30 };
             _planRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Plan> { defaultPlan });
             _shopRepositoryMock.Setup(r => r.GetByCodeAsync(It.IsAny<string>())).ReturnsAsync((Shop)null);
             _userRepositoryMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User)null);
             _userRepositoryMock.Setup(r => r.GetByUsernameAsync(It.IsAny<string>())).ReturnsAsync((User)null);
             _tokenServiceMock.Setup(t => t.GenerateEmailVerificationToken(It.IsAny<User>())).Returns("token");

             // Act
             var result = await _authService.RegisterShopAsync(dto);

             // Assert
             result.Should().NotBeNull();
             _subscriptionHistoryRepositoryMock.Verify(r => r.CreateAsync(It.Is<SubscriptionHistory>(h => h.PlanName == defaultPlan.Name)), Times.Once);
        }
    }
}
