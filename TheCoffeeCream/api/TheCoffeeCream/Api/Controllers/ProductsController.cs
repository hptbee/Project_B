using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using TheCoffeeCream.Application.Services;
using TheCoffeeCream.Application.DTOs;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Api.Controllers
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
            var dto = products.Select(MapToDto).ToList();

            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _productService.GetCategoriesAsync();
            return Ok(categories);
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductUpsertRequest request)
        {
            if (request == null) return BadRequest();
            var product = await _productService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductUpsertRequest request)
        {
            if (request == null) return BadRequest();
            var product = await _productService.UpdateAsync(id, request);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPatch("{id}/toggle")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleActive(Guid id)
        {
            var success = await _productService.ToggleActiveAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        private ProductDto MapToDto(Product p)
        {
            return new ProductDto
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
                    Price = t.Price,
                    IsActive = t.IsActive,
                    IsTopping = true
                }).ToList()
            };
        }
    }
}
