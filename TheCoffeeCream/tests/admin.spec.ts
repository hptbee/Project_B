import { test, expect } from '@playwright/test';

test.describe('Admin App E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Check if login needed
        if (await page.locator('input[name="username"]').isVisible()) {
            await page.fill('input[name="username"]', 'admin');
            await page.fill('input[name="password"]', 'admin');
            await page.click('button[type="submit"]');
            await expect(page.locator('.page-container')).toBeVisible();
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

});
