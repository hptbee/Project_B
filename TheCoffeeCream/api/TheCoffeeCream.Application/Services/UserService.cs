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

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

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
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
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

            await _userRepository.ToggleActiveAsync(id);
            return true;
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
