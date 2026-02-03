using Microsoft.EntityFrameworkCore;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Infrastructure.Data;

namespace TheCoffeeCream.Infrastructure.Repositories
{
    public class EfSubscriptionHistoryRepository : ISubscriptionHistoryRepository
    {
        private readonly ApplicationDbContext _context;

        public EfSubscriptionHistoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SubscriptionHistory?> GetByIdAsync(string id)
        {
            return await _context.SubscriptionHistories.FindAsync(id);
        }

        public async Task<IEnumerable<SubscriptionHistory>> GetByShopIdAsync(string shopId)
        {
            return await _context.SubscriptionHistories
                .Where(sh => sh.ShopId == shopId)
                .OrderByDescending(sh => sh.PurchaseDate)
                .ToListAsync();
        }

        public async Task CreateAsync(SubscriptionHistory subscriptionHistory)
        {
            _context.SubscriptionHistories.Add(subscriptionHistory);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SubscriptionHistory subscriptionHistory)
        {
            _context.SubscriptionHistories.Update(subscriptionHistory);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(string id)
        {
            var item = await _context.SubscriptionHistories.FindAsync(id);
            if (item != null)
            {
                _context.SubscriptionHistories.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}
