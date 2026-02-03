using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using BC = BCrypt.Net.BCrypt;

namespace TheCoffeeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Super_Admin, Admin")]
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
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> GetAllShops()
        {
            var shops = await _shopRepository.GetAllAsync();
            return Ok(shops);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyShop()
        {
            var userId = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.ShopId)) return NotFound("Shop not found for this user.");

            var shop = await _shopRepository.GetByIdAsync(user.ShopId);
            if (shop == null) return NotFound();

            return Ok(shop);
        }

        [HttpPut("my")]
        public async Task<IActionResult> UpdateMyShop([FromBody] Shop shopData)
        {
            var userId = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.ShopId)) return NotFound("Shop not found for this user.");

            var existingShop = await _shopRepository.GetByIdAsync(user.ShopId);
            if (existingShop == null) return NotFound();

            // Allow Shop Admin to update specific fields
            existingShop.Name = shopData.Name;
            existingShop.Address = shopData.Address;
            existingShop.PhoneNumber = shopData.PhoneNumber;
            existingShop.Email = shopData.Email;
            existingShop.LogoUrl = shopData.LogoUrl;
            existingShop.TaxCode = shopData.TaxCode;
            existingShop.VatRate = shopData.VatRate;
            existingShop.SurchargeRate = shopData.SurchargeRate;
            existingShop.ServiceChargeRate = shopData.ServiceChargeRate;

            await _shopRepository.UpdateAsync(existingShop);
            return Ok(existingShop);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> GetShopById(string id)
        {
            var shop = await _shopRepository.GetByIdAsync(id);
            if (shop == null) return NotFound();
            return Ok(shop);
        }

        [HttpPost]
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> CreateShop([FromBody] RegisterShopDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.RegisterShopAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> UpdateShop(string id, [FromBody] Shop shop)
        {
            if (id != shop.Id) return BadRequest();
            
            var existingShop = await _shopRepository.GetByIdAsync(id);
            if (existingShop == null) return NotFound();

            // Super Admin can update everything except maybe ID
            existingShop.Name = shop.Name;
            existingShop.Address = shop.Address;
            existingShop.PhoneNumber = shop.PhoneNumber;
            existingShop.Email = shop.Email;
            existingShop.LogoUrl = shop.LogoUrl;
            existingShop.TaxCode = shop.TaxCode;
            existingShop.IsActive = shop.IsActive;
            existingShop.VatRate = shop.VatRate;
            existingShop.SurchargeRate = shop.SurchargeRate;
            existingShop.ServiceChargeRate = shop.ServiceChargeRate;

            await _shopRepository.UpdateAsync(existingShop);
            return Ok(existingShop);
        }

        [HttpPost("{id}/extend")]
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> ExtendSubscription(string id, [FromBody] ExtendSubscriptionRequest request)
        {
             var shop = await _shopRepository.GetByIdAsync(id);
             if (shop == null) return NotFound();

             if (request.Days > 0)
             {
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
            // Allowed for Super_Admin OR Shop Admin resetting their own?
            // Usually reset password logic is separate. 
            // This endpoint seems designed for Super Admin to force reset a shop's admin.
            // Let's keep it Super_Admin for now unless specified.
            // But I put [Authorize(Roles="Super_Admin, Admin")] on class.
            // So I must restrict this if it's super admin only.
            
            // Check if user is Super Admin
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role != "Super_Admin")
            {
                // If not super admin, maybe allow if it's their own shop?
                // But this takes {id} URL param.
                // Let's restrict to Super_Admin for safety as per original design.
                return Forbid();
            }

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
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> ToggleStatus(string id)
        {
            var shop = await _shopRepository.GetByIdAsync(id);
            if (shop == null) return NotFound();
            
            shop.IsActive = !shop.IsActive;
            await _shopRepository.UpdateAsync(shop);
            
            return Ok(shop);
        }

        [HttpGet("{id}/history")]
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> GetSubscriptionHistory(string id)
        {
            var history = await _shopRepository.GetHistoryByShopIdAsync(id);
            return Ok(history);
        }

        [HttpGet("all-history")]
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> GetAllSubscriptionHistory()
        {
            var history = await _shopRepository.GetAllHistoryAsync();
            return Ok(history);
        }

        [HttpPost("{id}/purchase-plan")]
        [Authorize(Roles = "Super_Admin")]
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
        [Authorize(Roles = "Super_Admin")]
        public async Task<IActionResult> UpdateHistory(string id, [FromBody] SubscriptionHistory history)
        {
            if (id != history.Id) return BadRequest();
            var existing = await _shopRepository.GetHistoryByIdAsync(id);
            if (existing == null) return NotFound();

            await _shopRepository.UpdateHistoryAsync(history);
            return Ok(history);
        }

        [HttpDelete("history/{id}")]
        [Authorize(Roles = "Super_Admin")]
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
