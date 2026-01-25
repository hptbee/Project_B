using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Application.Services;
using Microsoft.AspNetCore.Authorization;

namespace TheCoffeeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Only admins can manage users
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<UserResponse>> Create([FromBody] UserUpsertRequest request)
        {
            if (request == null) return BadRequest();
            var user = await _userService.CreateUserAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserResponse>> Update(string id, [FromBody] UserUpsertRequest request)
        {
            if (request == null) return BadRequest();
            var user = await _userService.UpdateUserAsync(id, request);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> ToggleActive(string id)
        {
            var success = await _userService.ToggleUserActiveAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
