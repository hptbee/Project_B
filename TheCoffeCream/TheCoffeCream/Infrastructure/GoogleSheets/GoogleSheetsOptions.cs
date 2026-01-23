namespace TheCoffeCream.Infrastructure.GoogleSheets
{
    // Configuration bound from "GoogleSheets" section in appsettings / env vars
    public class GoogleSheetsOptions
    {
        public string OrdersSheetId { get; set; } = string.Empty;
        public string CredentialsPath { get; set; } = string.Empty;
    }
}