// Reemplaza esta URL por la de tu Google Apps Script Web App (ver apps-script/Code.gs)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfsObhTa5Ur1My-uo9QOlYOM4pmzFvQs0E54IHFVvLnuN2CieQj_7-Eoo3QeyGCottqw/exec';

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('lead-form');
const status = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

const phonePattern = /^[0-9()\-\s]{7,15}$/;
const DEFAULT_BTN_TEXT = submitBtn.textContent;

// 'idle' = listo para enviar | 'sending' = enviando | 'sent' = ya se envió,
// bloqueado hasta que el usuario modifique algún campo.
let submitState = 'idle';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitState === 'sending') return;

  status.textContent = '';
  status.className = 'form-status';

  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const lada = form.lada.value;
  const numero = form.telefono.value.trim();
  const telefono = `${lada} ${numero}`;

  if (!nombre || !numero) {
    showStatus('Por favor completa nombre y número telefónico.', 'error');
    return;
  }

  if (!phonePattern.test(numero)) {
    showStatus('Ingresa un número telefónico válido.', 'error');
    return;
  }

  if (SCRIPT_URL.includes('PEGA_AQUI')) {
    showStatus('Falta configurar la URL de Google Apps Script en js/script.js.', 'error');
    return;
  }

  submitState = 'sending';
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

    showStatus('Recibirás un mensaje de WhatsApp en seguida, verifica tu número.', 'success');
    // No se limpia el formulario: el usuario debe poder ver su número
    // en pantalla mientras confirma que le llegó el mensaje de WhatsApp.
    // El botón se queda deshabilitado para evitar mandar el mismo registro
    // dos veces sin recargar la página; se reactiva solo si el usuario
    // cambia algún campo (ver reenableIfSent más abajo).
    submitState = 'sent';
    submitBtn.textContent = 'Registro enviado ✓';
  } catch (err) {
    showStatus('Ocurrió un error al enviar. Intenta de nuevo.', 'error');
    submitState = 'idle';
    submitBtn.disabled = false;
    submitBtn.textContent = DEFAULT_BTN_TEXT;
  }
});

// Si el usuario edita algún campo después de un envío exitoso, asumimos que
// quiere corregir o volver a registrar con datos distintos, y desbloqueamos
// el botón.
form.addEventListener('input', reenableIfSent);
form.addEventListener('change', reenableIfSent);

function reenableIfSent() {
  if (submitState === 'sent') {
    submitState = 'idle';
    submitBtn.disabled = false;
    submitBtn.textContent = DEFAULT_BTN_TEXT;
  }
}

function showStatus(message, type) {
  status.textContent = message;
  status.className = `form-status ${type}`;
}
