using System.Collections.Generic;
using System.Threading.Tasks;
using TheCoffeCream.Domain.Entities;

namespace TheCoffeCream.Infrastructure.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<IEnumerable<Category>> GetCategoriesAsync();
        Task<IEnumerable<Topping>> GetToppingsAsync();
    }
}
