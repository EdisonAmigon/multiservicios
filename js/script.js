// Reemplaza esta URL por la de tu Google Apps Script Web App (ver apps-script/Code.gs)
const SCRIPT_URL = 'PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT';

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('lead-form');
const status = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

const phonePattern = /^[0-9+()\-\s]{7,20}$/;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = '';
  status.className = 'form-status';

  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const telefono = form.telefono.value.trim();

  if (!nombre || !correo || !telefono) {
    showStatus('Por favor completa todos los campos.', 'error');
    return;
  }

  if (!phonePattern.test(telefono)) {
    showStatus('Ingresa un número telefónico válido.', 'error');
    return;
  }

  if (SCRIPT_URL.includes('PEGA_AQUI')) {
    showStatus('Falta configurar la URL de Google Apps Script en js/script.js.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    // Content-Type text/plain evita el preflight CORS que Apps Script no maneja.
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ nombre, correo, telefono }),
    });

    showStatus('¡Gracias! Hemos recibido tus datos.', 'success');
    form.reset();
  } catch (err) {
    showStatus('Ocurrió un error al enviar. Intenta de nuevo.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar';
  }
});

function showStatus(message, type) {
  status.textContent = message;
  status.className = `form-status ${type}`;
}
