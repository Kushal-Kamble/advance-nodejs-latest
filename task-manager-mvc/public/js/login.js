// login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: document.getElementById('email').value, password: document.getElementById('password').value })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    // redirect based on role
    if (data.role === 'admin') window.location.href = '/admin/dashboard';
    else if (data.role === 'manager') window.location.href = '/manager/dashboard';
    else window.location.href = '/employee/dashboard';
  } else {
    alert(data.message || 'Login failed');
  }
});
