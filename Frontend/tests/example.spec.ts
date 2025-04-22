import { test, expect } from '@playwright/test';

test('login como admin exitoso', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('tab', { name: /administrador/i }).click();
  await page.waitForSelector('#admin-username');

  await page.locator('#admin-username').fill('ximena');
  await expect(page.locator('#admin-username')).toHaveValue('ximena');
  await page.locator('#admin-password').fill('ximena');
  await expect(page.locator('#admin-password')).toHaveValue('ximena');

  const [response] = await Promise.all([
    page.waitForResponse((resp) =>
      resp.url().endsWith('/api/auth/login/') && resp.request().method() === 'POST'
    ),
    page.getByRole('button', { name: /iniciar sesión/i }).click(),
  ]);

  expect(response.status()).toBe(200);
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

});