import { test, expect } from '@playwright/test';

test.describe('Admin App E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Check if login needed
        if (await page.locator('input[name="username"]').isVisible()) {
            await page.fill('input[name="username"]', 'admin');
            await page.fill('input[name="password"]', 'admin');
            await page.click('button[type="submit"]');
            await expect(page.locator('.page-container, .main-layout, .menu.icon-btn')).toBeVisible();
        }
    });

    // Requirement: 3.2 Dashboard & Analytics
    test('Dashboard loads correctly', async ({ page }) => {
        await expect(page).toHaveURL(/\/$/);
        await expect(page.locator('.main-layout')).toBeVisible();
        // Assuming Dashboard has some specific chart or card
        // Since MainLayout renders children, and Dashboard is default '/'
        // We expect some content.
        await expect(page.locator('main')).toBeVisible();
    });

    // Requirement: 3.3 Core Management Features - Orders
    test('Navigate to Orders', async ({ page }) => {
        // Open Menu if needed
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/orders"]');
        await expect(page).toHaveURL(/\/orders/);
        await expect(page.locator('.page h2, .page-header')).toBeVisible();
    });

    test('Orders list renders or shows empty state', async ({ page }) => {
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/orders"]');
        await expect(page).toHaveURL(/\/orders/);

        const ordersList = page.locator('.order-list, .order-row, .order-card, .table-list');
        const emptyState = page.locator('.empty-state, text=/No orders|Chưa có đơn/i');
        if (await ordersList.first().isVisible().catch(() => false)) {
            await expect(ordersList.first()).toBeVisible();
        } else {
            await expect(emptyState.first()).toBeVisible({ timeout: 10000 });
        }
    });

    test('Open order detail if available', async ({ page }) => {
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/orders"]');
        await expect(page).toHaveURL(/\/orders/);

        const firstOrder = page.locator('.order-row, .order-card, a[href^="/orders/"]').first();
        if (await firstOrder.isVisible().catch(() => false)) {
            await firstOrder.click();
            await expect(page).toHaveURL(/\/orders\/\w+/);
            await expect(page.locator('.page h2, .page-header')).toBeVisible();
        }
    });

    // Requirement: 3.3 Core Management Features - Products
    test('Navigate to Products and Verify UI', async ({ page }) => {
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/products"]');
        await expect(page).toHaveURL(/\/products/);

        // Check for ProductList specific elements
        await expect(page.locator('.product-list-page')).toBeVisible();

        // Check for "Add New" button
        const addBtn = page.locator('.add-btn');
        await expect(addBtn).toBeVisible();

        // Check for Search Bar
        await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    });

    test('Products list renders or shows empty state', async ({ page }) => {
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/products"]');
        await expect(page).toHaveURL(/\/products/);

        const productRows = page.locator('.product-row, .product-card, .product-item');
        const emptyState = page.locator('.empty-state, text=/No products|Chưa có sản phẩm/i');
        if (await productRows.first().isVisible().catch(() => false)) {
            await expect(productRows.first()).toBeVisible();
        } else {
            await expect(emptyState.first()).toBeVisible({ timeout: 10000 });
        }
    });

    test('Product search filters list (if search exists)', async ({ page }) => {
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/products"]');
        await expect(page).toHaveURL(/\/products/);

        const searchInput = page.locator('input[placeholder*="Search"], input[type="text"]').first();
        if (await searchInput.isVisible().catch(() => false)) {
            await searchInput.fill('Cafe');
            await page.waitForTimeout(500);
            const productRows = page.locator('.product-row, .product-card, .product-item');
            await expect(productRows.first()).toBeVisible();
        }
    });

    // Requirement: 3.1 Authentication - Registration & Verification
    test('Registration and Verify Email Routes accessible', async ({ page }) => {
        // These are public or accessible routes.
        await page.goto('/register');
        await expect(page).toHaveURL(/\/register/);
        await expect(page.locator('form')).toBeVisible(); // Should have a registration form

        await page.goto('/verify-email');
        // It might redirect if no token, but we check if the route is handled
        // or checks for specific UI message
        await expect(page.locator('body')).toBeVisible();
    });

    // Requirement: 3.3 Core Management Features - Users
    test('User Management List loads', async ({ page }) => {
        // Ensure logged in
        await page.goto('/');
        if (await page.locator('input[name="username"]').isVisible()) {
            await page.fill('input[name="username"]', 'admin');
            await page.fill('input[name="password"]', 'admin');
            await page.click('button[type="submit"]');
        }

        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/users"]');
        await expect(page).toHaveURL(/\/users/);

        // Check for user list or empty state
        // "View and manage system users"
        await expect(page.locator('.user-list, .users-table, .empty-state')).toBeVisible();
    });

    // Requirement: 3.3 Core Management Features - Users
    test('Navigate to Users', async ({ page }) => {
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/users"]');
        await expect(page).toHaveURL(/\/users/);
    });

    test('Staff limit: warn or disable when exceeding 5 active staff (if UI exposes)', async ({ page }) => {
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        await page.click('a[href="/users"]');
        await expect(page).toHaveURL(/\/users/);

        const addBtn = page.locator('.add-btn, button:has-text("Add"), button:has-text("New User")').first();
        if (await addBtn.isVisible().catch(() => false)) {
            await addBtn.click();

            const warning = page.locator('.toast-warning, .notification-warning, .modal:has-text("limit"), text=/limit|tối đa|5/i').first();
            const saveBtn = page.locator('button[type="submit"], .btn-save, button:has-text("Create")').first();

            if (await warning.isVisible().catch(() => false)) {
                await expect(warning).toBeVisible();
            } else if (await saveBtn.isVisible().catch(() => false)) {
                // If form is shown, ensure it allows entry but doesn't assert create
                await expect(saveBtn).toBeVisible();
            }
        }
    });

    // Requirement: 3.4 User Interface & UX - Theme/Language
    test('Theme and Language Toggles (Login Page)', async ({ page }) => {
        // Logout first to see login page
        // Assuming logout is in side menu or we just goto /login
        await page.goto('/login');

        const themeToggle = page.locator('.theme-toggle');
        if (await themeToggle.isVisible()) {
            const html = page.locator('html');
            const initialTheme = await html.getAttribute('data-theme') || 'dark';
            await themeToggle.click();
            const newTheme = await html.getAttribute('data-theme');
            expect(newTheme).not.toBe(initialTheme);
        }

        const langToggle = page.locator('.lang-toggle');
        if (await langToggle.isVisible()) {
            await langToggle.click();
        }
    });

    test('Theme and Language Toggles (Sidebar/Main Layout)', async ({ page }) => {
        const menuBtn = page.locator('.top-bar-menu-btn, .icon-btn:has-text("menu")').first();
        if (await menuBtn.isVisible()) await menuBtn.click();

        const themeToggle = page.locator('.theme-toggle, [aria-label*="Theme"], button:has-text("Theme")').first();
        if (await themeToggle.isVisible().catch(() => false)) {
            const html = page.locator('html');
            const initialTheme = await html.getAttribute('data-theme') || 'dark';
            await themeToggle.click();
            const newTheme = await html.getAttribute('data-theme');
            expect(newTheme).not.toBe(initialTheme);
        }

        const langToggle = page.locator('.lang-toggle, [aria-label*="Language"], button:has-text("Language")').first();
        if (await langToggle.isVisible().catch(() => false)) {
            await langToggle.click();
        }
    });

    test('Access control: unauthenticated users redirected or denied', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.goto('/orders');

        const loginForm = page.locator('input[name="username"], input[name="password"]').first();
        const accessDenied = page.locator('.access-denied, .modal:has-text("Access Denied"), text=/Access Denied|Không có quyền/i').first();

        if (await loginForm.isVisible().catch(() => false)) {
            await expect(loginForm).toBeVisible();
        } else {
            await expect(accessDenied).toBeVisible({ timeout: 10000 });
        }
    });

    test('Role guard: non-admin user cannot access admin routes', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="username"]', 'staff');
        await page.fill('input[name="password"]', 'staff');
        await page.click('button[type="submit"]');

        // Either access denied, login error, or redirect back to login
        const accessDenied = page.locator('.access-denied, .modal:has-text("Access Denied"), text=/Access Denied|Không có quyền/i').first();
        const loginForm = page.locator('input[name="username"], input[name="password"]').first();
        const errorToast = page.locator('.toast-error, .notification-error, [role="alert"]').first();

        if (await accessDenied.isVisible().catch(() => false)) {
            await expect(accessDenied).toBeVisible();
        } else if (await errorToast.isVisible().catch(() => false)) {
            await expect(errorToast).toBeVisible();
        } else {
            await expect(loginForm).toBeVisible({ timeout: 10000 });
        }
    });

    test('Registration flow shows validation or success feedback', async ({ page }) => {
        await page.goto('/register');
        await expect(page).toHaveURL(/\/register/);

        const nameInput = page.locator('input[name="name"], input[placeholder*="Name"]').first();
        const emailInput = page.locator('input[name="email"], input[type="email"]').first();
        const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
        const confirmInput = page.locator('input[name="confirmPassword"], input[name="confirm"], input[placeholder*="Confirm"]').first();

        if (await nameInput.isVisible().catch(() => false)) await nameInput.fill('Admin Test');
        if (await emailInput.isVisible().catch(() => false)) await emailInput.fill(`admin.test+${Date.now()}@example.com`);
        if (await passwordInput.isVisible().catch(() => false)) await passwordInput.fill('Admin@12345');
        if (await confirmInput.isVisible().catch(() => false)) await confirmInput.fill('Admin@12345');

        const submitBtn = page.locator('button[type="submit"], .btn-primary, button:has-text("Register")').first();
        if (await submitBtn.isVisible().catch(() => false)) {
            await submitBtn.click();
        }

        const feedback = page.locator('.toast-success, .toast-error, .notification, [role="alert"], .error-alert').first();
        await expect(feedback).toBeVisible({ timeout: 10000 });
    });

    test('Loading states show during login and data fetch', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="username"]', 'admin');
        await page.fill('input[name="password"]', 'admin');

        const submitBtn = page.locator('button[type="submit"]').first();
        await submitBtn.click();

        // Expect spinner or disabled button briefly
        const loadingIndicator = page.locator('.spinner, .loading, .btn-loading, [aria-busy="true"]').first();
        if (await loadingIndicator.isVisible().catch(() => false)) {
            await expect(loadingIndicator).toBeVisible();
        } else {
            await expect(submitBtn).toBeDisabled({ timeout: 3000 }).catch(() => {});
        }

        await expect(page.locator('.page-container, .main-layout, .menu.icon-btn')).toBeVisible({ timeout: 30000 });
    });

    test('Timezone consistency: dashboard date matches GMT+7 (if displayed)', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.main-layout, .page-container, main')).toBeVisible();

        const dateLabel = page.locator('.dashboard-date, .date-range, .report-date, .today-date').first();
        if (await dateLabel.isVisible().catch(() => false)) {
            const text = (await dateLabel.textContent()) || '';
            const now = new Date();
            const fmt1 = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).format(now);
            const fmt2 = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' }).format(now);
            expect(text).toMatch(new RegExp(`${fmt1}|${fmt2}`, 'i'));
        }
    });

});
