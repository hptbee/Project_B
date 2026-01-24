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
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Configure options
builder.Services.Configure<TheCoffeeCream.Shared.Middleware.ApiKeyOptions>(builder.Configuration.GetSection("ApiKeyOptions"));

// Bind GoogleSheets options from configuration
builder.Services.Configure<TheCoffeeCream.Infrastructure.GoogleSheets.GoogleSheetsOptions>(builder.Configuration.GetSection("GoogleSheets"));

// Register Google Sheets client and repositories
builder.Services.AddSingleton<TheCoffeeCream.Infrastructure.GoogleSheets.IGoogleSheetsClient, TheCoffeeCream.Infrastructure.GoogleSheets.GoogleSheetsClient>();
builder.Services.AddSingleton<TheCoffeeCream.Application.Interfaces.IOrderRepository, TheCoffeeCream.Infrastructure.GoogleSheets.GoogleSheetOrderRepository>();
builder.Services.AddSingleton<TheCoffeeCream.Application.Interfaces.IProductRepository, TheCoffeeCream.Infrastructure.GoogleSheets.GoogleSheetProductRepository>();

builder.Services.AddScoped<TheCoffeeCream.Application.Services.OrderService>();
builder.Services.AddScoped<TheCoffeeCream.Application.Services.ProductService>();
builder.Services.AddScoped<TheCoffeeCream.Application.Interfaces.IReportService, TheCoffeeCream.Application.Services.ReportService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// API key middleware
app.UseMiddleware<TheCoffeeCream.Shared.Middleware.ApiKeyMiddleware>();

app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));

app.MapControllers();

app.Run();
