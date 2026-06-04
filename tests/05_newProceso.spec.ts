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
  await page.getByRole('button', { name: '+ Agregar Proceso' }).click();
  await page.getByRole('textbox', { name: 'Ej: Contratación de personal' }).click();
  await page.getByRole('textbox', { name: 'Ej: Contratación de personal' }).fill('ProcesoTest1');
  await page.getByRole('textbox', { name: 'Ej: Recursos Humanos' }).click();
  await page.getByRole('textbox', { name: 'Ej: Recursos Humanos' }).fill('IT');
  await page.getByRole('textbox', { name: 'Describe brevemente el' }).click();
  await page.getByRole('textbox', { name: 'Describe brevemente el' }).fill('revicion de dispositivos en oficina 1');
  await page.getByRole('combobox').selectOption('PUBLICADO');
  await page.getByRole('button', { name: 'Crear Proceso' }).click();
  //await expect(page.locator('h2')).toContainText('ProcesoTest1');
  await page.waitForTimeout(1000); // ms — usar solo como último recurso 
  await page.getByRole('button', { name: 'Ver diagrama' }).first().click();
  await page.getByRole('button', { name: '＋ Actividad' }).click();
  await page.getByRole('textbox', { name: 'Nombre de la actividad' }).click();
  await page.getByRole('textbox', { name: 'Nombre de la actividad' }).fill('revizar dispositivo 1');
  await page.getByRole('textbox', { name: 'Descripción opcional' }).click();
  await page.getByRole('textbox', { name: 'Descripción opcional' }).fill('revizar');
  await page.getByRole('combobox').nth(3).selectOption({ index: 1 });         //await page.getByRole('combobox').nth(3).selectOption('1:52');
  await page.getByRole('button', { name: 'Agregar' }).click();
  await page.getByRole('button', { name: '＋ Actividad' }).click();
  await page.getByRole('textbox', { name: 'Nombre de la actividad' }).click();
  await page.getByRole('textbox', { name: 'Nombre de la actividad' }).fill('revizar equipo 2');
  await page.getByRole('textbox', { name: 'Descripción opcional' }).click();
  await page.getByRole('textbox', { name: 'Descripción opcional' }).fill('revizar');
  await page.getByRole('combobox').nth(3).selectOption({ index: 1 });           //await page.getByRole('combobox').nth(3).selectOption('1: 52');
  await page.getByRole('button', { name: 'Agregar' }).click();
  await page.getByRole('combobox').first().selectOption({ index: 1 });
  await page.getByRole('combobox').nth(1).selectOption({ index: 2 });
  await page.getByRole('textbox', { name: 'Condición (opcional)' }).click();
  await page.getByRole('textbox', { name: 'Condición (opcional)' }).fill('luego');
  await page.getByRole('button', { name: 'Crear arco' }).click();
  await expect(page.getByRole('img')).toContainText('luego');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: '💾 Guardar diseño' }).click();
  await page.getByRole('button', { name: '← Volver' }).click();

});
