using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using BC = BCrypt.Net.BCrypt;

namespace TheCoffeeCream.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<LoginResult?> LoginAsync(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null) return null;

            // Verify password
            try 
            {
                var abc = BC.HashPassword(password);
                if (!BC.Verify(password, user.PasswordHash))
                {
                    return null;
                }
            }
            catch (Exception)
            {
                // In case of invalid hash format during development
                return null;
            }

            var token = GenerateJwtToken(user);
            return new LoginResult
            {
                User = user,
                Token = token
            };
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JWT");
            var secretKey = jwtSettings["Key"] ?? "TheCoffeeCream_Super_Secret_Key_2026_!@#";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim("username", user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"] ?? "TheCoffeeCream",
                audience: jwtSettings["Audience"] ?? "TheCoffeeCreamStaff",
                claims: claims,
                expires: DateTime.Now.AddDays(double.Parse(jwtSettings["DurationInDays"] ?? "30")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
