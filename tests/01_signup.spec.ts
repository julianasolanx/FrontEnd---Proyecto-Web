import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  //await page.getByRole('button', { name: 'Advanced' }).click();
  //await page.getByRole('link', { name: 'Proceed to grupo22.inphotech.' }).click();
  await page.getByRole('button', { name: 'Registrar empresa' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su nombre' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su nombre' }).fill('Jefe');
  await page.getByRole('textbox', { name: 'Ingrese el correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Ingrese el correo electrónico' }).fill('correotest4@email.com');
  await page.getByRole('textbox', { name: 'Ingrese la contraseña (mín. 6' }).click();
  await page.getByRole('textbox', { name: 'Ingrese la contraseña (mín. 6' }).fill('123456');
  await page.getByRole('textbox', { name: 'Ingrese el nombre de la' }).click();
  await page.getByRole('textbox', { name: 'Ingrese el nombre de la' }).fill('Empresa Test 1');
  await page.getByRole('textbox', { name: 'Ingrese el correo de la' }).click();
  await page.getByRole('textbox', { name: 'Ingrese el correo de la' }).fill('correoconttest4@email.com');
  await page.getByRole('textbox', { name: 'Ingrese el NIT' }).click();
  await page.getByRole('textbox', { name: 'Ingrese el NIT' }).fill('121214');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'registrar empresa' }).click();
  await page.getByRole('button', { name: '⎋' }).click();
});
