# Automation Tests

This project uses [Playwright](https://playwright.dev) for End-to-End (E2E) testing. The tests cover the Admin, Staff, and Owner applications.

## Prerequisites

1.  **Applications Running**: Ensure all microservices and frontend apps are running.
    *   **Admin App**: [http://localhost:4010](http://localhost:4010)
    *   **Staff App**: [http://localhost:4011](http://localhost:4011)
    *   **Owner App**: [http://localhost:4012](http://localhost:4012)
    *   **API**: [http://localhost:8080](http://localhost:8080)
2.  **Node.js**: Installed on your system.
3.  **Browsers**: Playwright browsers installed.

## Setup

1.  Install dependencies:
    ```powershell
    npm install
    ```
2.  Install Playwright browsers:
    ```powershell
    npx playwright install
    ```

## Running Tests

### 1. Initialize Test Data (Staff App)
To populate the database with real order data for testing reports and history, run the setup test first:
```powershell
npx playwright test staff.spec.ts -g "Setup: Create Multiple Orders" --project=staff --workers=1
```
This test will create **25 random orders** across different tables with various products.

### 2. Run All Tests
```powershell
npx playwright test
```

### 3. Run Specific Application Tests
```powershell
# Staff App Only
npx playwright test staff.spec.ts --project=staff --workers=1

# Admin App Only
npx playwright test admin.spec.ts --project=admin

# Owner App Only
npx playwright test owner.spec.ts --project=owner
```

## Troubleshooting

### Timeouts
If tests time out during login, ensure the API is responsive. You can increase the timeout in `playwright.config.ts` or directly in the test file if needed.

### Viewport/Click Issues
Most interactive elements in the Staff app use `scrollIntoViewIfNeeded()` before clicking to ensure robustness across different screen sizes.

## Reports
After running tests, you can view the detailed HTML report:
```powershell
npx playwright show-report
```
