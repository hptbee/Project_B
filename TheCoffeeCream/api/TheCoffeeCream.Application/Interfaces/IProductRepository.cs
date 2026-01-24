using System.Collections.Generic;
using System.Threading.Tasks;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<IEnumerable<Category>> GetCategoriesAsync();
    }
}
