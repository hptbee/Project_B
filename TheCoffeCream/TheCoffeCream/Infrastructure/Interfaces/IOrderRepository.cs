using System;
using System.Threading.Tasks;
using TheCoffeCream.Domain.Entities;

namespace TheCoffeCream.Infrastructure.Interfaces
{
    public interface IOrderRepository
    {
        Task<bool> ExistsByClientOrderIdAsync(Guid clientOrderId);
        Task AddAsync(Order order);
    }
}
