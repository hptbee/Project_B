using System;
using System.Collections.Generic;

namespace TheCoffeeCream.Application.DTOs
{
    public class ReportRequest
    {
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public string GroupBy { get; set; } = "day"; // day, week, month, year
    }

    public class RevenueReport
    {
        public string Period { get; set; } = string.Empty;
        public decimal TotalRevenue { get; set; }
        public decimal TotalDiscounts { get; set; }
        public decimal NetRevenue { get; set; }
        public int OrderCount { get; set; }
    }

    public class ProductSalesReport
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int QuantitySold { get; set; }
        public decimal Revenue { get; set; }
    }

    public class PaymentMethodReport
    {
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
        public decimal CashAmount { get; set; }
        public decimal TransferAmount { get; set; }
    }

    public class DailyReport
    {
        public int RegularCupCount { get; set; }
        public int ToppingCount { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal CashRevenue { get; set; }
        public decimal TransferRevenue { get; set; }
        public int OrderCount { get; set; }
    }
}
