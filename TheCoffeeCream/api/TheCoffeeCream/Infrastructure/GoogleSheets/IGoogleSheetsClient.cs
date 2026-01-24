using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TheCoffeeCream.Infrastructure.GoogleSheets
{
    public interface IGoogleSheetsClient
    {
        Task AppendRowAsync(string sheetId, string range, object[] row);
        Task AppendRowsAsync(string sheetId, string range, IEnumerable<object[]> rows);
        Task<bool> ExistsByClientOrderIdAsync(string sheetId, Guid clientOrderId);
        Task<IReadOnlyList<object[]>> ReadRangeAsync(string sheetId, string range);
        Task<IList<IList<object>>> ReadSheetAsync(string sheetId, string sheetName);
        Task UpdateRowAsync(string sheetId, string range, object[] row);
        Task DeleteRowsAsync(string sheetId, string sheetName, List<int> rowIndices);
    }
}