using Microsoft.EntityFrameworkCore;
using AspNetCoreRateLimit;
using TheCoffeeCream.Infrastructure;
using TheCoffeeCream.Application;
var builder = WebApplication.CreateBuilder(args);



// Configure PORT for Render (Render sets PORT env var)
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port) && int.TryParse(port, out var p))
{
    builder.WebHost.UseUrls($"http://*:{p}");
}

// Add services to the container.
// Add services to the container.
builder.Services.AddOptions();
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
builder.Services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();
builder.Services.AddInMemoryRateLimiting();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Configure options
builder.Services.Configure<TheCoffeeCream.Shared.Middleware.ApiKeyOptions>(builder.Configuration.GetSection("ApiKeyOptions"));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JWT");
var keyString = jwtSettings["Key"] ?? "TheCoffeeCream_Super_Secret_Key_2026_!@#";
var key = System.Text.Encoding.UTF8.GetBytes(keyString);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "TheCoffeeCream",
        ValidAudience = jwtSettings["Audience"] ?? "TheCoffeeCreamStaff",
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();

// Add Layers
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

var app = builder.Build();

// Automatically apply migrations on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        Console.WriteLine("[DB-INIT] Applying migrations...");
        var context = services.GetRequiredService<TheCoffeeCream.Infrastructure.Data.ApplicationDbContext>();
        if (context.Database.IsSqlServer())
        {
            context.Database.Migrate();
            Console.WriteLine("[DB-INIT] Migrations applied successfully.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB-INIT] ERROR: {ex.Message}");
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

// 0. Global Exception Handling
app.UseMiddleware<TheCoffeeCream.Shared.Middleware.ExceptionMiddleware>();

// 1. Rate Limiting MUST be very early in the pipeline
app.UseIpRateLimiting();

// 2. CORS MUST also be near the top
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

// 2. Health check before any middleware (allows monitoring without API key)
app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));

// 3. API key middleware
app.UseMiddleware<TheCoffeeCream.Shared.Middleware.ApiKeyMiddleware>();

app.MapControllers();

app.Run();
