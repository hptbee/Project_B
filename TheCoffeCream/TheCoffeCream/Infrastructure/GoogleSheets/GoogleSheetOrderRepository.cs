using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using TheCoffeCream.Domain.Entities;
using TheCoffeCream.Application.Interfaces;

namespace TheCoffeCream.Infrastructure.GoogleSheets
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
            // 1. Append to Order sheet
            // Columns: Id, ClientOrderId, CreatedAt, OrderType, TableNumber, PaymentMethod, CashAmount, TransferAmount, DiscountType, DiscountValue, DiscountAmount, SubTotal, Total
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
                order.Total.ToString(CultureInfo.InvariantCulture)
            };

            await _client.AppendRowAsync(_options.OrdersSheetId, "Order", orderRow);

            // 2. Append to OrderItem sheet
            // Columns: OrderId, ProductId, Name, UnitPrice, Quantity, DiscountType, DiscountValue, DiscountAmount, Total, Toppings
            foreach (var item in order.Items)
            {
                var toppingsStr = string.Join(", ", item.SelectedToppings.Select(t => t.Name));
                
                var itemRow = new object[]
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
                    toppingsStr
                };

                await _client.AppendRowAsync(_options.OrdersSheetId, "OrderItem", itemRow); 
            }
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            // Read all orders from sheet
            var orderRows = await _client.ReadSheetAsync(_options.OrdersSheetId, "Order");
            var itemRows = await _client.ReadSheetAsync(_options.OrdersSheetId, "OrderItem");

            var orders = new List<Order>();

            // Skip header row
            foreach (var row in orderRows.Skip(1))
            {
                if (row.Count < 13) continue; // Need all columns

                var orderId = Guid.Parse(row[0].ToString());
                var createdAt = DateTimeOffset.Parse(row[2].ToString());

                // Filter by date range
                if (createdAt < startDate || createdAt > endDate) continue;

                var clientOrderId = Guid.Parse(row[1].ToString());
                var orderType = Enum.Parse<OrderType>(row[3].ToString());
                var tableNumber = string.IsNullOrEmpty(row[4].ToString()) ? (int?)null : int.Parse(row[4].ToString());
                var paymentMethod = Enum.Parse<PaymentMethod>(row[5].ToString());
                var cashAmount = decimal.Parse(row[6].ToString(), CultureInfo.InvariantCulture);
                var transferAmount = decimal.Parse(row[7].ToString(), CultureInfo.InvariantCulture);
                var discountType = string.IsNullOrEmpty(row[8].ToString()) ? (DiscountType?)null : Enum.Parse<DiscountType>(row[8].ToString());
                var discountValue = decimal.Parse(row[9].ToString(), CultureInfo.InvariantCulture);

                // Get items for this order
                var orderItems = itemRows.Skip(1)
                    .Where(ir => ir.Count >= 10 && ir[0].ToString() == orderId.ToString())
                    .Select(ir =>
                    {
                        var productId = Guid.Parse(ir[1].ToString());
                        var name = ir[2].ToString();
                        var unitPrice = decimal.Parse(ir[3].ToString(), CultureInfo.InvariantCulture);
                        var quantity = int.Parse(ir[4].ToString());
                        var itemDiscountType = string.IsNullOrEmpty(ir[5].ToString()) ? (DiscountType?)null : Enum.Parse<DiscountType>(ir[5].ToString());
                        var itemDiscountValue = decimal.Parse(ir[6].ToString(), CultureInfo.InvariantCulture);

                        // Parse toppings if any
                        List<OrderItemTopping>? toppings = null;
                        if (ir.Count > 9 && !string.IsNullOrEmpty(ir[9].ToString()))
                        {
                            // Toppings are comma-separated names - we can't reconstruct full topping objects
                            // For reporting purposes, we'll skip topping details
                            toppings = new List<OrderItemTopping>();
                        }

                        return new OrderItem(productId, name, unitPrice, quantity, toppings, itemDiscountType, itemDiscountValue);
                    }).ToList();

                // Use reflection to create Order with private setters
                var order = (Order)Activator.CreateInstance(typeof(Order), true);
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

                // Set items using reflection
                var itemsField = typeof(Order).GetField("_items", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                itemsField.SetValue(order, orderItems);

                orders.Add(order);
            }

            return orders;
        }
    }
}
