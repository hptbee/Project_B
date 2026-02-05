using Microsoft.AspNetCore.Http;
using System;
using TheCoffeeCream.Application.Interfaces;

namespace TheCoffeeCream.Application.Services
{
    public class ShopContext : IShopContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ShopContext(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetShopId()
        {
            // 1. Try to get from User Claims (Authenticated users)
            var shopId = _httpContextAccessor.HttpContext?.User?.FindFirst("ShopId")?.Value 
                         ?? _httpContextAccessor.HttpContext?.User?.FindFirst("shopId")?.Value;

            if (!string.IsNullOrEmpty(shopId)) return shopId;

            // 2. Try to get from Headers (Anonymous/Public users)
            if (_httpContextAccessor.HttpContext?.Request.Headers.TryGetValue("x-shop-id", out var headerShopId) == true)
            {
                return headerShopId.ToString();
            }

            throw new UnauthorizedAccessException("ShopId not found in user context or headers.");
        }
    }
}
