using System.Security.Claims;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
        string GenerateEmailVerificationToken(User user);
        ClaimsPrincipal GetPrincipalFromToken(string token);
    }
}
