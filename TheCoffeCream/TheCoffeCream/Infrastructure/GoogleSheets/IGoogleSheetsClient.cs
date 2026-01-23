using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TheCoffeCream.Infrastructure.GoogleSheets
{
    public interface IGoogleSheetsClient
    {
        Task AppendRowAsync(string sheetId, string range, object[] row);
        Task<bool> ExistsByClientOrderIdAsync(string sheetId, Guid clientOrderId);
        Task<IReadOnlyList<object[]>> ReadRangeAsync(string sheetId, string range);
        Task<IList<IList<object>>> ReadSheetAsync(string sheetId, string sheetName);
    }
}