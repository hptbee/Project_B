using System;
using System.Threading.Tasks;
using TheCoffeCream.Domain.Entities;

namespace TheCoffeCream.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<bool> ExistsByClientOrderIdAsync(Guid clientOrderId);
        Task<Order?> GetByClientOrderIdAsync(Guid clientOrderId);
        Task AddAsync(Order order);
        Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTimeOffset startDate, DateTimeOffset endDate);
        Task<Order?> GetByIdAsync(Guid id);
    }
}
