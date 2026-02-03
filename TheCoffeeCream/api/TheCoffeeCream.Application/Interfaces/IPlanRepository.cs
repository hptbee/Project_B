using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface IPlanRepository
    {
        Task<IEnumerable<Plan>> GetAllAsync();
        Task<Plan?> GetByIdAsync(string id);
        Task CreateAsync(Plan plan);
        Task UpdateAsync(Plan plan);
        Task DeleteAsync(string id);
    }
}
