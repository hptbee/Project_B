using System.Data;
using Dapper;
using TheCoffeeCream.Application.Interfaces;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Infrastructure.Data;

namespace TheCoffeeCream.Infrastructure.Repositories
{
    public class DapperOrderRepository : IOrderRepository
    {
        private readonly DapperContext _context;

        public DapperOrderRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Order order)
        {
            using (var connection = _context.CreateConnection())
            {
                connection.Open();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        var orderQuery = @"
                            INSERT INTO ""Order"" 
                            (""Id"", ""ClientOrderId"", ""CreatedAt"", ""OrderType"", ""TableNumber"", ""PaymentMethod"", ""CashAmount"", ""TransferAmount"", ""DiscountType"", ""DiscountValue"", ""Status"", ""Note"", ""IsActive"")
                            VALUES 
                            (@Id::text, @ClientOrderId::text, @CreatedAt, @OrderType, @TableNumber, @PaymentMethod, @CashAmount, @TransferAmount, @DiscountType, @DiscountValue, @Status, @Note, @IsActive)
                        ";
                        
                        await connection.ExecuteAsync(orderQuery, order, transaction: transaction);

                        var itemQuery = @"
                            INSERT INTO ""OrderItem""
                            (""Id"", ""OrderId"", ""ProductId"", ""Name"", ""UnitPrice"", ""Quantity"", ""DiscountType"", ""DiscountValue"", ""DiscountAmount"", ""Total"", ""Note"", ""IsActive"")
                            VALUES
                            (@Id, @OrderId::text, @ProductId::text, @Name, @UnitPrice, @Quantity, @DiscountType, @DiscountValue, @DiscountAmount, @Total, @Note, @IsActive)
                        ";

                        foreach (var item in order.Items)
                        {
                            // Ensure FK and PK are set
                            item.OrderId = order.Id;
                            if (item.Id == Guid.Empty) item.Id = Guid.NewGuid();

                            // DiscountType Enum is handled by registered TypeHandler automatically
                            await connection.ExecuteAsync(itemQuery, item, transaction: transaction);
                        }

                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        public async Task<bool> ExistsByClientOrderIdAsync(Guid clientOrderId)
        {
            var query = "SELECT COUNT(1) FROM \"Order\" WHERE \"ClientOrderId\" = @ClientOrderId::text";
            using (var connection = _context.CreateConnection())
            {
                return await connection.ExecuteScalarAsync<bool>(query, new { ClientOrderId = clientOrderId });
            }
        }

        public async Task<Order?> GetByClientOrderIdAsync(Guid clientOrderId)
        {
            var query = @"SELECT * FROM ""Order"" WHERE ""ClientOrderId"" = @ClientOrderId::text";
            return await GetOrderWithItemsAsync(query, new { ClientOrderId = clientOrderId });
        }

        public async Task<Order?> GetByIdAsync(Guid id)
        {
             var query = @"SELECT * FROM ""Order"" WHERE ""Id"" = @Id::text";
             return await GetOrderWithItemsAsync(query, new { Id = id });
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            var query = @"
                SELECT * FROM ""Order"" 
                WHERE ""CreatedAt"" >= @StartDate AND ""CreatedAt"" <= @EndDate
                ORDER BY ""CreatedAt"" DESC
            ";
            
            using (var connection = _context.CreateConnection())
            {
                var orders = await connection.QueryAsync<Order>(query, new { StartDate = startDate.ToString("O"), EndDate = endDate.ToString("O") });
                var orderList = orders.ToList();
                
                if (orderList.Any())
                {
                    var orderIds = orderList.Select(o => o.Id.ToString()).ToArray();
                    var itemsQuery = "SELECT * FROM \"OrderItem\" WHERE \"OrderId\" = ANY(@OrderIds)";
                    
                    var allItems = await connection.QueryAsync<OrderItem>(itemsQuery, new { OrderIds = orderIds });
                    var itemsList = allItems.ToList();
                    
                    foreach (var order in orderList)
                    {
                        var itemsForOrder = itemsList.Where(i => i.OrderId == order.Id).ToList();
                        SetOrderItems(order, itemsForOrder);
                    }
                }
                
                return orderList;
            }
        }

        public async Task ToggleActiveAsync(Guid id)
        {
             var query = @"UPDATE ""Order"" SET ""IsActive"" = NOT ""IsActive"" WHERE ""Id"" = @Id::text";
             using (var connection = _context.CreateConnection())
             {
                 await connection.ExecuteAsync(query, new { Id = id });
             }
        }

        public async Task UpdateAsync(Order order)
        {
             var query = @"
                UPDATE ""Order""
                SET 
                    ""ClientOrderId"" = @ClientOrderId::text,
                    ""OrderType"" = @OrderType, 
                    ""TableNumber"" = @TableNumber,
                    ""PaymentMethod"" = @PaymentMethod,
                    ""CashAmount"" = @CashAmount,
                    ""TransferAmount"" = @TransferAmount,
                    ""DiscountType"" = @DiscountType,
                    ""DiscountValue"" = @DiscountValue,
                    ""Status"" = @Status,
                    ""Note"" = @Note,
                    ""IsActive"" = @IsActive
                WHERE ""Id"" = @Id::text
            ";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, order);
            }
        }

        private async Task<Order?> GetOrderWithItemsAsync(string sql, object param)
        {
            using (var connection = _context.CreateConnection())
            {
                var order = await connection.QuerySingleOrDefaultAsync<Order>(sql, param);
                if (order != null)
                {
                     var itemsQuery = "SELECT * FROM \"OrderItem\" WHERE \"OrderId\" = @OrderId::text";
                     var items = await connection.QueryAsync<OrderItem>(itemsQuery, new { OrderId = order.Id });
                     SetOrderItems(order, items);
                }
                return order;
            }
        }

        private void SetOrderItems(Order order, IEnumerable<OrderItem> items)
        {
            var itemsField = typeof(Order).GetField("_items", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            if (itemsField != null)
            {
                var list = (List<OrderItem>)itemsField.GetValue(order)!;
                list.Clear();
                list.AddRange(items);
            }
        }
    }
}
