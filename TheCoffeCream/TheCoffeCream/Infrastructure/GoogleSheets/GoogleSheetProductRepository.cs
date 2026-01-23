using System.Globalization;
using Microsoft.Extensions.Options;
using TheCoffeCream.Domain.Entities;
using TheCoffeCream.Application.Interfaces;

namespace TheCoffeCream.Infrastructure.GoogleSheets
{
    // Simple in-memory placeholder until a real product repository is implemented.
    public class GoogleSheetProductRepository : IProductRepository
    {
        private readonly IGoogleSheetsClient _client;
        private readonly GoogleSheetsOptions _options;

        public GoogleSheetProductRepository(IGoogleSheetsClient client, IOptions<GoogleSheetsOptions> options)
        {
            _client = client;
            _options = options.Value;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            var productRows = await _client.ReadRangeAsync(_options.OrdersSheetId, "Product!A2:I");
            
            var allProducts = new List<Product>();
            var toppingsList = new List<Product>();

            // Column Mapping: 0:Id, 1:Category, 2:Code, 3:Name, 4:Cost, 5:Price, 6:ImageUrl, 7:IsActive, 8:IsToping
            foreach (var row in productRows)
            {
                if (row.Length < 6) continue;

                var idStr = row[0].ToString();
                if (!Guid.TryParse(idStr, out var id)) continue;

                var category = row.Length > 1 ? row[1]?.ToString() ?? string.Empty : string.Empty;
                var code = row.Length > 2 ? row[2]?.ToString() ?? string.Empty : string.Empty;
                var name = row.Length > 3 ? row[3]?.ToString() ?? string.Empty : string.Empty;
                
                decimal.TryParse(row.Length > 4 ? row[4]?.ToString() : "0", NumberStyles.Any, CultureInfo.InvariantCulture, out var cost);
                decimal.TryParse(row.Length > 5 ? row[5]?.ToString() : "0", NumberStyles.Any, CultureInfo.InvariantCulture, out var price);
                
                var imageUrl = row.Length > 6 ? row[6]?.ToString() ?? string.Empty : string.Empty;
                
                bool isActive = row.Length > 7 ? (row[7]?.ToString() == "1" || row[7]?.ToString()?.ToLower() == "true") : true;
                bool isTopping = row.Length > 8 ? (row[8]?.ToString() == "1" || row[8]?.ToString()?.ToLower() == "true") : category.Equals("TOPPING", StringComparison.OrdinalIgnoreCase);

                var product = new Product(id, name, price, isTopping, category, code, cost, imageUrl, isActive);
                
                if (isTopping) toppingsList.Add(product);
                else allProducts.Add(product);
            }

            // Link identifying toppings to all non-topping products
            var finalProducts = allProducts.Select(p => 
                new Product(p.Id, p.Name, p.Price, p.IsTopping, p.Category, p.Code, p.Cost, p.ImageUrl, p.IsActive, toppingsList)
            ).ToList();

            // Return everything (Main products + Topping products standalone)
            return finalProducts.Concat(toppingsList);
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            var categoryRows = await _client.ReadRangeAsync(_options.OrdersSheetId, "Category!A2:B");
            var categories = new List<Category>();

            foreach (var row in categoryRows)
            {
                if (row.Length < 1) continue;
                
                var name = row[0].ToString() ?? string.Empty;
                if (string.IsNullOrEmpty(name)) continue;

                var id = row.Length > 1 && Guid.TryParse(row[1].ToString(), out var parsedId) 
                    ? parsedId 
                    : Guid.NewGuid();

                categories.Add(new Category(id, name));
            }

            return categories;
        }
    }
}
