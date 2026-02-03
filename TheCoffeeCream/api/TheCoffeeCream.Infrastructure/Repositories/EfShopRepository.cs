using Microsoft.EntityFrameworkCore;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Infrastructure.Data;

namespace TheCoffeeCream.Infrastructure.Repositories
{
    public class EfShopRepository : IShopRepository
    {
        private readonly ApplicationDbContext _context;

        public EfShopRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Shop?> GetByIdAsync(string id)
        {
            return await _context.Shops.FindAsync(id);
        }

        public async Task<Shop?> GetByCodeAsync(string code)
        {
            return await _context.Shops
                .FirstOrDefaultAsync(s => s.Code == code);
        }

        public async Task<IEnumerable<Shop>> GetAllAsync()
        {
            return await _context.Shops.ToListAsync();
        }

        public async Task CreateAsync(Shop shop)
        {
            _context.Shops.Add(shop);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Shop shop)
        {
            _context.Shops.Update(shop);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<SubscriptionHistory>> GetHistoryByShopIdAsync(string shopId)
        {
            return await _context.SubscriptionHistories
                .Where(h => h.ShopId == shopId)
                .OrderByDescending(h => h.PurchaseDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<SubscriptionHistory>> GetAllHistoryAsync()
        {
            return await _context.SubscriptionHistories
                .OrderByDescending(h => h.PurchaseDate)
                .ToListAsync();
        }

        public async Task<SubscriptionHistory?> GetHistoryByIdAsync(string id)
        {
            return await _context.SubscriptionHistories.FindAsync(id);
        }

        public async Task AddHistoryAsync(SubscriptionHistory history)
        {
            _context.SubscriptionHistories.Add(history);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateHistoryAsync(SubscriptionHistory history)
        {
            _context.SubscriptionHistories.Update(history);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteHistoryAsync(string id)
        {
            var history = await _context.SubscriptionHistories.FindAsync(id);
            if (history != null)
            {
                _context.SubscriptionHistories.Remove(history);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ToggleActiveAsync(string id)
        {
            var shop = await _context.Shops.FindAsync(id);
            if (shop != null)
            {
                shop.IsActive = !shop.IsActive;
                await _context.SaveChangesAsync();
            }
        }
    }
}
