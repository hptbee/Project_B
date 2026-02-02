using System.Data;
using Dapper;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Infrastructure.Data;

namespace TheCoffeeCream.Infrastructure.Repositories
{
    public class DapperProductRepository : IProductRepository
    {
        private readonly DapperContext _context;

        public DapperProductRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            var query = @"
                SELECT * FROM ""Product"";
                SELECT * FROM ""Category"";
            ";

            using (var connection = _context.CreateConnection())
            using (var multi = await connection.QueryMultipleAsync(query))
            {
                var products = (await multi.ReadAsync<Product>()).ToList();
                var categories = (await multi.ReadAsync<Category>()).ToList();

                var categoryMap = categories.ToDictionary(c => c.Id);
                var productMap = products.ToDictionary(p => p.Id);

                // Populate Category and Toppings
                foreach (var product in products)
                {
                    // Map Category
                    if (product.CategoryId != Guid.Empty && categoryMap.TryGetValue(product.CategoryId, out var category))
                    {
                        product.Category = category;
                    }
                    
                    // Map Toppings via internal list (Reflection)
                    PopulateToppings(product, productMap);
                }

                return products;
            }
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            using (var connection = _context.CreateConnection())
            {
                return await connection.QueryAsync<Category>("SELECT * FROM \"Category\"");
            }
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            var query = @"SELECT * FROM ""Product"" WHERE ""Id"" = @Id::text"; 
            // Cast Guid param to text because column is TEXT but Dapper sends Guid as uuid/text depending on config
            // Better to match types. DB is TEXT. Param is Guid. Dapper might send UUID type. 
            // Explicit cast @Id::text is safest if DB column is TEXT.

            using (var connection = _context.CreateConnection())
            {
                var product = await connection.QuerySingleOrDefaultAsync<Product>(query, new { Id = id });
                
                if (product != null)
                {
                    // Fetch Category
                    if (product.CategoryId != Guid.Empty)
                    {
                        var category = await connection.QuerySingleOrDefaultAsync<Category>(
                            "SELECT * FROM \"Category\" WHERE \"Id\" = @Id::text", new { Id = product.CategoryId });
                        product.Category = category;
                    }

                    // Fetch referenced toppings (optimization: only fetch needed ones)
                    await PopulateToppingsAsync(product, connection);
                }
                
                return product;
            }
        }

        public async Task CreateAsync(Product product)
        {
            var query = @"
                INSERT INTO ""Product"" 
                (""Id"", ""CategoryId"", ""Code"", ""Name"", ""Cost"", ""Price"", ""ImageUrl"", ""IsActive"", ""IsTopping"", ""ToppingMapping"")
                VALUES 
                (@Id::text, @CategoryId::text, @Code, @Name, @Cost, @Price, @ImageUrl, @IsActive, @IsTopping, @ToppingMapping)
            ";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, product);
            }
        }

        public async Task UpdateAsync(Product product)
        {
            var query = @"
                UPDATE ""Product""
                SET 
                    ""CategoryId"" = @CategoryId::text,
                    ""Code"" = @Code,
                    ""Name"" = @Name,
                    ""Cost"" = @Cost,
                    ""Price"" = @Price,
                    ""ImageUrl"" = @ImageUrl,
                    ""IsActive"" = @IsActive,
                    ""IsTopping"" = @IsTopping,
                    ""ToppingMapping"" = @ToppingMapping
                WHERE ""Id"" = @Id::text
            ";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, product);
            }
        }

        public async Task ToggleActiveAsync(Guid id)
        {
            var query = @"UPDATE ""Product"" SET ""IsActive"" = NOT ""IsActive"" WHERE ""Id"" = @Id::text";
            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { Id = id });
            }
        }

        // Helper to populate toppings via Reflection (matching legacy behavior)
        private void PopulateToppings(Product product, Dictionary<Guid, Product> allProducts)
        {
            if (string.IsNullOrEmpty(product.ToppingMapping)) return;

            var toppingIds = product.ToppingMapping.Split(';', StringSplitOptions.RemoveEmptyEntries);
            var toppings = new List<Product>();
            foreach (var idStr in toppingIds)
            {
                if (Guid.TryParse(idStr, out var id) && allProducts.TryGetValue(id, out var topping))
                {
                    toppings.Add(topping);
                }
            }

            SetToppingsList(product, toppings);
        }

        private async Task PopulateToppingsAsync(Product product, IDbConnection connection)
        {
            if (string.IsNullOrEmpty(product.ToppingMapping)) return;

            var toppingIds = product.ToppingMapping.Split(';', StringSplitOptions.RemoveEmptyEntries)
                .Select(idStr => $"'{idStr}'") // Quote for IN clause
                .ToList();
            
            if (!toppingIds.Any()) return;
            
            var idsCsv = string.Join(",", toppingIds);
            // safe enough for internal GUID strings, but parameterizing a list is better with Dapper

            var idGuids = product.ToppingMapping.Split(';', StringSplitOptions.RemoveEmptyEntries);
            
            var query = "SELECT * FROM \"Product\" WHERE \"Id\" = ANY(@Ids::text[])"; 
            // Using Postgres array search

            var toppings = await connection.QueryAsync<Product>(query, new { Ids = idGuids });
            
            SetToppingsList(product, toppings);
        }
        
        private void SetToppingsList(Product product, IEnumerable<Product> toppings)
        {
            var toppingsField = typeof(Product).GetField("_toppings", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            if (toppingsField != null)
            {
                var list = (List<Product>)toppingsField.GetValue(product)!;
                list.Clear();
                list.AddRange(toppings);
            }
        }
    }
}
