import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'Large', width: 1920, height: 1080 },
];

test.describe('SI Upload Zone Visual Tests', () => {
  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/si-upload');
        await page.waitForLoadState('networkidle');
      });

      test('verify page background color', async ({ page }) => {
        const body = page.locator('body');
        const bgColor = await body.evaluate((el) =>
          window.getComputedStyle(el).backgroundColor
        );
        // #000000 = rgb(0, 0, 0)
        expect(bgColor).toBe('rgb(0, 0, 0)');
      });

      test('verify upload zone background color', async ({ page }) => {
        const uploadZone = page.getByTestId('si-upload-zone');
        const bgColor = await uploadZone.evaluate((el) =>
          window.getComputedStyle(el).backgroundColor
        );
        // #18181b = rgb(24, 24, 27)
        expect(bgColor).toBe('rgb(24, 24, 27)');
      });

      test('verify upload zone border style', async ({ page }) => {
        const uploadZone = page.getByTestId('si-upload-zone');
        const borderStyle = await uploadZone.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            borderStyle: styles.borderStyle,
            borderWidth: styles.borderWidth,
          };
        });
        
        expect(borderStyle.borderStyle).toBe('dashed');
        expect(borderStyle.borderWidth).toBe('2px');
      });

      test('verify upload zone padding', async ({ page }) => {
        const uploadZone = page.getByTestId('si-upload-zone');
        const padding = await uploadZone.evaluate((el) =>
          window.getComputedStyle(el).padding
        );
        // p-12 = 48px (3rem)
        expect(padding).toBe('48px');
      });

      test('verify title color', async ({ page }) => {
        const title = page.getByTestId('si-upload-title');
        const color = await title.evaluate((el) =>
          window.getComputedStyle(el).color
        );
        // #22d3ee = rgb(34, 211, 238)
        expect(color).toBe('rgb(34, 211, 238)');
      });

      test('verify title font size', async ({ page }) => {
        const title = page.getByTestId('si-upload-title');
        const fontSize = await title.evaluate((el) =>
          window.getComputedStyle(el).fontSize
        );
        // text-3xl = 1.875rem = 30px
        expect(fontSize).toBe('30px');
      });

      test('verify title text shadow (glow effect)', async ({ page }) => {
        const title = page.getByTestId('si-upload-title');
        const textShadow = await title.evaluate((el) =>
          window.getComputedStyle(el).textShadow
        );
        // Should have a glow effect
        expect(textShadow).toContain('rgba(34, 211, 238');
      });

      test('verify upload instructions visibility', async ({ page }) => {
        const description = page.getByTestId('si-upload-description');
        await expect(description).toBeVisible();
        
        const color = await description.evaluate((el) =>
          window.getComputedStyle(el).color
        );
        // #fafafa = rgb(250, 250, 250)
        expect(color).toBe('rgb(250, 250, 250)');
      });

      test('verify upload icon is visible', async ({ page }) => {
        const uploadZone = page.getByTestId('si-upload-zone');
        const svg = uploadZone.locator('svg').first();
        await expect(svg).toBeVisible();
        
        const color = await svg.evaluate((el) =>
          window.getComputedStyle(el).color
        );
        // Icon should be cyan
        expect(color).toBe('rgb(34, 211, 238)');
      });

      test('verify responsive layout', async ({ page }) => {
        const container = page.locator('[data-testid="si-upload-page"] > div');
        const maxWidth = await container.evaluate((el) =>
          window.getComputedStyle(el).maxWidth
        );
        
        // max-w-4xl = 56rem = 896px
        expect(maxWidth).toBe('896px');
      });

      test('verify spacing consistency', async ({ page }) => {
        const container = page.locator('[data-testid="si-upload-page"] > div');
        const marginBottom = await container.locator('> div').first().evaluate((el) =>
          window.getComputedStyle(el).marginBottom
        );
        
        // mb-8 = 2rem = 32px
        expect(marginBottom).toBe('32px');
      });

      test('verify help section styling', async ({ page }) => {
        const helpSection = page.locator('text=Need Help?').locator('..');
        await expect(helpSection).toBeVisible();
        
        const bgColor = await helpSection.evaluate((el) =>
          window.getComputedStyle(el).backgroundColor
        );
        expect(bgColor).toBe('rgb(24, 24, 27)');
      });

      test('verify file requirements text color', async ({ page }) => {
        const requirements = page.locator('text=Accepted format');
        const color = await requirements.evaluate((el) =>
          window.getComputedStyle(el).color
        );
        // #a1a1aa = rgb(161, 161, 170)
        expect(color).toBe('rgb(161, 161, 170)');
      });
    });
  }

  test.describe('Interaction States', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/si-upload');
      await page.waitForLoadState('networkidle');
    });

    test('verify hover state on upload zone', async ({ page }) => {
      const uploadZone = page.getByTestId('si-upload-zone');
      
      // Get initial state
      const initialBorder = await uploadZone.evaluate((el) =>
        window.getComputedStyle(el).borderColor
      );
      
      // Hover over the zone
      await uploadZone.hover();
      
      // Wait for transition
      await page.waitForTimeout(100);
      
      const hoverBorder = await uploadZone.evaluate((el) =>
        window.getComputedStyle(el).borderColor
      );
      
      // Border color should change on hover (becomes less transparent)
      expect(hoverBorder).not.toBe(initialBorder);
    });

    test('verify upload zone is keyboard accessible', async ({ page }) => {
      const uploadZone = page.getByTestId('si-upload-zone');
      
      // Upload zone should be focusable
      await uploadZone.focus();
      const isFocused = await uploadZone.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBe(true);
    });
  });

  test.describe('Visual Regression - Upload Flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/si-upload');
      await page.waitForLoadState('networkidle');
    });

    test('verify complete page renders correctly', async ({ page }) => {
      // Verify all key elements are present and visible
      await expect(page.getByTestId('si-upload-title')).toBeVisible();
      await expect(page.getByTestId('si-upload-zone')).toBeVisible();
      await expect(page.getByText('Need Help?')).toBeVisible();
    });

    test('verify typography hierarchy', async ({ page }) => {
      const title = page.getByTestId('si-upload-title');
      const description = page.getByText(/upload your si pdf/i);
      
      const titleSize = await title.evaluate((el) =>
        parseInt(window.getComputedStyle(el).fontSize)
      );
      const descSize = await description.evaluate((el) =>
        parseInt(window.getComputedStyle(el).fontSize)
      );
      
      // Title should be larger than description
      expect(titleSize).toBeGreaterThan(descSize);
    });

    test('verify color contrast for accessibility', async ({ page }) => {
      // Check that text colors provide sufficient contrast
      const title = page.getByTestId('si-upload-title');
      const bgColor = await page.locator('body').evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );
      
      expect(bgColor).toBe('rgb(0, 0, 0)'); // Dark background
      
      const titleColor = await title.evaluate((el) =>
        window.getComputedStyle(el).color
      );
      
      expect(titleColor).toBe('rgb(34, 211, 238)'); // Bright cyan for contrast
    });
  });
});
