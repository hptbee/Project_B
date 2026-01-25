using System.Collections.Generic;
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
                if (row.Length < 3) continue;

                var rowUsername = row[2]?.ToString() ?? string.Empty;
                if (string.Equals(rowUsername, username, StringComparison.OrdinalIgnoreCase))
                {
                    var user = MapRowToUser(row);
                    // Only return active users for login/authentication
                    return user.IsActive ? user : null;
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
                if (row.Length < 1) continue;

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
                Role = row.Count > 4 ? row[4]?.ToString() ?? string.Empty : "Staff",
                IsActive = row.Count > 5 ? (row[5]?.ToString() == "1") : true
            };
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            var rows = await _client.ReadRangeAsync(_options.OrdersSheetId, "User!A2:F");
            var users = new List<User>();
            if (rows == null) return users;

            foreach (var row in rows)
            {
                if (row.Length < 1) continue;
                users.Add(MapRowToUser(row));
            }

            return users;
        }

        public async Task CreateAsync(User user)
        {
            var row = new object[]
            {
                user.Id,
                user.Email,
                user.Username,
                user.PasswordHash,
                user.Role,
                user.IsActive ? "1" : "0"
            };
            await _client.AppendRowAsync(_options.OrdersSheetId, "User!A:F", row);
        }

        public async Task UpdateAsync(User user)
        {
            var rows = await _client.ReadRangeAsync(_options.OrdersSheetId, "User!A2:F");
            if (rows == null) return;

            for (int i = 0; i < rows.Count; i++)
            {
                if (rows[i].Length > 0 && rows[i][0]?.ToString() == user.Id)
                {
                    var row = new object[]
                    {
                        user.Id,
                        user.Email,
                        user.Username,
                        user.PasswordHash,
                        user.Role,
                        user.IsActive ? "1" : "0"
                    };
                    // User!A{i+2} because A1 is header, i=0 is A2
                    await _client.UpdateRowAsync(_options.OrdersSheetId, $"User!A{i + 2}:F{i + 2}", row);
                    break;
                }
            }
        }

        public async Task ToggleActiveAsync(string id)
        {
            var user = await GetByIdAsync(id);
            if (user != null)
            {
                user.IsActive = !user.IsActive;
                await UpdateAsync(user);
            }
        }
    }
}
