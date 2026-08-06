// Pega este código en Extensiones > Apps Script de tu Google Sheet, y despliégalo
// como aplicación web (ver instrucciones al final del archivo).

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const data = JSON.parse(e.postData.contents);

  const nombre = (data.nombre || '').toString().trim();
  const correo = (data.correo || '').toString().trim();
  const telefono = (data.telefono || '').toString().trim();

  // El correo es opcional: solo nombre y teléfono son obligatorios.
  if (!nombre || !telefono) {
    return respond({ ok: false, error: 'Faltan campos requeridos.' });
  }

  ensureHeader(sheet);

  if (isDuplicate(sheet, nombre, telefono)) {
    return respond({ ok: false, error: 'Este registro ya fue enviado hace poco.' });
  }

  const row = sheet.getLastRow() + 1;

  // Fijamos la columna D (Teléfono) como texto plano ANTES de escribir el valor.
  // El flush() obliga a Sheets a aplicar el formato de inmediato: sin esto,
  // Apps Script a veces agrupa el cambio de formato y la escritura del valor,
  // y el "+" inicial se sigue interpretando como el comienzo de una fórmula
  // (lo que produce el "#ERROR!").
  sheet.getRange(row, 4).setNumberFormat('@');
  SpreadsheetApp.flush();
  sheet.getRange(row, 1, 1, 4).setValues([[new Date(), nombre, correo, telefono]]);

  return respond({ ok: true });
}

// Revisa las últimas DUPLICATE_CHECK_ROWS filas y rechaza el registro si
// encuentra el mismo nombre + teléfono ya guardado en los últimos
// DUPLICATE_WINDOW_MINUTES minutos. Evita copias exactas por doble envío
// (recarga de página, dos pestañas, etc.) sin bloquear a alguien que
// legítimamente vuelve a escribir más tarde.
function isDuplicate(sheet, nombre, telefono) {
  // Ventana de tiempo (minutos) y cantidad de filas recientes que se revisan.
  // Declaradas aquí adentro (y no arriba del archivo) para que nunca se
  // pierdan si en el futuro se copia solo una parte del código.
  const DUPLICATE_WINDOW_MINUTES = 10;
  const DUPLICATE_CHECK_ROWS = 50;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false; // solo hay encabezado o está vacía

  const firstRowToCheck = Math.max(2, lastRow - DUPLICATE_CHECK_ROWS + 1);
  const numRows = lastRow - firstRowToCheck + 1;
  const values = sheet.getRange(firstRowToCheck, 1, numRows, 4).getValues();

  const now = new Date();
  const cutoffMs = DUPLICATE_WINDOW_MINUTES * 60 * 1000;
  const nombreNorm = nombre.toLowerCase();
  const telefonoNorm = telefono.replace(/\s+/g, '');

  for (let i = 0; i < values.length; i++) {
    const fila = values[i];
    const fecha = fila[0];
    if (!(fecha instanceof Date)) continue;
    if (now.getTime() - fecha.getTime() > cutoffMs) continue;

    const filaNombreNorm = (fila[1] || '').toString().trim().toLowerCase();
    const filaTelefonoNorm = (fila[3] || '').toString().replace(/\s+/g, '');

    if (filaNombreNorm === nombreNorm && filaTelefonoNorm === telefonoNorm) {
      return true;
    }
  }

  return false;
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha', 'Nombre completo', 'Correo', 'Teléfono']);
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función de prueba: selecciónala en el desplegable de funciones (arriba del
// editor, junto al botón ▷ Ejecutar) y dale a Ejecutar. Simula un envío del
// formulario sin necesidad de usar el sitio real ni volver a desplegar.
// El resultado (éxito o el error completo) aparece en el panel de abajo,
// "Registro de ejecución".
function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        nombre: 'Prueba Debug',
        correo: 'prueba@ejemplo.com',
        telefono: '+52 5551234567'
      })
    }
  };
  const resultado = doPost(fakeEvent);
  Logger.log(resultado.getContent());
}

/*
INSTRUCCIONES PARA DESPLEGAR:

1. Crea (o abre) una Google Sheet donde quieres guardar los registros.
2. Ve a Extensiones > Apps Script.
3. Borra el contenido por defecto y pega todo este archivo.
4. Guarda el proyecto (icono de disco).
5. Haz clic en "Implementar" > "Nueva implementación".
6. En "Tipo", elige "Aplicación web".
7. Configura:
   - Ejecutar como: Yo (tu cuenta)
   - Quién tiene acceso: Cualquier usuario
8. Haz clic en "Implementar" y autoriza los permisos que pida Google.
9. Copia la URL de la aplicación web (termina en /exec).
10. Pega esa URL en js/script.js, en la constante SCRIPT_URL.

Cada vez que cambies el código del script, debes crear una "Nueva implementación"
(o gestionar implementaciones y actualizar la existente) para que los cambios
se reflejen en la URL publicada.
*/
