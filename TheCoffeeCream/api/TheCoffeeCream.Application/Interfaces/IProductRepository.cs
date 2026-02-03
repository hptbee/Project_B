using System.Collections.Generic;
using System.Threading.Tasks;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync(string shopId);
        Task<IEnumerable<Category>> GetCategoriesAsync(string shopId);
        Task<Product?> GetByIdAsync(Guid id, string shopId);
        Task CreateAsync(Product product);
        Task UpdateAsync(Product product);
        Task ToggleActiveAsync(Guid id, string shopId);
        Task CreateCategoryAsync(Category category);
    }
}
