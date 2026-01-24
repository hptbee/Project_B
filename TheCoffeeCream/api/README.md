# API - The Coffee Cream

## 🐳 Docker Build

The `Dockerfile` is located at the project root to support multi-project dependencies.

### Build Command
Run this from the **root folder** (`TheCoffeeCream/`):

```bash
docker build -t coffee-cream-api -f Dockerfile .
```

### Run Command

```bash
docker run -p 8080:80 \
  -e "GoogleSheets:SpreadsheetId=YOUR_SHEET_ID" \
  coffee-cream-api
```

### Environment Variables
- `GoogleSheets:SpreadsheetId`: ID of the Google Sheet.
    - *How to get*: Open your Google Sheet, look at the URL: `https://docs.google.com/spreadsheets/d/abc12345/edit`. The ID is `abc12345`.
- `GOOGLE_CREDENTIALS_JSON`: JSON content of the Service Account (for production).
