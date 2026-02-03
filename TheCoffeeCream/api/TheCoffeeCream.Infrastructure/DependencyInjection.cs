using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Infrastructure.Data;
using TheCoffeeCream.Infrastructure.Repositories;
using TheCoffeeCream.Infrastructure.Services;

namespace TheCoffeeCream.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Register Dapper Type Handlers
            Dapper.SqlMapper.AddTypeHandler(new Data.TypeHandlers.DapperEnumTypeHandler<Domain.Entities.OrderType>());
            Dapper.SqlMapper.AddTypeHandler(new Data.TypeHandlers.DapperEnumTypeHandler<Domain.Entities.DiscountType>());
            Dapper.SqlMapper.AddTypeHandler(new Data.TypeHandlers.DateTimeOffsetTypeHandler());
            Dapper.SqlMapper.AddTypeHandler(new Data.TypeHandlers.GuidTypeHandler());

            // Database - Entity Framework Core
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    b => 
                    {
                        b.MigrationsAssembly("TheCoffeeCream.Migrations");
                        b.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(30),
                            errorNumbersToAdd: null
                        );
                    }));

            // Repositories
            services.AddScoped<IUserRepository, EfUserRepository>();
            services.AddScoped<IOrderRepository, EfOrderRepository>();
            services.AddScoped<IProductRepository, EfProductRepository>();
            services.AddScoped<IShopRepository, EfShopRepository>();
            services.AddScoped<IPlanRepository, EfPlanRepository>();
            services.AddScoped<ISubscriptionHistoryRepository, EfSubscriptionHistoryRepository>();

            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ITokenService, JwtTokenService>();

            return services;
        }
    }
}
