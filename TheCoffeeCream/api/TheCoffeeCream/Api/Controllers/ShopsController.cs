using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using BC = BCrypt.Net.BCrypt;

namespace TheCoffeeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Super_Admin")]
    public class ShopsController : ControllerBase
    {
        private readonly IShopRepository _shopRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;

        public ShopsController(IShopRepository shopRepository, IUserRepository userRepository, IAuthService authService)
        {
            _shopRepository = shopRepository;
            _userRepository = userRepository;
            _authService = authService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllShops()
        {
            var shops = await _shopRepository.GetAllAsync();
            return Ok(shops);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShopById(string id)
        {
            var shop = await _shopRepository.GetByIdAsync(id);
            if (shop == null) return NotFound();
            return Ok(shop);
        }

        [HttpPost]
        public async Task<IActionResult> CreateShop([FromBody] RegisterShopDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.RegisterShopAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShop(string id, [FromBody] Shop shop)
        {
            if (id != shop.Id) return BadRequest();
            
            var existingShop = await _shopRepository.GetByIdAsync(id);
            if (existingShop == null) return NotFound();

            // Preserve critical fields if not provided or handle mapping
            existingShop.Name = shop.Name;
            existingShop.Address = shop.Address;
            existingShop.PhoneNumber = shop.PhoneNumber;
            existingShop.Email = shop.Email;
            existingShop.LogoUrl = shop.LogoUrl;
            existingShop.TaxCode = shop.TaxCode;
            existingShop.IsActive = shop.IsActive;

            await _shopRepository.UpdateAsync(existingShop);
            return Ok(existingShop);
        }

        [HttpPost("{id}/extend")]
        public async Task<IActionResult> ExtendSubscription(string id, [FromBody] ExtendSubscriptionRequest request)
        {
             var shop = await _shopRepository.GetByIdAsync(id);
             if (shop == null) return NotFound();

             if (request.Days > 0)
             {
                 // If already expired, start from now? Or add to expiry?
                 // Usually if expired, we reset to Now + Days. If active, we add to Expiry.
                 if (shop.ExpiryDate < DateTimeOffset.UtcNow)
                 {
                     shop.ExpiryDate = DateTimeOffset.UtcNow.AddDays(request.Days);
                 }
                 else
                 {
                     shop.ExpiryDate = shop.ExpiryDate.AddDays(request.Days);
                 }
                 await _shopRepository.UpdateAsync(shop);
             }
             return Ok(shop);
        }

        [HttpPost("{id}/reset-password")]
        public async Task<IActionResult> ResetShopAdminPassword(string id, [FromBody] ResetPasswordRequest request)
        {
            // Find the admin user for this shop. 
            // Note: A shop might have multiple admins, but usually one main one created initially.
            // Or we look for the user with Role='Admin' and ShopId=id.
            // Since we don't have GetUsersByShopId in simple repo, we might need to rely on username or email if provided,
            // OR searching all users.
            // Ideally, the request should specify WHICH user to reset, or we assume the main one.
            // Let's assume we find ANY user with Role 'Admin' in this shop for valid MVP.
            
            // Wait, we need a way to find users of a shop.
            // Assuming we don't have that yet, let's look at UserRepository.
            // DapperUserRepository doesn't have GetByShopId.
            // For now, I will add a rough check or just fail.
            // BETTER: The request should probably include the Admin's Email or Username to identify the user.
            
            if (string.IsNullOrEmpty(request.Username))
            {
                 return BadRequest("Username is required to identify the admin user.");
            }

            var user = await _userRepository.GetByUsernameAsync(request.Username);
            if (user == null || user.ShopId != id)
            {
                 return NotFound("User not found in this shop.");
            }

            user.PasswordHash = BC.HashPassword(request.NewPassword);
            await _userRepository.UpdateAsync(user);

            return Ok(new { message = "Password reset successfully." });
        }
        
        [HttpPost("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(string id)
        {
            var shop = await _shopRepository.GetByIdAsync(id);
            if (shop == null) return NotFound();
            
            shop.IsActive = !shop.IsActive;
            await _shopRepository.UpdateAsync(shop);
            
            return Ok(shop);
        }

        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetSubscriptionHistory(string id)
        {
            var history = await _shopRepository.GetHistoryByShopIdAsync(id);
            return Ok(history);
        }

        [HttpGet("all-history")]
        public async Task<IActionResult> GetAllSubscriptionHistory()
        {
            var history = await _shopRepository.GetAllHistoryAsync();
            return Ok(history);
        }

        [HttpPost("{id}/purchase-plan")]
        public async Task<IActionResult> PurchasePlan(string id, [FromBody] PurchasePlanRequest request)
        {
            var shop = await _shopRepository.GetByIdAsync(id);
            if (shop == null) return NotFound();

            // Update shop plan and expiry
            shop.SubscriptionPlan = request.PlanName;
            
            // Log history
            var history = new SubscriptionHistory
            {
                ShopId = id,
                PlanName = request.PlanName,
                DurationDays = request.DurationDays,
                Amount = request.Price,
                NewExpiryDate = shop.ExpiryDate.AddDays(request.DurationDays),
                Status = "SUCCESS"
            };

            shop.ExpiryDate = history.NewExpiryDate;

            await _shopRepository.AddHistoryAsync(history);
            await _shopRepository.UpdateAsync(shop);

            return Ok(new { shop, history });
        }

        [HttpPut("history/{id}")]
        public async Task<IActionResult> UpdateHistory(string id, [FromBody] SubscriptionHistory history)
        {
            if (id != history.Id) return BadRequest();
            var existing = await _shopRepository.GetHistoryByIdAsync(id);
            if (existing == null) return NotFound();

            await _shopRepository.UpdateHistoryAsync(history);
            return Ok(history);
        }

        [HttpDelete("history/{id}")]
        public async Task<IActionResult> DeleteHistory(string id)
        {
            var existing = await _shopRepository.GetHistoryByIdAsync(id);
            if (existing == null) return NotFound();

            await _shopRepository.DeleteHistoryAsync(id);
            return NoContent();
        }
    }

    public class PurchasePlanRequest
    {
        public string PlanName { get; set; }
        public int DurationDays { get; set; }
        public decimal Price { get; set; }
    }

    public class ExtendSubscriptionRequest
    {
        public int Days { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Username { get; set; }
        public string NewPassword { get; set; }
    }
}
