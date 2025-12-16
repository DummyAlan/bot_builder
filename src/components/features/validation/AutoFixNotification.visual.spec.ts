import { test, expect } from '@playwright/test';

test.describe('Auto-Fix Notification Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/si-upload');
  });

  test('should have cyan border and glow effect', async ({ page }) => {
    await page.waitForSelector('[data-testid="auto-fix-notification"]', { state: 'visible', timeout: 10000 });
    
    const notification = page.locator('[data-testid="auto-fix-notification"]');
    
    const borderColor = await notification.evaluate((el) =>
      globalThis.getComputedStyle(el).borderColor
    );
    
    expect(borderColor).toContain('rgb(34, 211, 238)'); // #22D3EE
  });

  test('should display rotate icon', async ({ page }) => {
    await page.waitForSelector('[data-testid="auto-fix-notification"]', { state: 'visible', timeout: 10000 });
    
    const iconExists = await page.locator('text=⟳').isVisible();
    expect(iconExists).toBeTruthy();
  });

  test('should have dark background', async ({ page }) => {
    await page.waitForSelector('[data-testid="auto-fix-notification"]', { state: 'visible', timeout: 10000 });
    
    const notification = page.locator('[data-testid="auto-fix-notification"]');
    const bgColor = await notification.evaluate((el) =>
      globalThis.getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).toContain('rgb(24, 24, 27)'); // #18181B
  });

  test('should show original value with strikethrough', async ({ page }) => {
    await page.waitForSelector('[data-testid="auto-fix-notification"]', { state: 'visible', timeout: 10000 });
    
    const strikethrough = page.locator('.line-through').first();
    const textDecoration = await strikethrough.evaluate((el) =>
      globalThis.getComputedStyle(el).textDecoration
    );
    
    expect(textDecoration).toContain('line-through');
  });

  test('should display fixed value in green', async ({ page }) => {
    await page.waitForSelector('[data-testid="auto-fix-notification"]', { state: 'visible', timeout: 10000 });
    
    const fixedValue = page.locator('.text-\\[\\#10B981\\]').first();
    const exists = await fixedValue.count();
    expect(exists).toBeGreaterThan(0);
  });
});
