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
  await page.waitForTimeout(1000); // ms — usar solo como último recurso 
  await page.getByRole('button', { name: 'Editar' }).first().click();
  await page.waitForTimeout(1000); // ms — usar solo como último recurso 
  await page.getByRole('textbox', { name: 'Describe brevemente el' }).dblclick()//.click(); 
  await page.getByRole('textbox', { name: 'Describe brevemente el' }).fill('revicion de dispositivos en oficina 1 y 2');
  await page.waitForTimeout(1000); // ms — usar solo como último recurso 
  await page.getByText('Nombre del ProcesoCategorí').click();
  await page.getByRole('button', { name: 'Actualizar Cambios' }).click();
  await page.waitForTimeout(1000); // ms — usar solo como último recurso  
  await expect(page.getByRole('paragraph').first()).toContainText('revicion de dispositivos en oficina 1 y 2');
  await page.getByRole('button', { name: '← Volver' }).click();
});