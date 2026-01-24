using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeCream.Application.DTOs;
using TheCoffeCream.Application.Interfaces;
using TheCoffeCream.Domain.Entities;

namespace TheCoffeCream.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public ReportService(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<RevenueReport>> GetRevenueReportAsync(DateTimeOffset startDate, DateTimeOffset endDate, string groupBy)
        {
            var orders = await _orderRepository.GetOrdersByDateRangeAsync(startDate, endDate);
            
            var grouped = groupBy.ToLower() switch
            {
                "day" => orders.GroupBy(o => o.CreatedAt.Date),
                "week" => orders.GroupBy(o => GetWeekStart(o.CreatedAt)),
                "month" => orders.GroupBy(o => new DateTime(o.CreatedAt.Year, o.CreatedAt.Month, 1)),
                "year" => orders.GroupBy(o => new DateTime(o.CreatedAt.Year, 1, 1)),
                _ => orders.GroupBy(o => o.CreatedAt.Date)
            };

            return grouped.Select(g => new RevenueReport
            {
                Period = FormatPeriod(g.Key, groupBy),
                TotalRevenue = g.Sum(o => o.SubTotal),
                TotalDiscounts = g.Sum(o => o.DiscountAmount),
                NetRevenue = g.Sum(o => o.Total),
                OrderCount = g.Count()
            }).OrderBy(r => r.Period);
        }

        public async Task<IEnumerable<ProductSalesReport>> GetProductSalesReportAsync(DateTimeOffset startDate, DateTimeOffset endDate, string? category = null)
        {
            var orders = await _orderRepository.GetOrdersByDateRangeAsync(startDate, endDate);
            var products = (await _productRepository.GetAllAsync()).ToDictionary(p => p.Id);
            
            var productSales = orders
                .SelectMany(o => o.Items)
                .GroupBy(i => i.ProductId)
                .Select(g =>
                {
                    var productId = g.Key;
                    var productName = g.First().Name;
                    var productCategory = products.ContainsKey(productId) ? products[productId].Category : "Unknown";
                    
                    return new ProductSalesReport
                    {
                        ProductId = productId,
                        ProductName = productName,
                        Category = productCategory,
                        QuantitySold = g.Sum(i => i.Quantity),
                        Revenue = g.Sum(i => i.Total)
                    };
                });

            // Filter by category if provided
            if (!string.IsNullOrEmpty(category))
            {
                productSales = productSales.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
            }

            return productSales.OrderByDescending(p => p.Revenue);
        }

        public async Task<IEnumerable<PaymentMethodReport>> GetPaymentMethodReportAsync(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            var orders = await _orderRepository.GetOrdersByDateRangeAsync(startDate, endDate);
            
            var paymentReports = orders
                .GroupBy(o => o.PaymentMethod)
                .Select(g => new PaymentMethodReport
                {
                    PaymentMethod = g.Key.ToString(),
                    Revenue = g.Sum(o => o.Total),
                    OrderCount = g.Count(),
                    CashAmount = g.Sum(o => o.CashAmount),
                    TransferAmount = g.Sum(o => o.TransferAmount)
                })
                .OrderByDescending(p => p.Revenue);

            return paymentReports;
        }

        public async Task<DailyReport> GetDailyReportAsync(DateTimeOffset date)
        {
            var startDate = new DateTimeOffset(date.Year, date.Month, date.Day, 0, 0, 0, date.Offset);
            var endDate = startDate.AddDays(1).AddTicks(-1);
            
            var orders = (await _orderRepository.GetOrdersByDateRangeAsync(startDate, endDate))
                .Where(o => o.Status == OrderStatus.SUCCESS)
                .ToList();
            
            var report = new DailyReport
            {
                OrderCount = orders.Count,
                TotalRevenue = orders.Sum(o => o.Total),
                CashRevenue = orders.Sum(o => o.CashAmount),
                TransferRevenue = orders.Sum(o => o.TransferAmount),
                RegularCupCount = orders.SelectMany(o => o.Items).Sum(i => i.Quantity),
                ToppingCount = orders.SelectMany(o => o.Items).Sum(i => i.Quantity * (i.SelectedToppings?.Count ?? 0))
            };

            return report;
        }

        private DateTime GetWeekStart(DateTimeOffset date)
        {
            var diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-1 * diff).Date;
        }

        private string FormatPeriod(DateTime date, string groupBy)
        {
            return groupBy.ToLower() switch
            {
                "day" => date.ToString("yyyy-MM-dd"),
                "week" => $"Week of {date:yyyy-MM-dd}",
                "month" => date.ToString("yyyy-MM"),
                "year" => date.ToString("yyyy"),
                _ => date.ToString("yyyy-MM-dd")
            };
        }
    }
}
