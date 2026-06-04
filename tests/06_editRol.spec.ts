import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su correo electrónico' }).fill('correotest4@email.com');
  await page.getByRole('textbox', { name: 'Ingrese su contraseña' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su contraseña' }).fill('123456');
  await page.getByRole('button', { name: 'iniciar sesión' }).click();
  await page.getByRole('button', { name: 'Roles de proceso ›' }).click();
  await page.getByText('Administrador IT', { exact: false }).first().click();
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('encargado de administracion IT de la empresa y dispositivos');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await page.getByText('Administrador IT', { exact: false }).first().click();
  await expect(page.getByText('encargado de administracion')).toBeVisible();
});

