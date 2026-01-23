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

// Bind GoogleSheets options from configuration
builder.Services.Configure<TheCoffeCream.Infrastructure.GoogleSheets.GoogleSheetsOptions>(builder.Configuration.GetSection("GoogleSheets"));

// Register Google Sheets client and repositories
builder.Services.AddSingleton<TheCoffeCream.Infrastructure.GoogleSheets.IGoogleSheetsClient, TheCoffeCream.Infrastructure.GoogleSheets.GoogleSheetsClient>();
builder.Services.AddSingleton<TheCoffeCream.Application.Interfaces.IOrderRepository, TheCoffeCream.Infrastructure.GoogleSheets.GoogleSheetOrderRepository>();
builder.Services.AddSingleton<TheCoffeCream.Application.Interfaces.IProductRepository, TheCoffeCream.Infrastructure.GoogleSheets.GoogleSheetProductRepository>();

builder.Services.AddScoped<TheCoffeCream.Application.Services.OrderService>();
builder.Services.AddScoped<TheCoffeCream.Application.Services.ProductService>();
builder.Services.AddScoped<TheCoffeCream.Application.Interfaces.IReportService, TheCoffeCream.Application.Services.ReportService>();

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
