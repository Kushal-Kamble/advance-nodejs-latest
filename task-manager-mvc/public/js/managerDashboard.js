// managerDashboard.js
const token = localStorage.getItem('token');
if (!token) window.location.href = '/login';

async function loadEmployees() {
  const res = await fetch('/api/users/employees', { headers: { Authorization: `Bearer ${token}` }});
  const data = await res.json();
  new Tabulator('#employeeTable', { data, layout: 'fitColumns', columns: [{ title:'Name', field:'name'}, {title:'Email', field:'email'}] });
}

async function loadTasks() {
  const res = await fetch('/api/tasks/assigned', { headers: { Authorization: `Bearer ${token}` }});
  const data = await res.json();
  new Tabulator('#taskTable', { data, layout: 'fitColumns', columns: [{title:'Title', field:'title'}, {title:'AssignedTo', field:'assignedTo.name'}, {title:'Status', field:'status'}] });
}

// Add employee
document.getElementById('saveEmployee')?.addEventListener('click', async () => {
  const payload = { name: document.getElementById('empName').value, email: document.getElementById('empEmail').value, password: document.getElementById('empPassword').value };
  const res = await fetch('/api/users/create-employee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  alert(data.message || 'Employee created');
  loadEmployees();
});

loadEmployees();
loadTasks();
