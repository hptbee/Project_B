using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResult?> LoginAsync(string username, string password);
        Task<ShopDto> RegisterShopAsync(DTOs.RegisterShopDto registerDto);
        Task<bool> VerifyEmailAsync(string token);
    }

    public class LoginResult
    {
        public User User { get; set; } = null!;
        public string Token { get; set; } = string.Empty;
    }
}
