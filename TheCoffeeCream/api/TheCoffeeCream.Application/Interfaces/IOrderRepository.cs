using System;
using System.Threading.Tasks;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<bool> ExistsByClientOrderIdAsync(Guid clientOrderId, string shopId);
        Task<Order?> GetByClientOrderIdAsync(Guid clientOrderId, string shopId);
        Task AddAsync(Order order);
        Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTimeOffset startDate, DateTimeOffset endDate, string shopId);
        Task<Order?> GetByIdAsync(Guid id, string shopId);
        Task UpdateAsync(Order order);
        Task ToggleActiveAsync(Guid id, string shopId);
    }
}
