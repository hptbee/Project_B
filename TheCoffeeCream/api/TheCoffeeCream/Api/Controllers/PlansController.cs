using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Super_Admin")]
    public class PlansController : ControllerBase
    {
        private readonly IPlanRepository _planRepository;

        public PlansController(IPlanRepository planRepository)
        {
            _planRepository = planRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllPlans()
        {
            var plans = await _planRepository.GetAllAsync();
            return Ok(plans);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlanById(string id)
        {
            var plan = await _planRepository.GetByIdAsync(id);
            if (plan == null) return NotFound();
            return Ok(plan);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePlan([FromBody] Plan plan)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            plan.Id = Guid.NewGuid().ToString(); // Ensure new ID
            await _planRepository.CreateAsync(plan);
            return CreatedAtAction(nameof(GetPlanById), new { id = plan.Id }, plan);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlan(string id, [FromBody] Plan plan)
        {
            if (id != plan.Id) return BadRequest();
            var existing = await _planRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _planRepository.UpdateAsync(plan);
            return Ok(plan);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlan(string id)
        {
            var existing = await _planRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _planRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
