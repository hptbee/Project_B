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
            int rowIndex = -1;
            // Skip header
            for (int i = 1; i < existingRows.Count; i++)
            {
                var er = existingRows[i];
                if (er != null && er.Count > 1 && string.Equals(er[1]?.ToString()?.Trim(), order.ClientOrderId.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    rowIndex = i + 1; // Google Sheets is 1-indexed
                    break;
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
                order.Note ?? string.Empty
            };

            if (rowIndex != -1)
            {
                // Update existing order row
                await _client.UpdateRowAsync(_options.OrdersSheetId, $"Order!A{rowIndex}:O{rowIndex}", orderRow);
                // Clear existing items for this order to avoid duplicates (simpler than updating individually)
                await ClearOrderItemsAsync(order.Id);
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
                var toppingsStr = string.Join(", ", item.SelectedToppings.Select(t => t.Name));
                return new object[]
                {
                    order.Id.ToString(),
                    item.ProductId.ToString(),
                    item.Name,
                    item.UnitPrice.ToString(CultureInfo.InvariantCulture),
                    item.Quantity.ToString(),
                    item.DiscountType?.ToString() ?? string.Empty,
                    item.DiscountValue.ToString(CultureInfo.InvariantCulture),
                    item.DiscountAmount.ToString(CultureInfo.InvariantCulture),
                    item.Total.ToString(CultureInfo.InvariantCulture),
                    toppingsStr,
                    item.Note ?? string.Empty
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

        private string GetRowValue(IList<object> row, int index, string defaultValue = "")
        {
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
                if (startDate.HasValue && createdAt < startDate.Value) continue;
                if (endDate.HasValue && createdAt > endDate.Value) continue;

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

                // Get items for this order
                var orderItems = itemRows.Skip(1)
                    .Where(ir => ir != null && ir.Count > 0 && GetRowValue(ir, 0) == orderId.ToString())
                    .Select(ir =>
                    {
                        var r = ir!;
                        var productIdStr = GetRowValue(r, 1);
                        var productId = Guid.TryParse(productIdStr, out var pid) ? pid : Guid.Empty;
                        var itemName = GetRowValue(r, 2);
                        var unitPriceStr = GetRowValue(r, 3, "0");
                        var unitPrice = decimal.Parse(unitPriceStr, CultureInfo.InvariantCulture);
                        var quantityStr = GetRowValue(r, 4, "1");
                        var quantity = int.Parse(quantityStr);

                        var itemDiscountTypeStr = GetRowValue(r, 5);
                        var itemDiscountType = string.IsNullOrEmpty(itemDiscountTypeStr) ? (DiscountType?)null : Enum.Parse<DiscountType>(itemDiscountTypeStr);

                        var itemDiscountValueStr = GetRowValue(r, 6, "0");
                        var itemDiscountValue = decimal.Parse(itemDiscountValueStr, CultureInfo.InvariantCulture);

                        var itemNote = GetRowValue(r, 10);

                        // Parse toppings if any
                        List<OrderItemTopping>? toppings = null;
                        var toppingsStr = GetRowValue(r, 9);
                        if (!string.IsNullOrEmpty(toppingsStr))
                        {
                            toppings = toppingsStr.Split(',')
                                .Select(s => s.Trim())
                                .Where(s => !string.IsNullOrEmpty(s))
                                .Select(name => new OrderItemTopping(Guid.NewGuid(), name, 0)) // Using NewGuid as dummy for reconstruction
                                .ToList();
                        }

                        return new OrderItem(productId, itemName, unitPrice, quantity, toppings, itemDiscountType, itemDiscountValue, itemNote);
                    }).ToList();

                // Use reflection to create Order with private setters
                var order = (Order)Activator.CreateInstance(typeof(Order), true)!;
                typeof(Order).GetProperty("Id").SetValue(order, orderId);
                typeof(Order).GetProperty("ClientOrderId").SetValue(order, clientOrderId);
                typeof(Order).GetProperty("CreatedAt").SetValue(order, createdAt);
                typeof(Order).GetProperty("OrderType").SetValue(order, orderType);
                typeof(Order).GetProperty("TableNumber").SetValue(order, tableNumber);
                typeof(Order).GetProperty("PaymentMethod").SetValue(order, paymentMethod);
                typeof(Order).GetProperty("CashAmount").SetValue(order, cashAmount);
                typeof(Order).GetProperty("TransferAmount").SetValue(order, transferAmount);
                typeof(Order).GetProperty("DiscountType").SetValue(order, discountType);
                typeof(Order).GetProperty("DiscountValue").SetValue(order, discountValue);
                typeof(Order).GetProperty("Status").SetValue(order, status);
                typeof(Order).GetProperty("Note").SetValue(order, note);

                // Set items using reflection
                var itemsField = typeof(Order).GetField("_items", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)!;
                itemsField.SetValue(order, orderItems);

                orders.Add(order);
            }

            return orders;
        }
    }
}
