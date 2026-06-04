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
  await page.getByRole('button', { name: 'Usuarios ›' }).click();
  await page.getByRole('combobox').selectOption('EDITOR');
  //await expect(page.locator('tbody')).toContainText('Administrador');
  await page.getByRole('textbox', { name: 'Ingrese el correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Ingrese el correo electrónico' }).fill('empleadotest2@email.com');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Invitar' }).click();
  await page.getByRole('button', { name: '⤺' }).click();
});
