// taskCreate.js - drag & drop & submit
const tokenTask = localStorage.getItem('token');
if (!tokenTask) window.location.href = '/login';

let fileData = null;
const dropArea = document.getElementById('dropArea');
const hiddenFile = document.getElementById('hiddenFile');

// load employees
async function loadEmployeesForAssign() {
  const res = await fetch('/api/users/employees', { headers: { Authorization: `Bearer ${tokenTask}` }});
  const data = await res.json();
  const sel = document.getElementById('employeeSelect');
  sel.innerHTML = '';
  data.forEach(emp => {
    sel.innerHTML += `<option value="${emp._id}">${emp.name}</option>`;
  });
}
loadEmployeesForAssign();

// drag & drop
;['dragenter','dragover'].forEach(ev=> dropArea.addEventListener(ev, e => { e.preventDefault(); dropArea.classList.add('active'); }));
;['dragleave','drop'].forEach(ev=> dropArea.addEventListener(ev, e => { e.preventDefault(); dropArea.classList.remove('active'); }));
dropArea.addEventListener('drop', (e) => { e.preventDefault(); fileData = e.dataTransfer.files[0]; dropArea.textContent = 'Uploaded: ' + fileData.name; });
dropArea.addEventListener('click', () => hiddenFile.click());
hiddenFile.addEventListener('change', (e) => { fileData = e.target.files[0]; dropArea.textContent = 'Uploaded: ' + fileData.name; });

// submit
document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData();
  fd.append('title', document.getElementById('title').value);
  fd.append('description', document.getElementById('description').value);
  fd.append('deadline', document.getElementById('deadline').value);
  fd.append('assignedTo', document.getElementById('employeeSelect').value);
  if (fileData) fd.append('file', fileData);

  const res = await fetch('/api/tasks', { method: 'POST', headers: { Authorization: `Bearer ${tokenTask}` }, body: fd });
  const data = await res.json();
  if (res.ok) { alert('Task created'); window.location.href = '/manager/dashboard'; }
  else alert(data.message || 'Error');
});
