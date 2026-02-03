using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface IShopRepository
    {
        Task<Shop?> GetByIdAsync(string id);
        Task<Shop?> GetByCodeAsync(string code);
        Task<IEnumerable<Shop>> GetAllAsync();
        Task CreateAsync(Shop shop);
        Task UpdateAsync(Shop shop);
        Task<IEnumerable<SubscriptionHistory>> GetHistoryByShopIdAsync(string shopId);
        Task<IEnumerable<SubscriptionHistory>> GetAllHistoryAsync();
        Task<SubscriptionHistory?> GetHistoryByIdAsync(string id);
        Task AddHistoryAsync(SubscriptionHistory history);
        Task UpdateHistoryAsync(SubscriptionHistory history);
        Task DeleteHistoryAsync(string id);
    }
}
