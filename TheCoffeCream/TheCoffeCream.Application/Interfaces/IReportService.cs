using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TheCoffeCream.Application.DTOs;

namespace TheCoffeCream.Application.Interfaces
{
    public interface IReportService
    {
        Task<IEnumerable<RevenueReport>> GetRevenueReportAsync(DateTimeOffset startDate, DateTimeOffset endDate, string groupBy);
        Task<IEnumerable<ProductSalesReport>> GetProductSalesReportAsync(DateTimeOffset startDate, DateTimeOffset endDate, string? category = null);
        Task<IEnumerable<PaymentMethodReport>> GetPaymentMethodReportAsync(DateTimeOffset startDate, DateTimeOffset endDate);
        Task<DailyReport> GetDailyReportAsync(DateTimeOffset date);
    }
}
