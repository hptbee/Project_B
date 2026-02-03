using Microsoft.EntityFrameworkCore;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Infrastructure.Data;

namespace TheCoffeeCream.Infrastructure.Repositories
{
    public class EfOrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public EfOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsByClientOrderIdAsync(Guid clientOrderId, string shopId)
        {
            return await _context.Orders
                .AnyAsync(o => o.ClientOrderId == clientOrderId && o.ShopId == shopId);
        }

        public async Task<Order?> GetByClientOrderIdAsync(Guid clientOrderId, string shopId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.ClientOrderId == clientOrderId && o.ShopId == shopId);
        }

        public async Task<Order?> GetByIdAsync(Guid id, string shopId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id && o.ShopId == shopId);
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTimeOffset startDate, DateTimeOffset endDate, string shopId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate && o.ShopId == shopId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task ToggleActiveAsync(Guid id, string shopId)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == id && o.ShopId == shopId);
            if (order != null)
            {
                order.IsActive = !order.IsActive;
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }
    }
}
