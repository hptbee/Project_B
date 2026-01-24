using Microsoft.Extensions.Options;
using TheCoffeeCream.Domain.Entities;
using TheCoffeeCream.Application.Interfaces;

namespace TheCoffeeCream.Infrastructure.GoogleSheets
{
    public class GoogleSheetUserRepository : IUserRepository
    {
        private readonly IGoogleSheetsClient _client;
        private readonly GoogleSheetsOptions _options;

        public GoogleSheetUserRepository(IGoogleSheetsClient client, IOptions<GoogleSheetsOptions> options)
        {
            _client = client;
            _options = options.Value;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            var rows = await _client.ReadRangeAsync(_options.OrdersSheetId, "User!A2:E");
            if (rows == null) return null;

            foreach (var row in rows)
            {
                if (row.Count < 3) continue;

                var rowUsername = row[2]?.ToString() ?? string.Empty;
                if (string.Equals(rowUsername, username, StringComparison.OrdinalIgnoreCase))
                {
                    return MapRowToUser(row);
                }
            }

            return null;
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            var rows = await _client.ReadRangeAsync(_options.OrdersSheetId, "User!A2:E");
            if (rows == null) return null;

            foreach (var row in rows)
            {
                if (row.Count < 1) continue;

                var rowId = row[0]?.ToString() ?? string.Empty;
                if (string.Equals(rowId, id, StringComparison.OrdinalIgnoreCase))
                {
                    return MapRowToUser(row);
                }
            }

            return null;
        }

        private User MapRowToUser(IList<object> row)
        {
            return new User
            {
                Id = row[0]?.ToString() ?? string.Empty,
                Email = row.Count > 1 ? row[1]?.ToString() ?? string.Empty : string.Empty,
                Username = row.Count > 2 ? row[2]?.ToString() ?? string.Empty : string.Empty,
                PasswordHash = row.Count > 3 ? row[3]?.ToString() ?? string.Empty : string.Empty,
                Role = row.Count > 4 ? row[4]?.ToString() ?? string.Empty : "Staff"
            };
        }
    }
}
