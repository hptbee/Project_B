using System;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;
using FluentAssertions;
using TheCoffeeCream.Application.Services;

namespace TheCoffeeCream.Tests
{
    public class ShopContextTests
    {
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly ShopContext _shopContext;
        private readonly string _shopId = "test-shop-id";

        public ShopContextTests()
        {
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _shopContext = new ShopContext(_httpContextAccessorMock.Object);
        }

        [Fact]
        public void GetShopId_ShouldReturnFromShopIdClaim_WhenProvided()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("ShopId", _shopId) }));
            var context = new DefaultHttpContext { User = user };
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);

            // Act
            var result = _shopContext.GetShopId();

            // Assert
            result.Should().Be(_shopId);
        }

        [Fact]
        public void GetShopId_ShouldReturnFromShopIdLowercaseClaim_WhenProvided()
        {
            // Arrange
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("shopId", _shopId) }));
            var context = new DefaultHttpContext { User = user };
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);

            // Act
            var result = _shopContext.GetShopId();

            // Assert
            result.Should().Be(_shopId);
        }

        [Fact]
        public void GetShopId_ShouldReturnFromHeader_WhenClaimsMissing()
        {
            // Arrange
            var context = new DefaultHttpContext();
            context.Request.Headers["x-shop-id"] = _shopId;
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);

            // Act
            var result = _shopContext.GetShopId();

            // Assert
            result.Should().Be(_shopId);
        }

        [Fact]
        public void GetShopId_ShouldThrow_WhenNoContextInfo()
        {
            // Arrange
            var context = new DefaultHttpContext();
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);

            // Act
            Action act = () => _shopContext.GetShopId();

            // Assert
            act.Should().Throw<UnauthorizedAccessException>();
        }
    }
}
