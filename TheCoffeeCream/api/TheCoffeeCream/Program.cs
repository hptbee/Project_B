var builder = WebApplication.CreateBuilder(args);

// If Render (or any host) provides GOOGLE_CREDENTIALS_JSON, write it to disk
var googleCredJson = Environment.GetEnvironmentVariable("GOOGLE_CREDENTIALS_JSON");
if (!string.IsNullOrEmpty(googleCredJson))
{
    // write to a file the GoogleSheets client expects by default
    var credPath = Path.Combine(Directory.GetCurrentDirectory(), "google-credentials.json");
    File.WriteAllText(credPath, googleCredJson);
    // expose to configuration so GoogleSheetsOptions can pick it up via config or defaults
    builder.Configuration.AddInMemoryCollection(new[] { new KeyValuePair<string, string?>("GoogleSheets:CredentialsPath", credPath) });
}

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
        builder => builder.AllowAnyOrigin()
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

// 1. CORS MUST be at the top to handle preflight and add headers to all responses
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2. Health check before any middleware (allows monitoring without API key)
app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));

app.UseHttpsRedirection();

// 3. API key middleware
app.UseMiddleware<TheCoffeeCream.Shared.Middleware.ApiKeyMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
