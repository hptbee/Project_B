using Microsoft.EntityFrameworkCore;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Infrastructure.Data;

namespace TheCoffeeCream.Infrastructure.Repositories
{
    public class EfPlanRepository : IPlanRepository
    {
        private readonly ApplicationDbContext _context;

        public EfPlanRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Plan>> GetAllAsync()
        {
            return await _context.Plans
                .OrderBy(p => p.Price)
                .ToListAsync();
        }

        public async Task<Plan?> GetByIdAsync(string id)
        {
            return await _context.Plans.FindAsync(id);
        }

        public async Task CreateAsync(Plan plan)
        {
            _context.Plans.Add(plan);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Plan plan)
        {
            _context.Plans.Update(plan);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(string id)
        {
            var plan = await _context.Plans.FindAsync(id);
            if (plan != null)
            {
                _context.Plans.Remove(plan);
                await _context.SaveChangesAsync();
            }
        }
    }
}
