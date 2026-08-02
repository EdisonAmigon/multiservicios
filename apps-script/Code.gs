// Pega este código en Extensiones > Apps Script de tu Google Sheet, y despliégalo
// como aplicación web (ver instrucciones al final del archivo).

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const data = JSON.parse(e.postData.contents);

  const nombre = (data.nombre || '').toString().trim();
  const correo = (data.correo || '').toString().trim();
  const telefono = (data.telefono || '').toString().trim();

  if (!nombre || !correo || !telefono) {
    return respond({ ok: false, error: 'Faltan campos requeridos.' });
  }

  ensureHeader(sheet);

  // La comilla inicial fuerza a Sheets a guardar el teléfono como texto,
  // evitando que interprete el "+" inicial como el comienzo de una fórmula.
  sheet.appendRow([new Date(), nombre, correo, "'" + telefono]);

  return respond({ ok: true });
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
