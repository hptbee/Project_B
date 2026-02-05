using Microsoft.Extensions.DependencyInjection;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Application.Services;

namespace TheCoffeeCream.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<OrderService>();
            services.AddScoped<ProductService>();
            services.AddScoped<UserService>();
            services.AddScoped<IShopContext, ShopContext>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IReportService, ReportService>();

            return services;
        }
    }
}
