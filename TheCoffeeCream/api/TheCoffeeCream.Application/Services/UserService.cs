using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using BC = BCrypt.Net.BCrypt;

namespace TheCoffeeCream.Application.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IShopContext _shopContext;
        public UserService(IUserRepository userRepository, IShopContext shopContext)
        {
            _userRepository = userRepository;
            _shopContext = shopContext;
        }

        private string GetShopId() => _shopContext.GetShopId();

        public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToResponse);
        }

        public async Task<UserResponse?> GetUserByIdAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user != null ? MapToResponse(user) : null;
        }

        public async Task<UserResponse> CreateUserAsync(UserUpsertRequest request)
        {
            // 1. Get ShopId
            var shopId = GetShopId();

            // 2. Check active staff limit if creating an active user
            if (request.IsActive)
            {
                await EnsureActiveStaffLimitNotExceededAsync(shopId);
            }

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                ShopId = shopId,
                Email = request.Email,
                Username = request.Username,
                PasswordHash = !string.IsNullOrEmpty(request.Password) 
                    ? BC.HashPassword(request.Password) 
                    : string.Empty,
                Role = request.Role,
                IsActive = request.IsActive
            };

            await _userRepository.CreateAsync(user);
            return MapToResponse(user);
        }

        public async Task<UserResponse?> UpdateUserAsync(string id, UserUpsertRequest request)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            // Check limit if activating user
            if (request.IsActive && !user.IsActive)
            {
                await EnsureActiveStaffLimitNotExceededAsync(user.ShopId);
            }

            user.Email = request.Email;
            user.Username = request.Username;
            user.Role = request.Role;
            user.IsActive = request.IsActive;

            if (!string.IsNullOrEmpty(request.Password))
            {
                user.PasswordHash = BC.HashPassword(request.Password);
            }

            await _userRepository.UpdateAsync(user);
            return MapToResponse(user);
        }

        public async Task<bool> ToggleUserActiveAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            // Check limit if activating
            if (!user.IsActive) // currently inactive, so we are activating
            {
                await EnsureActiveStaffLimitNotExceededAsync(user.ShopId);
            }

            await _userRepository.ToggleActiveAsync(id);
            return true;
        }

        private async Task EnsureActiveStaffLimitNotExceededAsync(string shopId)
        {
            var users = await _userRepository.GetAllAsync();
            var activeStaffCount = users.Count(u => u.ShopId == shopId && u.Role == "Staff" && u.IsActive);

            if (activeStaffCount >= 5)
            {
                throw new InvalidOperationException("You have reached the limit of 5 active staff accounts. Please disable an existing account or contact admin support to upgrade.");
            }
        }

        private UserResponse MapToResponse(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                Role = user.Role,
                IsActive = user.IsActive
            };
        }
    }
}
