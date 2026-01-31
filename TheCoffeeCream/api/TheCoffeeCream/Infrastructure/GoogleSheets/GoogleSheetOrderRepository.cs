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
                order.SubTotal.ToString(CultureInfo.InvariantCulture), // 10: Swapped to match "SubTotal" header
                order.DiscountAmount.ToString(CultureInfo.InvariantCulture), // 11: Swapped to match "DiscountAmount" header
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
            // New 14-Col Structure:
            // 0:Id, 1:OrderId, 2:CreatedAt, 3:ProductId, 4:Name, 5:UnitPrice, 6:Quantity, 7:DiscType, 8:DiscVal, 9:DiscAmt, 10:Total, 11:Toppings, 12:Note, 13:IsActive
            var itemRows = order.Items.Select(item =>
            {
                var toppingsStr = item.SelectedToppings != null && item.SelectedToppings.Any()
                    ? string.Join(";", item.SelectedToppings.Select(t => $"{t.Name}|{t.Code}|{t.Price.ToString(CultureInfo.InvariantCulture)}|{t.ProductId}"))
                    : string.Empty;

                return new object[]
                {
                    (item.Id == Guid.Empty ? Guid.NewGuid() : item.Id).ToString(),
                    order.Id.ToString(), // FK
                    item.CreatedAt.ToString("o"),
                    item.ProductId.ToString(),
                    item.Name,
                    item.UnitPrice.ToString(CultureInfo.InvariantCulture),
                    item.Quantity.ToString(),
                    item.DiscountType?.ToString() ?? string.Empty,
                    item.DiscountValue.ToString(CultureInfo.InvariantCulture),
                    item.DiscountAmount.ToString(CultureInfo.InvariantCulture),
                    item.Total.ToString(CultureInfo.InvariantCulture),
                    toppingsStr,
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
                if (ir == null || ir.Count == 0) continue;

                // Check Old Format (Col 0 = OrderId) vs New Format (Col 1 = OrderId)
                // Heuristic: Check Col 3. 
                // Old: Col 3 = UnitPrice (Number)
                // New: Col 3 = ProductId (Guid)
                
                string rowOrderId = string.Empty;
                bool isNewFormat = false;
                
                if (ir.Count > 3 && Guid.TryParse(GetRowValue(ir, 3), out _))
                {
                    // Likely new format
                    rowOrderId = GetRowValue(ir, 1); // OrderId is Col 1
                    isNewFormat = true;
                }
                else
                {
                    // Likely old format
                    rowOrderId = GetRowValue(ir, 0); // OrderId is Col 0
                }

                if (string.Equals(rowOrderId, orderId.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    rowsToDelete.Add(i + 1); 
                }
            }

            if (rowsToDelete.Any())
            {
                rowsToDelete.Sort((a, b) => b.CompareTo(a));
                await _client.DeleteRowsAsync(_options.OrdersSheetId, "OrderItem", rowsToDelete);
            }
        }

        public async Task<Order?> GetByClientOrderIdAsync(Guid clientOrderId)
        {
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

                    // Detect Format
                    // Update ClearOrderItemsAsync logic above to match
                    
                    bool isNewFormat = false; // 14 Cols
                    
                    // Check Col 3 (Index 3). New Format: Col 3 is ProductId (Guid). Old Format: Col 3 is UnitPrice (Number).
                    if (ir.Count > 3 && Guid.TryParse(GetRowValue(ir, 3), out _))
                    {
                        isNewFormat = true;
                    }

                    // Map fields based on format
                    string fkOrderIdStr;
                    Guid itemId = Guid.Empty;
                    DateTimeOffset itemCreatedAt = DateTimeOffset.MinValue;
                    int idx_prodId, idx_name, idx_uPrice, idx_qty, idx_discType, idx_discVal, idx_toppings, idx_note, idx_active;

                    if (isNewFormat)
                    {
                        // 0:Id, 1:OrderId, 2:CreatedAt, 3:ProductId, 4:Name, 5:UnitPrice, 6:Quantity, ...
                        Guid.TryParse(GetRowValue(ir, 0), out itemId);
                        fkOrderIdStr = GetRowValue(ir, 1);
                        DateTimeOffset.TryParse(GetRowValue(ir, 2), out itemCreatedAt);
                        idx_prodId = 3; 
                        idx_name = 4;
                        idx_uPrice = 5;
                        idx_qty = 6;
                        idx_discType = 7;
                        idx_discVal = 8;
                        // 9: DiscAmt, 10: Total - skipped derived
                        idx_toppings = 11;
                        idx_note = 12;
                        idx_active = 13;
                    }
                    else
                    {
                        // 0:OrderId, 1:ProductId, 2:Name, 3:UnitPrice, 4:Qty, ...
                        fkOrderIdStr = GetRowValue(ir, 0);
                        idx_prodId = 1;
                        idx_name = 2;
                        idx_uPrice = 3;
                        idx_qty = 4;
                        idx_discType = 5;
                        idx_discVal = 6;
                        // 7: DiscAmt, 8: Total
                        idx_toppings = 9; // In 11/12 col format
                        idx_note = 10;
                        idx_active = 11;

                        // Heuristic for old 12 col or 11 col:
                        // 12 Col: 9:Toppings, 10:Note, 11:Active
                        // 11 Col: 9:Note, 10:Active
                        // Since new format detection relies on Col 3, we fall here for standard old.
                        // Check if Col 9 looks like toppings or Note
                        // Toppings usually has '|' or is empty. Note is text.
                        // But wait, step 434 logic handled 11/12 distinction.
                        // If ir.Count >= 12, standard 12 col.
                        if (ir.Count < 12)
                        {
                           // 11 Col fallback: 9=Note, 10=Active
                           idx_toppings = -1; // No toppings col
                           idx_note = 9;
                           idx_active = 10;
                        }
                    }

                    if (!string.Equals(fkOrderIdStr, orderId.ToString(), StringComparison.OrdinalIgnoreCase)) continue;

                    var productIdStr = GetRowValue(ir, idx_prodId);
                    var productId = Guid.TryParse(productIdStr, out var pid) ? pid : Guid.Empty;
                    var itemName = GetRowValue(ir, idx_name);
                    
                    var unitPriceStr = GetRowValue(ir, idx_uPrice, "0");
                    var unitPrice = decimal.TryParse(unitPriceStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var up) ? up : 0;
                    
                    var quantityStr = GetRowValue(ir, idx_qty, "1");
                    var quantity = int.TryParse(quantityStr, out var iq) ? iq : 1;
                    
                    var itemDiscTypeStr = GetRowValue(ir, idx_discType);
                    var itemDiscountType = string.IsNullOrEmpty(itemDiscTypeStr) ? (DiscountType?)null :
                        (Enum.TryParse<DiscountType>(itemDiscTypeStr, true, out var idt) ? idt : (DiscountType?)null);

                    var itemDiscountValueStr = GetRowValue(ir, idx_discVal, "0");
                    var itemDiscountValue = decimal.Parse(itemDiscountValueStr, CultureInfo.InvariantCulture);
                    
                    string toppingsStr = idx_toppings >= 0 ? GetRowValue(ir, idx_toppings) : string.Empty;
                    string itemNote = GetRowValue(ir, idx_note);
                    bool itemIsActive = GetRowValue(ir, idx_active, "1") == "1";

                    var selectedToppings = new List<OrderItemTopping>();
                    if (!string.IsNullOrEmpty(toppingsStr))
                    {
                        var parts = toppingsStr.Split(';', StringSplitOptions.RemoveEmptyEntries);
                        foreach (var part in parts)
                        {
                            var subParts = part.Split('|');
                            if (subParts.Length >= 3)
                            {
                                var tName = subParts[0];
                                var tCode = subParts[1];
                                var tPrice = decimal.TryParse(subParts[2], NumberStyles.Any, CultureInfo.InvariantCulture, out var tp) ? tp : 0;
                                var tId = subParts.Length >= 4 && Guid.TryParse(subParts[3], out var tid) ? tid : Guid.Empty;
                                
                                if (tId != Guid.Empty)
                                {
                                    selectedToppings.Add(new OrderItemTopping(tId, tName, tPrice, tCode));
                                }
                            }
                        }
                    }

                    var item = new OrderItem(productId, itemName, unitPrice, quantity, selectedToppings, itemDiscountType, itemDiscountValue, itemNote);
                    item.IsActive = itemIsActive;
                    if (itemId != Guid.Empty) item.Id = itemId;
                    if (itemCreatedAt != DateTimeOffset.MinValue) item.CreatedAt = itemCreatedAt;
                    
                    orderItems.Add(item);
                }

                if (!orderItems.Any())
                {
                    // Skip orders without items to avoid crash in domain constructor
                    // This can happen if an order was partially written or corrupted in sheet
                    continue;
                }

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
