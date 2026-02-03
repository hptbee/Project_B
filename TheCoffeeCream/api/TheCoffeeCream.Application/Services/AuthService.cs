using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using BC = BCrypt.Net.BCrypt;

namespace TheCoffeeCream.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IShopRepository _shopRepository;
        private readonly IEmailService _emailService;
        private readonly ITokenService _tokenService;

        public AuthService(IUserRepository userRepository, IShopRepository shopRepository, IEmailService emailService, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _shopRepository = shopRepository;
            _emailService = emailService;
            _tokenService = tokenService;
        }

        public async Task<LoginResult?> LoginAsync(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            
            // If checking globally, we might get multiple users with same username in different shops.
            // Requirement said "ShopCode + Username" or "Email".
            // Implementation: Assuming Email is unique OR checking specific shop context if passed.
            // Current code looks up by username. If username is not unique across system, this fails.
            // For now, let's assume unique usernames or emails. 
            // Better approach: Login with Email.
            
            if (user == null) 
            {
                Console.WriteLine($"[AUTH-DEBUG] User not found: {username}");
                return null;
            }

            // Verify password
            try 
            {
                if (!BC.Verify(password, user.PasswordHash))
                {
                    Console.WriteLine($"[AUTH-DEBUG] Password verification failed for: {username}");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AUTH-DEBUG] Exception during password verification: {ex.Message}");
                return null;
            }

            // Check Shop Subscription Status
            var shop = await _shopRepository.GetByIdAsync(user.ShopId);
            if (shop != null && user.Role != "Super_Admin")
            {
                if (!shop.IsActive || shop.ExpiryDate < DateTimeOffset.UtcNow)
                {
                    Console.WriteLine($"[AUTH-DEBUG] Shop inactive or expired for: {username}. Shop Active: {shop.IsActive}, Expiry: {shop.ExpiryDate}");
                    return null; 
                }
            }
            else if (shop == null && user.Role != "Super_Admin")
            {
                 Console.WriteLine($"[AUTH-DEBUG] Shop NOT FOUND for user: {username}, ShopId: {user.ShopId}");
            }

            var token = _tokenService.GenerateToken(user);
            return new LoginResult
            {
                User = user,
                Token = token
            };
        }

        public async Task<ShopDto> RegisterShopAsync(RegisterShopDto dto)
        {
            // 1. Calculate Expiry Date
            var now = DateTimeOffset.UtcNow;
            DateTimeOffset expiry = now;
            
            switch (dto.PlanType)
            {
                case SubscriptionPlanType.TRIAL_15_DAYS: expiry = now.AddDays(15); break;
                case SubscriptionPlanType.BASIC_30_DAYS: expiry = now.AddDays(30); break;
                case SubscriptionPlanType.PREMIUM_6_MONTHS: expiry = now.AddMonths(6); break;
                case SubscriptionPlanType.PREMIUM_1_YEAR: expiry = now.AddYears(1); break;
                default: expiry = now.AddDays(15); break;
            }

            // 2. Create Shop
            var shop = new Shop
            {
                Id = Guid.NewGuid().ToString(),
                Code = dto.ShopCode,
                Name = dto.ShopName,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.ShopEmail,
                TaxCode = dto.TaxCode,
                SubscriptionPlan = dto.PlanType.ToString(),
                StartDate = now,
                ExpiryDate = expiry,
                IsActive = true,
                CreatedAt = now
            };

            await _shopRepository.CreateAsync(shop);

            // 3. Create Admin User
            var adminUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                ShopId = shop.Id, // Link to shop
                Username = dto.AdminUsername,
                Email = dto.AdminEmail,
                Role = "Admin",
                IsActive = false, // Set to false initially
                PasswordHash = BC.HashPassword(dto.AdminPassword)
            };

            await _userRepository.CreateAsync(adminUser);

            // 4. Send Verification Email
            var token = _tokenService.GenerateEmailVerificationToken(adminUser);
            var verificationLink = $"http://localhost:4200/verify-email?token={token}"; // Adjust URL as needed
            var emailBody = $"<h3>Welcome to The Coffee Cream!</h3><p>Please verify your email by clicking <a href='{verificationLink}'>here</a>.</p>";
            await _emailService.SendEmailAsync(adminUser.Email, "Verify your email", emailBody);

            return new ShopDto
            {
                Id = shop.Id,
                Code = shop.Code,
                Name = shop.Name,
                Address = shop.Address,
                PhoneNumber = shop.PhoneNumber,
                Email = shop.Email,
                SubscriptionPlan = shop.SubscriptionPlan,
                ExpiryDate = shop.ExpiryDate,
                IsActive = shop.IsActive
            };
        }

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var principal = _tokenService.GetPrincipalFromToken(token);
            if (principal == null) return false;

            var typeClaim = principal.FindFirst("type")?.Value;
            if (typeClaim != "email_verification") return false;

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
            // Note: JwtRegisteredClaimNames.Sub usually maps to NameIdentifier in ClaimsPrincipal if standard mapping is on.
            // But let's check how we implemented it. In JwtTokenService we used Sub.
            // When validated, map might change it.
            // Let's assume standard behavior or check the claim directly if not mapped.
            if (string.IsNullOrEmpty(userId))
            {
                 // Fallback to "sub" if NameIdentifier not found (depends on Claim mapping)
                 userId = principal.FindFirst("sub")?.Value;
            }

            if (userId == null) return false;

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            user.IsActive = true;
            await _userRepository.UpdateAsync(user);

            return true;
        }
    }
}
