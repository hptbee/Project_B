using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeCream.Application.DTOs;
using TheCoffeCream.Application.Services;

namespace TheCoffeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
        {
            if (request == null) return BadRequest("Request body is required");
            try
            {
                var order = await _orderService.CreateOrderAsync(request);

                var response = new OrderResponse
                {
                    Id = order.Id,
                    ClientOrderId = order.ClientOrderId,
                    CreatedAt = order.CreatedAt,
                    OrderType = order.OrderType.ToString(),
                    TableNumber = order.TableNumber,
                    Items = order.Items.Select(i => new OrderItemResponse
                    {
                        ProductId = i.ProductId,
                        Name = i.Name,
                        UnitPrice = i.UnitPrice,
                        Quantity = i.Quantity,
                        Total = i.Total
                    }).ToList(),
                    Total = order.Total
                };

                return CreatedAtAction(nameof(Create), new { id = response.Id }, response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                // Idempotency conflict: order exists
                return Conflict(ex.Message);
            }
        }
    }
}
