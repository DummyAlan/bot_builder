/**
 * SubmissionProgressTracker Visual Tests
 */

import { test, expect } from '@playwright/test';

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  large: { width: 1920, height: 1080 },
};

test.describe('SubmissionProgressTracker Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to success page which shows progress
    await page.goto('/si/success/sub_123');
  });

  test('displays pending step with correct gray color #52525B', async ({ page }) => {
    const pendingStep = page.getByTestId('progress-step-confirming');
    
    const borderColor = await pendingStep.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });

    // #52525B = rgb(82, 82, 91)
    expect(borderColor).toContain('rgb(82, 82, 91)');
  });

  test('displays active step with cyan color #22D3EE', async ({ page }) => {
    const activeStep = page.getByTestId('progress-step-submitting');
    
    const bgColor = await activeStep.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // #22D3EE = rgb(34, 211, 238)
    expect(bgColor).toBe('rgb(34, 211, 238)');
  });

  test('displays completed step with green color #10B981', async ({ page }) => {
    const completedStep = page.getByTestId('progress-step-preparing');
    
    const bgColor = await completedStep.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // #10B981 = rgb(16, 185, 129)
    expect(bgColor).toBe('rgb(16, 185, 129)');
  });

  test('displays active step with glow effect', async ({ page }) => {
    const activeStep = page.getByTestId('progress-step-submitting');
    
    const boxShadow = await activeStep.evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });

    // Should have cyan glow: shadow-[0_0_10px_rgba(34,211,238,0.5)]
    expect(boxShadow).toContain('rgba(34, 211, 238');
  });

  test('displays checkmark icon for completed steps', async ({ page }) => {
    const completedStep = page.getByTestId('progress-step-preparing');
    
    // Check for SVG path (checkmark)
    const svg = completedStep.locator('svg');
    await expect(svg).toBeVisible();
    
    const pathD = await svg.locator('path').getAttribute('d');
    expect(pathD).toContain('M5 13l4 4L19 7'); // Checkmark path
  });

  test('displays spinner for active step', async ({ page }) => {
    const activeStep = page.getByTestId('progress-step-submitting');
    
    // Check for spinning SVG
    const svg = activeStep.locator('svg');
    await expect(svg).toBeVisible();
    
    const hasSpinClass = await svg.evaluate((el) => {
      return el.classList.contains('animate-spin');
    });
    
    expect(hasSpinClass).toBe(true);
  });

  test('displays step numbers for pending steps', async ({ page }) => {
    const pendingStep = page.getByTestId('progress-step-confirming');
    
    // Should show step number (4)
    await expect(pendingStep.locator('span')).toHaveText('4');
  });

  test('displays connection lines between steps', async ({ page }) => {
    const progressTracker = page.getByTestId('progress-tracker');
    
    // Count connector elements
    const connectors = progressTracker.locator('.h-0\\.5');
    const count = await connectors.count();
    
    // Should have 3 connectors for 4 steps
    expect(count).toBe(3);
  });

  test('completed steps have green connector lines', async ({ page }) => {
    const progressTracker = page.getByTestId('progress-tracker');
    
    // First connector (between step 1 and 2)
    const firstConnector = progressTracker.locator('.h-0\\.5').first();
    
    const bgColor = await firstConnector.locator('div').first().evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should be green #10B981 for completed
    expect(bgColor).toBe('rgb(16, 185, 129)');
  });

  test('pending connectors have gray color', async ({ page }) => {
    const progressTracker = page.getByTestId('progress-tracker');
    
    // Last connector (between step 3 and 4)
    const lastConnector = progressTracker.locator('.h-0\\.5').last();
    
    const bgColor = await lastConnector.locator('div').first().evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should be gray #52525B for pending
    expect(bgColor).toBe('rgb(82, 82, 91)');
  });

  test('step labels have correct text color based on status', async ({ page }) => {
    // Active step label should be cyan
    const activeLabel = page.getByText('Submitting to IRIS');
    const activeColor = await activeLabel.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(activeColor).toBe('rgb(34, 211, 238)'); // Cyan

    // Completed step label should be green
    const completedLabel = page.getByText('Preparing Data');
    const completedColor = await completedLabel.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(completedColor).toBe('rgb(16, 185, 129)'); // Green
  });

  Object.entries(VIEWPORTS).forEach(([name, size]) => {
    test(`renders correctly on ${name} viewport`, async ({ page }) => {
      await page.setViewportSize(size);
      
      const progressTracker = page.getByTestId('progress-tracker');
      await expect(progressTracker).toBeVisible();
      
      // All steps should be visible
      await expect(page.getByTestId('progress-step-preparing')).toBeVisible();
      await expect(page.getByTestId('progress-step-validating')).toBeVisible();
      await expect(page.getByTestId('progress-step-submitting')).toBeVisible();
      await expect(page.getByTestId('progress-step-confirming')).toBeVisible();
    });
  });
});
