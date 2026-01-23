using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.Extensions.Options;

namespace TheCoffeCream.Infrastructure.GoogleSheets
{
    public class GoogleSheetsClient : IGoogleSheetsClient
    {
        private readonly GoogleSheetsOptions _options;
        private readonly SheetsService _service;

        public GoogleSheetsClient(IOptions<GoogleSheetsOptions> options)
        {
            _options = options.Value;

            if (string.IsNullOrEmpty(_options.CredentialsPath) || !File.Exists(_options.CredentialsPath))
            {
                // Fallback or warning if credentials not found yet
                // For now, initializing service with null will fail on first call if not handled.
                // In production, we'd throw or use a placeholder.
            }

            GoogleCredential credential = GoogleCredential.FromFile(_options.CredentialsPath)
                .CreateScoped(SheetsService.Scope.Spreadsheets);

            _service = new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "TheCoffeCream",
            });
        }

        public async Task AppendRowAsync(string sheetId, string range, object[] row)
        {
            var valueRange = new ValueRange
            {
                Values = new List<IList<object>> { row.ToList() }
            };

            var appendRequest = _service.Spreadsheets.Values.Append(valueRange, sheetId, range);
            appendRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.USERENTERED;
            await appendRequest.ExecuteAsync();
        }

        public async Task<bool> ExistsByClientOrderIdAsync(string sheetId, Guid clientOrderId)
        {
            // Search in "Order" sheet, assuming column B (index 1) has the ClientOrderId
            var range = "Order!B:B";
            var request = _service.Spreadsheets.Values.Get(sheetId, range);
            var response = await request.ExecuteAsync();
            var values = response.Values;

            if (values != null && values.Count > 0)
            {
                foreach (var row in values)
                {
                    if (row.Count > 0 && row[0].ToString() == clientOrderId.ToString())
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task<IReadOnlyList<object[]>> ReadRangeAsync(string sheetId, string range)
        {
            var request = _service.Spreadsheets.Values.Get(sheetId, range);
            var response = await request.ExecuteAsync();
            var values = response.Values;

            if (values == null) return new List<object[]>().AsReadOnly();

            return values.Select(v => v.ToArray()).ToList().AsReadOnly();
        }

        public async Task<IList<IList<object>>> ReadSheetAsync(string sheetId, string sheetName)
        {
            var range = $"{sheetName}!A:Z"; // Read all columns
            var request = _service.Spreadsheets.Values.Get(sheetId, range);
            var response = await request.ExecuteAsync();
            return response.Values ?? new List<IList<object>>();
        }
    }
}