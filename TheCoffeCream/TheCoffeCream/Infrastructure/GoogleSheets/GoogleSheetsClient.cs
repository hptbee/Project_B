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

namespace TheCoffeeCream.Infrastructure.GoogleSheets
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
            }

            // Create credential using CredentialFactory to avoid deprecated APIs
            GoogleCredential credential;
            if (File.Exists(_options.CredentialsPath))
            {
                using var stream = File.OpenRead(_options.CredentialsPath);
                var specific = Google.Apis.Auth.OAuth2.CredentialFactory.FromStream(stream);
                credential = specific.ToGoogleCredential().CreateScoped(SheetsService.Scope.Spreadsheets);
            }
            else
            {
                credential = GoogleCredential.GetApplicationDefault().CreateScoped(SheetsService.Scope.Spreadsheets);
            }

            _service = new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "TheCoffeeCream",
            });
        }

        public async Task AppendRowAsync(string sheetId, string range, object[] row)
        {
            await AppendRowsAsync(sheetId, range, new List<object[]> { row });
        }

        public async Task AppendRowsAsync(string sheetId, string range, IEnumerable<object[]> rows)
        {
            if (rows == null || !rows.Any()) return;

            var valueRange = new ValueRange
            {
                Values = rows.Select(r => (IList<object>)r.ToList()).ToList()
            };

            var appendRequest = _service.Spreadsheets.Values.Append(valueRange, sheetId, range);
            appendRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.USERENTERED;
            await appendRequest.ExecuteAsync();
        }

        public async Task<bool> ExistsByClientOrderIdAsync(string sheetId, Guid clientOrderId)
        {
            var range = "Order!B:B";
            var request = _service.Spreadsheets.Values.Get(sheetId, range);
            var response = await request.ExecuteAsync();
            var values = response.Values;

            if (values != null && values.Count > 0)
            {
                foreach (var row in values)
                {
                    if (row != null && row.Count > 0 && row[0]?.ToString() == clientOrderId.ToString())
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
            var range = $"{sheetName}!A:Z";
            var request = _service.Spreadsheets.Values.Get(sheetId, range);
            var response = await request.ExecuteAsync();
            return response.Values ?? new List<IList<object>>();
        }

        public async Task UpdateRowAsync(string sheetId, string range, object[] row)
        {
            var valueRange = new ValueRange
            {
                Values = new List<IList<object>> { row.ToList() }
            };

            var updateRequest = _service.Spreadsheets.Values.Update(valueRange, sheetId, range);
            updateRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.USERENTERED;
            await updateRequest.ExecuteAsync();
        }

        public async Task DeleteRowsAsync(string sheetId, string sheetName, List<int> rowIndices)
        {
            if (rowIndices == null || !rowIndices.Any()) return;

            var spreadSheet = await _service.Spreadsheets.Get(sheetId).ExecuteAsync();
            var sheet = spreadSheet.Sheets.FirstOrDefault(s => s.Properties.Title == sheetName);
            if (sheet == null) return;
            int numericSheetId = sheet.Properties.SheetId ?? 0;

            var sortedIndices = rowIndices.OrderByDescending(i => i).ToList();

            var requests = sortedIndices.Select(index => new Request
            {
                DeleteDimension = new DeleteDimensionRequest
                {
                    Range = new DimensionRange
                    {
                        SheetId = numericSheetId,
                        Dimension = "ROWS",
                        StartIndex = index - 1,
                        EndIndex = index
                    }
                }
            }).ToList();

            await _service.Spreadsheets.BatchUpdate(new BatchUpdateSpreadsheetRequest { Requests = requests }, sheetId).ExecuteAsync();
        }
    }
}