using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeCream.Application.Services;
using TheCoffeCream.Application.DTOs;

namespace TheCoffeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products = await _productService.GetAllAsync();
            var dto = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Category = p.Category,
                Code = p.Code,
                Cost = p.Cost,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                IsTopping = p.IsTopping,
                Toppings = p.Toppings.Select(t => new ProductDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Category = t.Category,
                    Code = t.Code,
                    Cost = t.Cost,
                    Price = t.Price,
                    ImageUrl = t.ImageUrl,
                    IsActive = t.IsActive,
                    IsTopping = t.IsTopping
                }).ToList()
            }).ToList();

            return Ok(dto);
        }
    }
}
