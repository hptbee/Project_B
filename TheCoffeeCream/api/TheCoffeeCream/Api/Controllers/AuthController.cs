using Microsoft.AspNetCore.Mvc;
using TheCoffeeCream.Application.Interfaces;

namespace TheCoffeeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Username and password are required" });
            }

            var result = await _authService.LoginAsync(request.Username, request.Password);
            if (result == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(result);
        }

        [HttpPost("register-shop")]
        public async Task<IActionResult> RegisterShop([FromBody] Application.DTOs.RegisterShopDto request)
        {
             if (!ModelState.IsValid)
             {
                 return BadRequest(ModelState);
             }

             var result = await _authService.RegisterShopAsync(request);
             return Ok(result);
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Token is required" });
            }

            var result = await _authService.VerifyEmailAsync(token);
            if (!result)
            {
                return BadRequest(new { message = "Invalid or expired token" });
            }

            return Ok(new { message = "Email verified successfully" });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
