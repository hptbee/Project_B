using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TheCoffeCream.Application.Interfaces;

namespace TheCoffeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        /// <summary>
        /// Get revenue report grouped by time period
        /// </summary>
        /// <param name="startDate">Start date (ISO 8601)</param>
        /// <param name="endDate">End date (ISO 8601)</param>
        /// <param name="groupBy">Grouping: day, week, month, year</param>
        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueReport(
            [FromQuery] DateTimeOffset startDate,
            [FromQuery] DateTimeOffset endDate,
            [FromQuery] string groupBy = "day")
        {
            try
            {
                var report = await _reportService.GetRevenueReportAsync(startDate, endDate, groupBy);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Get product sales report
        /// </summary>
        /// <param name="startDate">Start date (ISO 8601)</param>
        /// <param name="endDate">End date (ISO 8601)</param>
        /// <param name="category">Optional category filter</param>
        [HttpGet("products")]
        public async Task<IActionResult> GetProductSalesReport(
            [FromQuery] DateTimeOffset startDate,
            [FromQuery] DateTimeOffset endDate,
            [FromQuery] string? category = null)
        {
            try
            {
                var report = await _reportService.GetProductSalesReportAsync(startDate, endDate, category);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Get payment method report
        /// </summary>
        /// <param name="startDate">Start date (ISO 8601)</param>
        /// <param name="endDate">End date (ISO 8601)</param>
        [HttpGet("payment-methods")]
        public async Task<IActionResult> GetPaymentMethodReport(
            [FromQuery] DateTimeOffset startDate,
            [FromQuery] DateTimeOffset endDate)
        {
            try
            {
                var report = await _reportService.GetPaymentMethodReportAsync(startDate, endDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
