using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TheCoffeeCream.Application.Services;
using TheCoffeeCream.Application.DTOs;

namespace TheCoffeeCream.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly ProductService _productService;

        public MenuController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var menu = await _productService.GetMenuAsync();
            return Ok(menu);
        }
    }
}
