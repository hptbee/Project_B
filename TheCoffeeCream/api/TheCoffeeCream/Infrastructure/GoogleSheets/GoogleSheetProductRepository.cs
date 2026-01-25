using System.Globalization;
using Microsoft.Extensions.Options;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Application.Interfaces;

namespace TheCoffeeCream.Infrastructure.GoogleSheets
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
            var productRowsTask = _client.ReadRangeAsync(_options.OrdersSheetId, "Product!A2:J");
            var categoryRowsTask = _client.ReadRangeAsync(_options.OrdersSheetId, "Category!A2:B");

            await Task.WhenAll(productRowsTask, categoryRowsTask);

            var productRows = productRowsTask.Result;
            var categoryRows = categoryRowsTask.Result;

            var categoryMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            if (categoryRows != null)
            {
                foreach (var row in categoryRows)
                {
                    if (row.Length < 1) continue;

                    var col0 = row[0]?.ToString() ?? string.Empty;
                    var col1 = row.Length > 1 ? row[1]?.ToString() ?? string.Empty : string.Empty;

                    string id, name;

                    // Attempt to detect layout: ID, Name vs Name, ID
                    if (Guid.TryParse(col0, out _))
                    {
                        // Col0 is ID
                        id = col0;
                        name = col1;
                    }
                    else
                    {
                        // Col0 is Name
                        name = col0;
                        id = col1;
                    }

                    if (!string.IsNullOrEmpty(id))
                    {
                        categoryMap[id] = name;
                    }
                }
            }

            var allProducts = new List<Product>();
            var toppingsList = new List<Product>();

            // Column Mapping: 0:Id, 1:Category, 2:Code, 3:Name, 4:Cost, 5:Price, 6:ImageUrl, 7:IsActive, 8:IsToping
            foreach (var row in productRows)
            {
                if (row.Length < 6) continue;

                var idStr = row[0].ToString();
                if (!Guid.TryParse(idStr, out var id)) continue;

                var categoryRaw = row.Length > 1 ? row[1]?.ToString() ?? string.Empty : string.Empty;
                var category = categoryMap.TryGetValue(categoryRaw, out var catName) && !string.IsNullOrEmpty(catName) ? catName : categoryRaw;

                var code = row.Length > 2 ? row[2]?.ToString() ?? string.Empty : string.Empty;
                var name = row.Length > 3 ? row[3]?.ToString() ?? string.Empty : string.Empty;

                decimal.TryParse(row.Length > 4 ? row[4]?.ToString() : "0", NumberStyles.Any, CultureInfo.InvariantCulture, out var cost);
                decimal.TryParse(row.Length > 5 ? row[5]?.ToString() : "0", NumberStyles.Any, CultureInfo.InvariantCulture, out var price);

                var imageUrl = row.Length > 6 ? row[6]?.ToString() ?? string.Empty : string.Empty;

                bool isActive = row.Length > 7 ? (row[7]?.ToString() == "1" || row[7]?.ToString()?.ToLower() == "true") : true;
                bool isTopping = row.Length > 8 ? (row[8]?.ToString() == "1" || row[8]?.ToString()?.ToLower() == "true") : category.Equals("TOPPING", StringComparison.OrdinalIgnoreCase);

                var toppingMapping = row.Length > 9 ? row[9]?.ToString() ?? string.Empty : string.Empty;
                var product = new Product(id, name, price, isTopping, category, code, cost, imageUrl, isActive, null, toppingMapping);

                if (isTopping) toppingsList.Add(product);
                else allProducts.Add(product);
            }

            // Link identifying toppings to each non-topping product based on the new ToppingMapping column
            var toppingsById = toppingsList.ToDictionary(t => t.Id);
            var finalProducts = allProducts.Select(p =>
            {
                var toppingsForProduct = new List<Product>();
                if (!string.IsNullOrWhiteSpace(p.ToppingMapping))
                {
                    var parts = p.ToppingMapping.Split(';', StringSplitOptions.RemoveEmptyEntries);
                    foreach (var part in parts)
                    {
                        if (Guid.TryParse(part.Trim(), out var gid) && toppingsById.TryGetValue(gid, out var topping))
                        {
                            toppingsForProduct.Add(topping);
                        }
                    }
                }
                return new Product(p.Id, p.Name, p.Price, p.IsTopping, p.Category, p.Code, p.Cost, p.ImageUrl, p.IsActive, toppingsForProduct, p.ToppingMapping);
            }).ToList();

            // Return everything (Main products + Topping products standalone)
            return finalProducts.Concat(toppingsList);
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            var categoryRows = await _client.ReadRangeAsync(_options.OrdersSheetId, "Category!A2:C");
            var categories = new List<Category>();
            if (categoryRows == null) return categories;

            foreach (var row in categoryRows)
            {
                if (row.Length < 1) continue;

                var col0 = row[0]?.ToString() ?? string.Empty;
                var col1 = row.Length > 1 ? row[1]?.ToString() ?? string.Empty : string.Empty;
                var col2 = row.Length > 2 ? row[2]?.ToString() ?? string.Empty : "0";

                string name = string.Empty;
                Guid id = Guid.Empty;

                if (Guid.TryParse(col0, out var parsedId))
                {
                    // Layout: ID, Name
                    id = parsedId;
                    name = col1;
                }
                else
                {
                    // Layout: Name, ID (or default ID)
                    name = col0;
                    if (!Guid.TryParse(col1, out id))
                    {
                        id = Guid.NewGuid();
                    }
                }

                int.TryParse(col2, NumberStyles.Integer, CultureInfo.InvariantCulture, out var rank);

                if (!string.IsNullOrEmpty(name))
                {
                    categories.Add(new Category(id, name, rank));
                }
            }

            return categories;
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            var all = await GetAllAsync();
            return all.FirstOrDefault(p => p.Id == id);
        }

        public async Task CreateAsync(Product product)
        {
            var row = new object[]
            {
                product.Id.ToString(),
                product.Category,
                product.Code,
                product.Name,
                product.Cost.ToString(CultureInfo.InvariantCulture),
                product.Price.ToString(CultureInfo.InvariantCulture),
                product.ImageUrl,
                product.IsActive ? "1" : "0",
                product.IsTopping ? "1" : "0",
                product.ToppingMapping
            };
            await _client.AppendRowAsync(_options.OrdersSheetId, "Product!A:J", row);
        }

        public async Task UpdateAsync(Product product)
        {
            var rows = await _client.ReadRangeAsync(_options.OrdersSheetId, "Product!A2:J");
            if (rows == null) return;

            for (int i = 0; i < rows.Count; i++)
            {
                if (rows[i].Length > 0 && Guid.TryParse(rows[i][0]?.ToString(), out var rowId) && rowId == product.Id)
                {
                    var row = new object[]
                    {
                        product.Id.ToString(),
                        product.Category,
                        product.Code,
                        product.Name,
                        product.Cost.ToString(CultureInfo.InvariantCulture),
                        product.Price.ToString(CultureInfo.InvariantCulture),
                        product.ImageUrl,
                        product.IsActive ? "1" : "0",
                        product.IsTopping ? "1" : "0",
                        product.ToppingMapping
                    };
                    await _client.UpdateRowAsync(_options.OrdersSheetId, $"Product!A{i + 2}:J{i + 2}", row);
                    break;
                }
            }
        }

        public async Task ToggleActiveAsync(Guid id)
        {
            var product = await GetByIdAsync(id);
            if (product != null)
            {
                product.IsActive = !product.IsActive;
                await UpdateAsync(product);
            }
        }
    }
}
