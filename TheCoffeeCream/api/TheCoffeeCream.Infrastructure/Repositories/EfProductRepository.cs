using Microsoft.EntityFrameworkCore;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Infrastructure.Data;

namespace TheCoffeeCream.Infrastructure.Repositories
{
    public class EfProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public EfProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Product?> GetByIdAsync(Guid id, string shopId)
        {
            return await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id && p.ShopId == shopId);
        }

        public async Task<IEnumerable<Product>> GetAllAsync(string shopId)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Where(p => p.ShopId == shopId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync(string shopId)
        {
            return await _context.Categories
                .Where(c => c.ShopId == shopId)
                .OrderBy(c => c.Rank)
                .ToListAsync();
        }

        public async Task CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task ToggleActiveAsync(Guid id, string shopId)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.ShopId == shopId);
            if (product != null)
            {
                product.IsActive = !product.IsActive;
                await _context.SaveChangesAsync();
            }
        }

        public async Task CreateCategoryAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }
    }
}
