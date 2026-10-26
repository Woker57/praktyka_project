const form = document.querySelector('#login-form');
const message = document.querySelector('#form-message');

function showMessage(text) {
  message.textContent = text;
  message.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = form.elements.email.value.trim().toLowerCase();
  if (!email) {
    form.reportValidity();
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  message.hidden = true;
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('API zwróciło błąd ' + response.status + '.');
    const users = await response.json();
    const user = users.find((item) => item.email.toLowerCase() === email);
    if (!user) {
      showMessage('Nie znaleziono tego adresu w bazie. Spróbuj anna@example.com.');
      return;
    }
    sessionStorage.setItem('zadaniowo-user', JSON.stringify({
      id: user.id, login: user.login, email: user.email
    }));
    window.location.href = 'tasks.html';
  } catch (error) {
    showMessage('Nie można połączyć się z API. Otwórz stronę przez http://localhost:5113/. ' + error.message);
  } finally {
    button.disabled = false;
  }
});
