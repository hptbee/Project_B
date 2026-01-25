using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Application.Interfaces;

namespace TheCoffeeCream.Infrastructure.GoogleSheets
{
    // Skeleton repository that uses IGoogleSheetsClient and options injected by DI.
    public class GoogleSheetOrderRepository : IOrderRepository
    {
        private readonly IGoogleSheetsClient _client;
        private readonly GoogleSheetsOptions _options;

        public GoogleSheetOrderRepository(IGoogleSheetsClient client, IOptions<GoogleSheetsOptions> options)
        {
            _client = client;
            _options = options.Value;
        }

        public async Task<bool> ExistsByClientOrderIdAsync(Guid clientOrderId)
        {
            return await _client.ExistsByClientOrderIdAsync(_options.OrdersSheetId, clientOrderId);
        }

        public async Task AddAsync(Order order)
        {
            // 1. Check if order exists (by ClientOrderId)
            var existingRows = await _client.ReadSheetAsync(_options.OrdersSheetId, "Order");
            var matchingRowIndices = new List<int>();
            
            // Skip header
            for (int i = 1; i < existingRows.Count; i++)
            {
                var er = existingRows[i];
                if (er != null && er.Count > 1 && string.Equals(er[1]?.ToString()?.Trim(), order.ClientOrderId.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    matchingRowIndices.Add(i + 1); // 1-indexed for Google Sheets row numbers
                }
            }

            // Columns: Id, ClientOrderId, CreatedAt, OrderType, TableNumber, PaymentMethod, CashAmount, TransferAmount, DiscountType, DiscountValue, DiscountAmount, SubTotal, Total, Status, Note
            var orderRow = new object[]
            {
                order.Id.ToString(),
                order.ClientOrderId.ToString(),
                order.CreatedAt.ToString("o"),
                order.OrderType.ToString(),
                order.TableNumber?.ToString() ?? string.Empty,
                order.PaymentMethod.ToString(),
                order.CashAmount.ToString(CultureInfo.InvariantCulture),
                order.TransferAmount.ToString(CultureInfo.InvariantCulture),
                order.DiscountType?.ToString() ?? string.Empty,
                order.DiscountValue.ToString(CultureInfo.InvariantCulture),
                order.DiscountAmount.ToString(CultureInfo.InvariantCulture),
                order.SubTotal.ToString(CultureInfo.InvariantCulture),
                order.Total.ToString(CultureInfo.InvariantCulture),
                order.Status.ToString(),
                order.Note ?? string.Empty,
                order.IsActive ? "1" : "0"
            };

            if (matchingRowIndices.Any())
            {
                // Update the LAST match (most likely the most recent/valid one if appended sequentially)
                // OR Update the FIRST match and delete others? 
                // Updating the first match keeps the row position stable.
                int targetRowIndex = matchingRowIndices[0];
                
                // If we have duplicates, we might want to consolidate. Use the ID from the existing row if we want strict stability,
                // but OrderService might have passed a new ID if it didn't find it.
                // We will overwrite with order.Id regardless.

                // Retrieve old ID from that row to clear its items
                var oldIdStr = GetRowValue(existingRows[targetRowIndex - 1], 0); // index in list is 0-based
                if (Guid.TryParse(oldIdStr, out var oldId))
                {
                    await ClearOrderItemsAsync(oldId);
                }
                
                // If there are duplicates, delete them.
                if (matchingRowIndices.Count > 1) 
                {
                    // Identify other rows
                    var rowsToDelete = matchingRowIndices.Skip(1).OrderByDescending(r => r).ToList(); 
                    
                    // Also clear items for these duplicate orders
                    foreach(var delIndex in rowsToDelete)
                    {
                        var dupIdStr = GetRowValue(existingRows[delIndex - 1], 0);
                        if (Guid.TryParse(dupIdStr, out var dupId))
                        {
                            await ClearOrderItemsAsync(dupId);
                        }
                    }

                    // Delete the duplicate rows
                    await _client.DeleteRowsAsync(_options.OrdersSheetId, "Order", rowsToDelete);
                    
                    // Adjust targetRowIndex? If we delete rows BELOW target, target is safe.
                    // If we delete rows ABOVE target, target shifts.
                    // We sorted descending, so we delete from bottom up. 
                    // But wait, if target is index 0 (first match), and others are > 0. 
                    // We skip(1), so we keep the first one. All deletes are below it. Safe.
                }

                // Update existing order row
                await _client.UpdateRowAsync(_options.OrdersSheetId, $"Order!A{targetRowIndex}:P{targetRowIndex}", orderRow);
                
                if (order.Id != oldId)
                {
                     // If we changed ID, ensure items are cleared for new ID too (just in case)
                     await ClearOrderItemsAsync(order.Id);
                }
            }
            else
            {
                // Append new order row
                await _client.AppendRowAsync(_options.OrdersSheetId, "Order", orderRow);
            }

            // 2. Append to OrderItem sheet
            // Columns: OrderId, ProductId, Name, UnitPrice, Quantity, DiscountType, DiscountValue, DiscountAmount, Total, Toppings, Note
            var itemRows = order.Items.Select(item =>
            {
                // Follow the image: OrderId, ProductId, Name, UnitPrice, Quantity, DiscountType, DiscountValue, DiscountAmount, Total, Note, IsActive
                // NOTE: Toppings are not in the new 11-column structure image, but we can append them to Name if needed.
                // For now, following image structure exactly.
                return new object[]
                {
                    order.Id.ToString(), // FK to Order
                    item.ProductId.ToString(),
                    item.Name,
                    item.UnitPrice.ToString(CultureInfo.InvariantCulture),
                    item.Quantity.ToString(),
                    item.DiscountType?.ToString() ?? string.Empty,
                    item.DiscountValue.ToString(CultureInfo.InvariantCulture),
                    item.DiscountAmount.ToString(CultureInfo.InvariantCulture),
                    item.Total.ToString(CultureInfo.InvariantCulture),
                    item.Note ?? string.Empty,
                    item.IsActive ? "1" : "0"
                };
            }).ToList();

            await _client.AppendRowsAsync(_options.OrdersSheetId, "OrderItem", itemRows);
        }

        private async Task ClearOrderItemsAsync(Guid orderId)
        {
            var itemRows = await _client.ReadSheetAsync(_options.OrdersSheetId, "OrderItem");
            var rowsToDelete = new List<int>();

            // Skip header
            for (int i = 1; i < itemRows.Count; i++)
            {
                var ir = itemRows[i];
                if (ir != null && ir.Count > 0 && string.Equals(ir[0]?.ToString()?.Trim(), orderId.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    rowsToDelete.Add(i + 1); // 1-indexed for Google Sheets row numbers
                }
            }

            if (rowsToDelete.Any())
            {
                // Optimizing delete: Delete in batches or use a smart delete if _client supports it. 
                // Assuming DeleteRowsAsync handles list of indices.
                // Sort descending to avoid index shifting problems during delete loop in client
                rowsToDelete.Sort((a, b) => b.CompareTo(a));
                await _client.DeleteRowsAsync(_options.OrdersSheetId, "OrderItem", rowsToDelete);
            }
        }

        public async Task<Order?> GetByClientOrderIdAsync(Guid clientOrderId)
        {
            // For now, scan all orders. In Google Sheets this is slow but we don't have indexes.
            var allOrders = await FetchOrdersAsync(null, null);
            return allOrders.LastOrDefault(o => o.ClientOrderId == clientOrderId);
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            return await FetchOrdersAsync(startDate, endDate);
        }

        public async Task<Order?> GetByIdAsync(Guid id)
        {
            var allOrders = await FetchOrdersAsync(null, null);
            return allOrders.FirstOrDefault(o => o.Id == id);
        }

        private string GetRowValue(IList<object>? row, int index, string defaultValue = "")
        {
            if (row == null) return defaultValue;
            return row.Count > index ? row[index]?.ToString() ?? defaultValue : defaultValue;
        }

        private async Task<IEnumerable<Order>> FetchOrdersAsync(DateTimeOffset? startDate, DateTimeOffset? endDate)
        {
            // Read all orders from sheet
            var orderRows = await _client.ReadSheetAsync(_options.OrdersSheetId, "Order");
            var itemRows = await _client.ReadSheetAsync(_options.OrdersSheetId, "OrderItem");

            var orders = new List<Order>();

            // Skip header row
            foreach (var row in orderRows.Skip(1))
            {
                if (row == null || row.Count < 2) continue; // Must have at least Id and ClientOrderId

                var orderIdStr = GetRowValue(row, 0);
                if (!Guid.TryParse(orderIdStr, out var orderId)) continue;

                var createdAtStr = GetRowValue(row, 2);
                if (!DateTimeOffset.TryParse(createdAtStr, out var createdAt)) continue;

                // Filter by date range if provided
                if (startDate.HasValue && createdAt.UtcDateTime < startDate.Value.UtcDateTime) continue;
                if (endDate.HasValue && createdAt.UtcDateTime > endDate.Value.UtcDateTime) continue;

                var clientOrderIdStr = GetRowValue(row, 1);
                if (!Guid.TryParse(clientOrderIdStr, out var clientOrderId)) continue;

                var orderTypeStr = GetRowValue(row, 3, "DINE_IN");
                var orderType = Enum.TryParse<OrderType>(orderTypeStr, true, out var ot) ? ot : OrderType.DINE_IN;

                var tableNumberStr = GetRowValue(row, 4);
                var tableNumber = string.IsNullOrEmpty(tableNumberStr) ? (int?)null : int.Parse(tableNumberStr);

                var paymentMethodStr = GetRowValue(row, 5, "CASH");
                var paymentMethod = Enum.TryParse<PaymentMethod>(paymentMethodStr, true, out var pm) ? pm : PaymentMethod.CASH;

                var cashAmountStr = GetRowValue(row, 6, "0");
                var cashAmount = decimal.Parse(cashAmountStr, CultureInfo.InvariantCulture);

                var transferAmountStr = GetRowValue(row, 7, "0");
                var transferAmount = decimal.Parse(transferAmountStr, CultureInfo.InvariantCulture);

                var discountTypeStr = GetRowValue(row, 8);
                var discountType = string.IsNullOrEmpty(discountTypeStr) ? (DiscountType?)null : Enum.Parse<DiscountType>(discountTypeStr);

                var discountValueStr = GetRowValue(row, 9, "0");
                var discountValue = decimal.Parse(discountValueStr, CultureInfo.InvariantCulture);

                var statusStr = GetRowValue(row, 13, "SUCCESS");
                var status = Enum.TryParse<OrderStatus>(statusStr, true, out var os) ? os : OrderStatus.SUCCESS;

                var note = GetRowValue(row, 14);
                var isActive = GetRowValue(row, 15, "1") == "1";

                // Get items for this order
                var orderItems = new List<OrderItem>();
                foreach (var ir in itemRows.Skip(1))
                {
                    if (ir == null || ir.Count == 0) continue;
                    if (GetRowValue(ir, 0) != orderId.ToString()) continue;

                    var productIdStr = GetRowValue(ir, 1);
                    var productId = Guid.TryParse(productIdStr, out var pid) ? pid : Guid.Empty;
                    var itemName = GetRowValue(ir, 2);
                    var unitPriceStr = GetRowValue(ir, 3, "0");
                    var unitPrice = decimal.Parse(unitPriceStr, CultureInfo.InvariantCulture);
                    var quantityStr = GetRowValue(ir, 4, "1");
                    var quantity = int.Parse(quantityStr);

                    var itemDiscountTypeStr = GetRowValue(ir, 5);
                    var itemDiscountType = string.IsNullOrEmpty(itemDiscountTypeStr) ? (DiscountType?)null : Enum.Parse<DiscountType>(itemDiscountTypeStr);

                    var itemDiscountValueStr = GetRowValue(ir, 6, "0");
                    var itemDiscountValue = decimal.Parse(itemDiscountValueStr, CultureInfo.InvariantCulture);

                    // Note is now column 9 (index 9) and IsActive is column 10 (index 10)
                    var itemNote = GetRowValue(ir, 9);
                    var itemIsActive = GetRowValue(ir, 10, "1") == "1";

                    var item = new OrderItem(productId, itemName, unitPrice, quantity, null, itemDiscountType, itemDiscountValue, itemNote);
                    item.IsActive = itemIsActive;
                    orderItems.Add(item);
                }

                // Use reflection to create Order with private setters (keeping this for now, though properties are public now)
                var order = new Order(clientOrderId, orderType, orderItems, tableNumber, paymentMethod, cashAmount, transferAmount, discountType, discountValue, status, note, orderId);
                order.CreatedAt = createdAt;
                order.IsActive = isActive;

                orders.Add(order);
            }
            
            // Deduplicate: Keep only the latest entry for each ClientOrderId
            // Group by ClientOrderId and take the Last one (assuming chronological order in sheet, or logic above works)
            return orders
                .GroupBy(o => o.ClientOrderId)
                .Select(g => g.Last()) // Prefer Last as it's likely the latest appended
                .ToList();
        }

        public async Task UpdateAsync(Order order)
        {
            await AddAsync(order); // AddAsync already handles update if rowIndex != -1
        }

        public async Task ToggleActiveAsync(Guid id)
        {
            var order = await GetByIdAsync(id);
            if (order != null)
            {
                order.IsActive = !order.IsActive;
                await UpdateAsync(order);
            }
        }
    }
}
