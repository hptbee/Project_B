using System;
using System.Threading.Tasks;
using TheCoffeCream.Domain.Entities;
using TheCoffeCream.Application.Interfaces;

namespace TheCoffeCream.Infrastructure.GoogleSheets
{
    // Skeleton implementation - replace TODOs with Google Sheets API integration
    public class GoogleSheetOrderRepository : IOrderRepository
    {
        private readonly string _sheetId;

        public GoogleSheetOrderRepository(string sheetId)
        {
            _sheetId = sheetId ?? throw new ArgumentNullException(nameof(sheetId));
        }

        public Task AddAsync(Order order)
        {
            // TODO: Append order to Google Sheet. Ensure atomicity to avoid duplicates when syncing.
            throw new NotImplementedException("Google Sheets persistence not implemented.");
        }

        public Task<bool> ExistsByClientOrderIdAsync(Guid clientOrderId)
        {
            // TODO: Query sheet for an existing clientOrderId
            throw new NotImplementedException("Google Sheets persistence not implemented.");
        }
    }
}
