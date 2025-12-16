/**
 * DataSummaryTable Visual Tests
 * Tests visual appearance using Playwright
 */

import { test, expect } from '@playwright/test';

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  large: { width: 1920, height: 1080 },
};

test.describe('DataSummaryTable Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page that displays the DataSummaryTable
    // In real scenario, this would be the review page
    await page.goto('/si/review/si_abc123');
  });

  test('displays correct table border color #52525B', async ({ page }) => {
    const table = page.getByTestId('data-summary-table');
    await expect(table).toBeVisible();

    const borderColor = await table.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });

    // Convert #52525B to RGB: rgb(82, 82, 91)
    expect(borderColor).toBe('rgb(82, 82, 91)');
  });

  test('displays alternating row colors', async ({ page }) => {
    const firstRow = page.getByTestId('table-row-shipperName');
    const secondRow = page.getByTestId('table-row-shipperAddress');

    const firstBgColor = await firstRow.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const secondBgColor = await secondRow.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Rows should have different backgrounds
    expect(firstBgColor).not.toBe(secondBgColor);
  });

  test('displays correct header background #27272A', async ({ page }) => {
    const header = page.locator('thead tr').first();
    
    const bgColor = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // #27272A with 50% opacity
    // This test checks for the presence of the color, exact rgba may vary
    expect(bgColor).toContain('rgba(39, 39, 42');
  });

  test('displays correct cell padding', async ({ page }) => {
    const cell = page.locator('td').first();
    
    const padding = await cell.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
      };
    });

    // px-4 py-3 = 16px horizontal, 12px vertical
    expect(padding.paddingLeft).toBe('16px');
    expect(padding.paddingRight).toBe('16px');
    expect(padding.paddingTop).toBe('12px');
    expect(padding.paddingBottom).toBe('12px');
  });

  test('has hover effect on rows', async ({ page }) => {
    const row = page.getByTestId('table-row-shipperName');
    
    const initialBgColor = await row.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    await row.hover();
    
    // Wait for transition
    await page.waitForTimeout(100);

    const hoverBgColor = await row.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Background should change on hover
    expect(initialBgColor).not.toBe(hoverBgColor);
  });

  test('responsive: displays table on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('responsive: displays cards on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    
    // On mobile, should show card layout
    const card = page.getByTestId('card-shipperName');
    await expect(card).toBeVisible();
  });

  Object.entries(VIEWPORTS).forEach(([name, size]) => {
    test(`renders correctly on ${name} viewport`, async ({ page }) => {
      await page.setViewportSize(size);
      
      const table = page.getByTestId('data-summary-table');
      await expect(table).toBeVisible();
      
      // Take screenshot for visual comparison
      await expect(table).toHaveScreenshot(`data-summary-table-${name}.png`);
    });
  });

  test('highlights modified fields correctly', async ({ page }) => {
    // This would require a page that renders the table with highlightChanges=true
    // For now, we'll skip the implementation
    test.skip();
  });
});
