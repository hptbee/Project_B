using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.Extensions.Caching.Memory;
using TheCoffeeCream.Application.Interfaces;

namespace TheCoffeeCream.Api.Middleware
{
    public class SessionMiddleware
    {
        private readonly RequestDelegate _next;

        public SessionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IUserRepository userRepository, IMemoryCache cache)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var sessionIdClaim = context.User.FindFirst("session_id")?.Value;
                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? context.User.FindFirst("sub")?.Value;

                if (!string.IsNullOrEmpty(sessionIdClaim) && !string.IsNullOrEmpty(userId))
                {
                    string cacheKey = $"session_{userId}";
                    if (!cache.TryGetValue(cacheKey, out string? lastLoginToken))
                    {
                        var user = await userRepository.GetByIdAsync(userId);
                        lastLoginToken = user?.LastLoginToken;
                        
                        if (lastLoginToken != null)
                        {
                            cache.Set(cacheKey, lastLoginToken, TimeSpan.FromSeconds(30));
                        }
                    }

                    if (lastLoginToken != null && lastLoginToken != sessionIdClaim)
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsJsonAsync(new { message = "Session expired or active on another device.", code = "SessionConflict" });
                        return;
                    }
                }
            }

            await _next(context);
        }
    }
}
