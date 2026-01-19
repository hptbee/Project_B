using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TheCoffeCream.Application.Services;

namespace TheCoffeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportsController(ReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("daily")]
        public async Task<IActionResult> GetDaily([FromQuery] DateTime? date)
        {
            var target = date ?? DateTime.UtcNow.Date;
            var report = await _reportService.GetDailyReportAsync(target);
            return Ok(report);
        }
    }
}
