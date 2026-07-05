document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const rememberMe = document.getElementById('rememberMe').checked;

  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const statusMsg = document.getElementById('loginStatus');

  emailError.textContent = '';
  passwordError.textContent = '';
  statusMsg.textContent = '';

  let isValid = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailError.textContent = 'Enter a valid email address';
    isValid = false;
  }

  if (password.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters';
    isValid = false;
  }

  if (!isValid) return;

  const currentUser = {
    email: email,
    name: email.split('@')[0],
    loggedInAt: new Date().toISOString()
  };

  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true');
  } else {
    localStorage.removeItem('rememberMe');
  }

  statusMsg.style.color = '#188038';
  statusMsg.textContent = 'Login successful! Redirecting...';

  setTimeout(() => {
    window.location.href = 'inbox.html';
  }, 800);
});

window.addEventListener('DOMContentLoaded', () => {
  const remembered = localStorage.getItem('rememberMe');
  const user = localStorage.getItem('currentUser');
  if (remembered === 'true' && user) {
    window.location.href = 'inbox.html';
  }
});

function logoutUser() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('rememberMe');
  window.location.href = 'index.html';
}