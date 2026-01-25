using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Application.Services;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Microsoft.AspNetCore.Authorization.Authorize]
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

                var response = MapOrderToResponse(order);

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

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] DateTimeOffset? startDate, [FromQuery] DateTimeOffset? endDate)
        {
            var start = startDate ?? DateTimeOffset.Now.AddDays(-1);
            var end = endDate ?? DateTimeOffset.Now.AddDays(1);

            var orders = await _orderService.GetOrdersByDateRangeAsync(start, end);
            var response = orders.Select(MapOrderToResponse).ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();

            return Ok(MapOrderToResponse(order));
        }

        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateOrderRequest request)
        {
            if (request == null) return BadRequest("Request body is required");
            try
            {
                await _orderService.UpdateOrderAsync(id, request);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();

            await _orderService.SoftDeleteOrderAsync(id);
            return NoContent();
        }

        private OrderResponse MapOrderToResponse(Order order)
        {
            return new OrderResponse
            {
                Id = order.Id,
                ClientOrderId = order.ClientOrderId,
                CreatedAt = order.CreatedAt,
                OrderType = order.OrderType.ToString(),
                TableNumber = order.TableNumber,
                SubTotal = order.SubTotal,
                DiscountType = order.DiscountType?.ToString(),
                DiscountValue = order.DiscountValue,
                DiscountAmount = order.DiscountAmount,
                PaymentMethod = order.PaymentMethod.ToString(),
                CashAmount = order.CashAmount,
                TransferAmount = order.TransferAmount,
                Status = order.Status.ToString(),
                Note = order.Note,
                Items = order.Items.Select(i => new OrderItemResponse
                {
                    ProductId = i.ProductId,
                    Name = i.Name,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    DiscountType = i.DiscountType?.ToString(),
                    DiscountValue = i.DiscountValue,
                    DiscountAmount = i.DiscountAmount,
                    Total = i.Total,
                    Note = i.Note,
                    SelectedToppings = i.SelectedToppings.Select(t => new ProductDto
                    {
                        Id = t.ProductId,
                        Name = t.Name,
                        Price = t.Price,
                        IsTopping = true
                    }).ToList()
                }).ToList(),
                Total = order.Total
            };
        }
        [HttpPost("seed-financials")]
        public async Task<IActionResult> SeedFinancials()
        {
            var p1Id = Guid.Parse("ef7205ac-9b18-4e74-87c9-8c9096767668"); // Bánh Tráng Hành
            var p2Id = Guid.Parse("e149c835-6812-4664-87c9-8ed49ed49668"); // Phá máy
            var toppingId = Guid.Parse("145744cd-189c-4664-87c9-8ed49ed49668"); // Trân Châu Hoàng Gia

            // 1. Order with Item Discount (10%) and Cash
            await _orderService.CreateOrderAsync(new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                OrderType = "DINE_IN",
                TableNumber = 1,
                PaymentMethod = "CASH",
                Items = new List<CreateOrderItemRequest> {
                    new CreateOrderItemRequest {
                        ProductId = p1Id, Quantity = 2, Name = "Bánh Tráng Hành", UnitPrice = 7,
                        DiscountType = "PERCENTAGE", DiscountValue = 10
                    }
                }
            });

            // 2. Order with Order Discount (5 units) and Transfer
            await _orderService.CreateOrderAsync(new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                OrderType = "TAKE_AWAY",
                PaymentMethod = "TRANSFER",
                DiscountType = "FIXED",
                DiscountValue = 5,
                Items = new List<CreateOrderItemRequest> {
                    new CreateOrderItemRequest {
                        ProductId = p2Id, Quantity = 1, Name = "Phá máy", UnitPrice = 33
                    }
                }
            });

            // 3. Order with Combined Payment and Toppings
            // Total should be (7*1 + 6) = 13. Cash 5, Transfer 8.
            await _orderService.CreateOrderAsync(new CreateOrderRequest
            {
                ClientOrderId = Guid.NewGuid(),
                OrderType = "DINE_IN",
                TableNumber = 2,
                PaymentMethod = "COMBINED",
                CashAmount = 5,
                TransferAmount = 8,
                Items = new List<CreateOrderItemRequest> {
                    new CreateOrderItemRequest {
                        ProductId = p1Id, Quantity = 1, Name = "Bánh Tráng Hành", UnitPrice = 7,
                        SelectedToppingNames = new List<string> { "Trân Châu Hoàng Gia" }
                    }
                }
            });

            return Ok("Financial sample data seeded.");
        }
    }
}
