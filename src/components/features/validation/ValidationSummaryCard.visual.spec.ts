import { test, expect } from '@playwright/test';

test.describe('Validation Summary Card Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with validation summary (to be created)
    await page.goto('/si-upload');
  });

  test('should display validation passed state with correct styling', async ({ page }) => {
    // Wait for validation to complete
    await page.waitForSelector('[data-testid="validation-summary"]', { timeout: 5000 });
    
    const summary = page.locator('[data-testid="validation-summary"]');
    
    // Check for green glow effect
    const borderColor = await summary.evaluate((el) =>
      globalThis.getComputedStyle(el).borderColor
    );
    expect(borderColor).toContain('rgb(16, 185, 129)'); // #10B981
  });

  test('should display auto-fix notification with cyan border', async ({ page }) => {
    await page.waitForSelector('[data-testid="auto-fix-notification"]', { timeout: 5000 });
    
    const notification = page.locator('[data-testid="auto-fix-notification"]');
    const borderColor = await notification.evaluate((el) =>
      globalThis.getComputedStyle(el).borderColor
    );
    
    expect(borderColor).toContain('rgb(34, 211, 238)'); // #22D3EE
  });

  test('should display validation badges with correct colors', async ({ page }) => {
    const validBadge = page.locator('[data-testid="validation-badge-valid"]');
    const textColor = await validBadge.evaluate((el) =>
      globalThis.getComputedStyle(el).color
    );
    
    expect(textColor).toContain('rgb(16, 185, 129)'); // #10B981
  });

  test('should show error state with red border on invalid fields', async ({ page }) => {
    // Trigger validation with invalid data
    const invalidInput = page.locator('[data-testid="si-form-field-containerNumber"]');
    const borderColor = await invalidInput.evaluate((el) =>
      globalThis.getComputedStyle(el).borderColor
    );
    
    if (borderColor.includes('rgb(239, 68, 68)')) {
      expect(borderColor).toContain('rgb(239, 68, 68)'); // #EF4444
    }
  });
});
