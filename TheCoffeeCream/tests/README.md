# Automation Tests

This project uses [Playwright](https://playwright.dev) for End-to-End testing.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

**Prerequisite**: Ensure the applications are running locally (Admin: 3000, Staff: 3001, Owner: 3002).

Run all tests:
```bash
npx playwright test
```

Run specific project:
```bash
npx playwright test --project=admin
npx playwright test --project=staff
npx playwright test --project=owner
```

Show report:
```bash
npx playwright show-report
```
