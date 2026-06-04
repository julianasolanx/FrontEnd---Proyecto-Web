import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
      await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su correo electrónico' }).fill('correotest4@email.com');
  await page.getByRole('textbox', { name: 'Ingrese su contraseña' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su contraseña' }).fill('123456');
  await page.getByRole('button', { name: 'iniciar sesión' }).click();
  await expect(page.getByRole('heading')).toContainText('Visor de procesos empresariales');
  await page.getByRole('button', { name: 'Procesos ›' }).click();
  //await page.locator('*').filter({ hasText: /^Ver diagrama/ }).first().click();
  await page.waitForTimeout(1000); // ms — usar solo como último recurso 
  await page.getByRole('button', { name: 'Ver diagrama' }).first().click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {});
  });
  try {
    await page.getByRole('button', { name: '🗑 Limpiar todo' }).click({ timeout: 3000 });
  } catch {
    console.log('Botón "Limpiar todo" no disponible, continuando...');
  }
  await page.getByRole('button', { name: '← Volver' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {});
  });
    await page.waitForTimeout(1000); // ms — usar solo como último recurso 
  await page.getByRole('button', { name: 'Eliminar' }).first().click();
  await page.getByRole('button', { name: '← Volver' }).click();
});
