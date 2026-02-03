using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Net;
using System.Threading.Tasks;

namespace TheCoffeeCream.Shared.Middleware
{
    public class ApiKeyOptions
    {
        public string HeaderName { get; set; } = "X-Api-Key";
        public string ApiKey { get; set; } = string.Empty;
    }

    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ApiKeyOptions _options;
        private readonly IHostEnvironment _env;

        public ApiKeyMiddleware(RequestDelegate next, IOptions<ApiKeyOptions> options, IHostEnvironment env)
        {
            _next = next;
            _options = options.Value;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (string.IsNullOrWhiteSpace(_options.ApiKey))
            {
                if (!_env.IsDevelopment())
                {
                    // Strict Mode: In Production, if API Key is missing, SERVER ERROR.
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    await context.Response.WriteAsync("Server Configuration Error: API Key is missing in Production environment.");
                    return;
                }
                
                // Allow for local/dev scenarios if not in Production
                await _next(context);
                return;
            }

            if (!context.Request.Headers.TryGetValue(_options.HeaderName, out var extractedApiKey))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsync("API Key was not provided.");
                return;
            }

            if (!string.Equals(extractedApiKey, _options.ApiKey))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsync("Unauthorized client.");
                return;
            }

            await _next(context);
        }
    }
}
