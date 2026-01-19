var builder = WebApplication.CreateBuilder(args);

// Configure PORT for Render (Render sets PORT env var)
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port) && int.TryParse(port, out var p))
{
    builder.WebHost.UseUrls($"http://*:{p}");
}

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure options
builder.Services.Configure<TheCoffeCream.Shared.Middleware.ApiKeyOptions>(builder.Configuration.GetSection("ApiKeyOptions"));

// DI - repositories and services
// For now use skeleton GoogleSheetOrderRepository; replace sheet id via configuration
builder.Services.AddSingleton<TheCoffeCream.Application.Interfaces.IOrderRepository>(sp =>
    new TheCoffeCream.Infrastructure.GoogleSheets.GoogleSheetOrderRepository(builder.Configuration["GoogleSheets:OrdersSheetId"] ?? string.Empty)
);
// TODO: Implement IProductRepository with Google Sheets or other storage. Use in-memory placeholder for now
builder.Services.AddSingleton<TheCoffeCream.Application.Interfaces.IProductRepository>(sp =>
    new TheCoffeCream.Infrastructure.GoogleSheets.GoogleSheetProductRepositoryPlaceholder()
);

builder.Services.AddScoped<TheCoffeCream.Application.Services.OrderService>();
builder.Services.AddScoped<TheCoffeCream.Application.Services.ProductService>();
builder.Services.AddScoped<TheCoffeCream.Application.Services.ReportService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// API key middleware
app.UseMiddleware<TheCoffeCream.Shared.Middleware.ApiKeyMiddleware>();

app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));

app.MapControllers();

app.Run();
