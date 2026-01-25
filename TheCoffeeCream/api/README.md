# ⚙️ The Coffee Cream API

High-performance backend powered by ASP.NET Core 8, implementing Clean Architecture and a unique Google Sheets database integration.

## 🏗️ Architecture
- **Web API**: RESTful endpoints with standard DTOs.
- **Domain**: Pure business logic and entities (Product, Order, Category).
- **Infrastructure**: Google Sheets API implementation of Domain repositories.
- **Application**: Service layer for business orchestration.

## 📊 Database: Google Sheets
The system uses Google Sheets as a lightweight, real-time database. 
- **Setup**: Require a `service_account.json` with access to the spreadsheet.
- **Configuration**: Set the `SpreadsheetId` in `appsettings.json` or Environment Variables.

## 🚀 Running Locally
```bash
cd TheCoffeeCream
dotnet run
```

## 🐳 Docker Build
Run from the repository **root**:
```bash
docker build -t coffee-cream-api -f Dockerfile .
```

## 🌐 Environment Variables
- `GoogleSheets:SpreadsheetId`: spreadsheet ID from the URL.
- `GOOGLE_CREDENTIALS_JSON`: Service account JSON content.

---
Proprietary © 2026 The Coffee Cream
