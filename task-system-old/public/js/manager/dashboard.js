// public/js/manager/dashboard.js
// Manager-side client logic (assign tasks, review)

const token = localStorage.getItem("token");

let employees = [];
let tasks = [];
let selectedForReview = null;

// Load employees to populate select
async function loadEmployees() {
  const res = await fetch("/api/users/employees", { headers: { "Authorization": `Bearer ${token}` }});
  if (!res.ok) {
    console.warn("Could not load employees");
    return;
  }
  employees = await res.json();
  const sel = document.getElementById("employeeSelect");
  sel.innerHTML = "";
  employees.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e._id || e.id;
    opt.textContent = `${e.firstName} ${e.lastName||''}`;
    sel.appendChild(opt);
  });
}

// Load manager tasks
async function loadTasks() {
  const res = await fetch("/api/tasks/manager", { headers: { "Authorization": `Bearer ${token}` }});
  if (!res.ok) return console.error("Failed to load tasks");
  tasks = await res.json();

  new Tabulator("#taskTable", {
    data: tasks,
    layout: "fitColumns",
    columns: [
      { title: "Title", field: "title" },
      { title: "Employee", field: "assignedTo", formatter: cell => {
          const v = cell.getValue();
          return v ? `${v.firstName} ${v.lastName||''}` : "-";
        }
      },
      { title: "Due", field: "dueDate", formatter: cell => cell.getValue() ? moment(cell.getValue()).format("DD MMM") : "-" },
      { title: "Status", field: "status" },
      {
        title: "Action",
        formatter: (cell) => {
          const row = cell.getRow().getData();
          if (row.status === "completed") return "<button class='btn btn-success btn-sm'>Review</button>";
          return "<button class='btn btn-secondary btn-sm' disabled>Pending</button>";
        },
        cellClick: (e, cell) => {
          const row = cell.getRow().getData();
          if (row.status === "completed") openApproveModal(row);
        }
      }
    ]
  });
}

// Open approve modal
function openApproveModal(task) {
  selectedForReview = task;
  document.getElementById("approveTitle").textContent = task.title;
  document.getElementById("approveDesc").textContent = task.description || "";
  document.getElementById("approveEmployee").textContent = task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName||''}` : "";
  new bootstrap.Modal(document.getElementById("approveModal")).show();
}

// Approve
document.getElementById("approveBtn").addEventListener("click", async () => {
  if (!selectedForReview) return;
  const id = selectedForReview._id || selectedForReview.id;
  const res = await fetch(`/api/tasks/close/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (res.ok) { alert("Task closed"); location.reload(); }
  else alert("Error closing task");
});

// Reject
document.getElementById("rejectBtn").addEventListener("click", async () => {
  if (!selectedForReview) return;
  const id = selectedForReview._id || selectedForReview.id;
  // We don't have explicit reject route in backend earlier — so mark rejected via PATCH or a custom endpoint.
  const res = await fetch(`/api/tasks/reject/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  }).catch(()=>null);

  if (res && res.ok) { alert("Task rejected"); location.reload(); }
  else alert("Reject endpoint not implemented on server");
});

// Assign Task
document.getElementById("assignTaskBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const employeeId = document.getElementById("employeeSelect").value;
  const dueDate = document.getElementById("dueDate").value || null;

  if (!title || !employeeId) return alert("Title और Employee ज़रूरी हैं");

  const res = await fetch("/api/tasks/create", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, employeeId, dueDate })
  });

  const data = await res.json();
  if (res.ok) { alert("Task assigned"); location.reload(); }
  else alert(data.message || "Error assigning task");
});

loadEmployees();
loadTasks();
