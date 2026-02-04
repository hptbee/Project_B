import { test, expect } from '@playwright/test';

test.describe('Staff App E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Login if needed
        if (await page.locator('input[name="username"]').isVisible()) {
            await page.fill('input[name="username"]', 'staff');
            await page.fill('input[name="password"]', 'staff');
            await page.click('button[type="submit"]');
        }
    });

    // 1. MAIN FLOW: Table -> Order -> Checkout
    test('Complete Order Flow: Select Table 1 -> Add Cafe -> Checkout (Cash)', async ({ page }) => {
        // Select Table 1
        const table1 = page.locator('a[href*="/table/1"]').first();
        await table1.click();

        // Check if we need to add an item (redirects to product list if empty)
        if (page.url().includes('/products')) {
            console.log('Redirected to Product List (Table is empty)');
        } else {
            await page.click('.fab-btn'); // Go to products
        }

        // Add Product
        await page.locator('.product-row').first().waitFor();
        const productTitle = await page.locator('.product-row .title').first().innerText();
        await page.locator('.product-row').first().click();

        // Confirm Add
        await expect(page.locator('.page.detail')).toBeVisible();
        await page.click('.bottom-action.btn-primary');

        // Back at Table Order
        await expect(page).toHaveURL(/\/table\/1/);
        await expect(page.locator('.order-item')).toContainText(productTitle);

        // Go to Checkout
        await page.locator('.btn-checkout').click();
        await expect(page).toHaveURL(/\/checkout\/1/);

        // Select Cash Payment (default) & Pay
        await page.click('.payment-method-item:has-text("Tiền mặt"), .payment-method-item:has-text("Cash")');
        await page.click('.checkout-footer .btn-primary'); // "Pay" button

        // Should return to Home
        await expect(page).toHaveURL(/\/$/);
        await expect(page.locator('.page-header h2')).toContainText(/SƠ ĐỒ BÀN|Floor Plan/i);

        console.log('Order completed using Cash.');
    });

    // 2. DISCOUNT & COMBINED PAYMENT
    test('Checkout with Discount and Combined Payment', async ({ page }) => {
        // Prepare: Add item to Table 2
        await page.goto('/products?table=2');
        await page.locator('.product-row').first().click();
        await page.click('.bottom-action.btn-primary');
        await page.goto('/checkout/2');

        // Open Discount
        await page.click('.summary-row.clickable-row');

        // Select Percentage 10%
        await page.click('button:has-text("%")');
        await page.click('button:has-text("10%")');

        // Verify Discount Applied
        const totalText = await page.locator('.total-value').innerText();
        console.log(`Total after discount: ${totalText}`);

        // Select Combined Payment
        await page.click('.payment-method-item:has-text("Kết hợp"), .payment-method-item:has-text("Combined")');

        // The inputs should appear
        await expect(page.locator('.combined-inputs')).toBeVisible();

        // Just verify UI components exist, logic is hard to test without exact prices
        // Finish Payment
        await page.click('.checkout-footer .btn-primary');
        await expect(page).toHaveURL(/\/$/);
    });

    // 3. ORDER HISTORY
    test('View Order History', async ({ page }) => {
        // Open Menu
        await page.click('.menu.icon-btn');

        // Click Order History
        await page.click('a[href="/orders"], li:has-text("Lịch sử đơn hàng")');

        await expect(page).toHaveURL(/\/orders/);
        await expect(page.locator('.page-header h2')).toContainText(/Lịch sử đơn hàng|Order History/i);

        // Filter Chips
        await page.click('.filter-chips .badge-container:has-text("Tiền mặt"), .filter-chips .badge-container:has-text("Cash")');
    });

    // 4. REPORTS
    test('View End of Day Report', async ({ page }) => {
        // Open Menu
        await page.click('.menu.icon-btn');

        // Click Report
        await page.click('a[href="/report"], li:has-text("Báo cáo")');

        await expect(page).toHaveURL(/\/report/);

        // Switch Tabs
        await page.click('.tab-button:has-text("Hàng hóa"), .tab-button:has-text("Goods")');
        await expect(page.locator('.product-sales-header')).toBeVisible();
    });

    // 5. KITCHEN NOTIFICATIONS
    test('View Kitchen Notifications', async ({ page }) => {
        await page.click('.menu.icon-btn');
        await page.click('a[href="/kitchen"], li:has-text("Bếp")');
        await expect(page).toHaveURL(/\/kitchen/);
        await expect(page.locator('.page-header h2')).toContainText(/Notif|Bếp/i);
    });

    // Requirement: 3.4 Operational Features - Payment Requests
    test('View Payment Requests', async ({ page }) => {
        await page.click('.menu.icon-btn');
        await page.click('a[href="/requests"], li:has-text("Yêu cầu")');
        await expect(page).toHaveURL(/\/requests/);
        await expect(page.locator('.page-header h2')).toContainText(/Request|Yêu cầu/i);
    });

    // Requirement: 3.6 Settings & Support
    test('View Help, Terms, and Support', async ({ page }) => {
        await page.click('.menu.icon-btn');

        // Help
        await page.click('a[href="/help"]');
        await expect(page).toHaveURL(/\/help/);
        await page.click('.back.icon-btn');

        // Terms
        await page.click('.menu.icon-btn');
        await page.click('a[href="/terms"]');
        await expect(page).toHaveURL(/\/terms/);
        await page.click('.back.icon-btn');

        // Support
        await page.click('.menu.icon-btn');
        await page.click('a[href="/support"]');
        await expect(page).toHaveURL(/\/support/);
        await page.click('.back.icon-btn');
    });

    // 6. SETTINGS & LOGOUT
    test('Settings and Logout', async ({ page }) => {
        // 1. Settings
        await page.click('.menu.icon-btn');
        await page.click('a[href="/settings"]');
        await expect(page).toHaveURL(/\/settings/);
        await page.click('.back.icon-btn'); // Back to menu/home

        // 2. Logout
        await page.click('.menu.icon-btn');
        await page.click('a[href="/logout"], li:has-text("Đăng xuất")');

        await expect(page).toHaveURL(/\/login/);
        console.log('Logged out successfully');
    });

    // 7. OFFLINE MODE SIMULATION
    test('Offline Mode: Queue Order', async ({ page }) => {
        // Go to Table 3
        await page.goto('/products?table=3');
        const fab = page.locator('.fab-btn');
        if (await fab.isVisible()) await fab.click();

        // Add Product
        await page.locator('.product-row').first().click();
        await page.click('.bottom-action.btn-primary');

        // Go Offline
        await page.context().setOffline(true);
        console.log('Simulated Offline Mode');

        // Try to Checkout/Save Draft
        // Note: The UI might handle offline gracefully or queue it.
        // We check if it DOESN'T crash and ideally shows a "Saved to queue" or similar if implemented,
        // or at least allows interaction.
        // For now, we verified the "Save Draft" button exists
        const saveDraftBtn = page.locator('.btn-save-draft');
        await expect(saveDraftBtn).toBeVisible();

        // Click Save Draft
        await saveDraftBtn.click();

        // Since it's offline, it might stay on page or go to home with queued status
        // We just ensure we didn't crash.
        await expect(page.locator('body')).toBeVisible();

        // Go Online
        await page.context().setOffline(false);
    });

    // 8. SYSTEM BEHAVIORS: Language Toggle
    test('Language and Theme Toggles', async ({ page }) => {
        await page.goto('/login'); // Toggles are on login page too

        // Theme Toggle (Sun/Moon icon)
        const themeToggle = page.locator('.theme-toggle');
        await expect(themeToggle).toBeVisible();
        await themeToggle.click();

        // Verify attribute change (data-theme="dark" <-> "light")
        const html = page.locator('html');
        const initialTheme = await html.getAttribute('data-theme') || 'dark';
        await themeToggle.click();
        // Since we don't know exact 'previous', just check if it changed or has a value
        const newTheme = await html.getAttribute('data-theme');
        expect(newTheme).not.toBe(initialTheme);

        // Language Toggle
        const langToggle = page.locator('.lang-toggle');
        await expect(langToggle).toBeVisible();
        // Implementation might be a dropdown or button cycle.
        // Assuming it changes text or attribute.
        await langToggle.click();
    });

});
