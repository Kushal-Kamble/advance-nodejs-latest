// employeeDashboard.js
const tokenEmp = localStorage.getItem('token');
if (!tokenEmp) window.location.href = '/login';

async function loadMyTasks() {
  const res = await fetch('/api/tasks/my-tasks', { headers: { Authorization: `Bearer ${tokenEmp}` }});
  const tasks = await res.json();
  new Tabulator('#employeeTasksTable', {
    data: tasks,
    layout: 'fitColumns',
    columns: [
      { title:'Title', field:'title' },
      { title:'Description', field:'description' },
      { title:'Deadline', field:'deadline' },
      { title:'Status', field:'status' },
      { title:'Attachment', formatter: (cell) => {
          const file = cell.getValue();
          return file ? `<button class="btn btn-sm btn-info previewBtn" data-file="${file}">View</button>` : 'No File';
        }, field:'file'
      },
      { title:'Actions', formatter: (cell) => {
          const row = cell.getRow().getData();
          let html = '';
          if (row.status === 'assigned') html += `<button class="btn btn-sm btn-primary claimBtn" data-id="${row._id}">Claim</button>`;
          if (row.status === 'claimed') html += ` <button class="btn btn-sm btn-success completeBtn" data-id="${row._id}">Complete</button>`;
          return html;
        }}
    ]
  });
}

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('claimBtn')) {
    const id = e.target.dataset.id;
    await fetch(`/api/tasks/${id}/claim`, { method: 'POST', headers: { Authorization: `Bearer ${tokenEmp}` }});
    loadMyTasks();
  }
  if (e.target.classList.contains('completeBtn')) {
    const id = e.target.dataset.id;
    await fetch(`/api/tasks/${id}/complete`, { method: 'POST', headers: { Authorization: `Bearer ${tokenEmp}` }});
    loadMyTasks();
  }
  if (e.target.classList.contains('previewBtn')) {
    const file = e.target.dataset.file;
    document.getElementById('fileFrame').src = `/uploads/${file}`;
    const modalEl = document.getElementById('filePreviewModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
});

loadMyTasks();
