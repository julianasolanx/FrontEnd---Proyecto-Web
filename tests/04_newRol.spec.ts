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
  await page.getByRole('button', { name: 'Roles de proceso ›' }).click();
  await page.getByRole('button', { name: 'Agregar Rol' }).click();
  await page.getByRole('textbox', { name: 'Ej: Administrador TI' }).click();
  await page.getByRole('textbox', { name: 'Ej: Administrador TI' }).fill('Administrador IT');
  await page.getByRole('textbox', { name: 'Indica sus responsabilidades' }).click();
  await page.getByRole('textbox', { name: 'Indica sus responsabilidades' }).fill('encargado de administracion IT de la empresa');
  await page.getByRole('button', { name: 'Guardar Rol' }).click();
  await page.getByRole('textbox', { name: 'Ingrese el nombre...' }).click();
  await page.getByRole('textbox', { name: 'Ingrese el nombre...' }).fill('Administrador');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.waitForTimeout(1000); // ms — usar solo como último recurso 
  await page.getByText('Administrador IT', { exact: false }).first().click();
  await expect(page.locator('app-gestor-roles').first()).toContainText('encargado de administracion IT de la empresa');
  await page.locator('div').filter({ hasText: 'encargado de administracion' }).nth(1).click();
  await page.getByText('Administrador IT', { exact: false }).first().click();
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('encargado de administracion IT de la empresa y sus dispositivos');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await page.waitForTimeout(1000); // ms — usar solo como último recurso 
  await page.getByText('Administrador IT', { exact: false }).first().click();
  await expect(page.locator('app-gestor-roles')).toContainText('encargado de administracion IT de la empresa y sus dispositivos');
  await page.locator('div').filter({ hasText: 'encargado de administracion' }).nth(1).click();
  await page.getByRole('button', { name: '⤺' }).click();
});
