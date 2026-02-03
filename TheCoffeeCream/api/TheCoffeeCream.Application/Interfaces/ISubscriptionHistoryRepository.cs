using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface ISubscriptionHistoryRepository
    {
        Task<SubscriptionHistory?> GetByIdAsync(string id);
        Task<IEnumerable<SubscriptionHistory>> GetByShopIdAsync(string shopId);
        Task CreateAsync(SubscriptionHistory subscriptionHistory);
        Task UpdateAsync(SubscriptionHistory subscriptionHistory);
        Task DeleteAsync(string id);
    }
}
