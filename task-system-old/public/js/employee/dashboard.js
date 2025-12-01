// public/js/employee/dashboard.js
// सारे client-side actions (fetch APIs) हिन्दी कमेंट्स के साथ

// token header helper
const token = localStorage.getItem("token");
const headersWithToken = () => ({ "Authorization": `Bearer ${token}`, "Content-Type": "application/json" });

let selectedTask = null;

// Tabulator init after fetching tasks
async function loadTasks() {
  const res = await fetch("/api/tasks/employee", { headers: { "Authorization": `Bearer ${token}` } });
  if (!res.ok) {
    console.error("Failed to load tasks");
    return;
  }
  const tasks = await res.json();

  // Tabulator Table
  new Tabulator("#taskTable", {
    data: tasks,
    layout: "fitColumns",
    columns: [
      { title: "Title", field: "title" },
      { title: "Assigned By", field: "assignedBy", formatter: cell => {
          const v = cell.getValue();
          return v?.firstName ? `${v.firstName} ${v.lastName||''}` : "-";
        }
      },
      { title: "Due", field: "dueDate", formatter: cell => {
          const val = cell.getValue();
          return val ? moment(val).format("DD MMM, YYYY") : "-";
        }
      },
      { title: "Status", field: "status", hozAlign: "center" },
      {
        title: "Action",
        formatter: () => "<button class='btn btn-sm btn-primary'>Open</button>",
        cellClick: (e, cell) => openTaskModal(cell.getRow().getData())
      }
    ]
  });
}

// modal open
function openTaskModal(task) {
  selectedTask = task;
  document.getElementById("modalTitle").textContent = task.title;
  document.getElementById("modalDescription").textContent = task.description || "No description";
  document.getElementById("modalDue").textContent = task.dueDate ? moment(task.dueDate).format("DD MMM, YYYY") : "N/A";
  document.getElementById("modalStatus").textContent = task.status;

  // show/hide claim/upload depending on status
  document.getElementById("claimSection").style.display = task.status === "assigned" ? "block" : "none";
  document.getElementById("uploadSection").style.display = task.status === "claimed" ? "block" : "none";

  new bootstrap.Modal(document.getElementById("taskModal")).show();
}

// Claim
document.getElementById("claimBtn").addEventListener("click", async () => {
  if (!selectedTask) return;
  const res = await fetch(`/api/tasks/claim/${selectedTask._id || selectedTask.id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (res.ok) { alert("Task Claimed"); location.reload(); }
  else alert("Error claiming");
});

// Upload & mark completed
document.getElementById("uploadBtn").addEventListener("click", async () => {
  if (!selectedTask) return;
  const files = document.getElementById("taskFiles").files;
  if (!files.length) return alert("Select files to upload");

  const form = new FormData();
  [...files].forEach(f => form.append("attachments", f));

  const res = await fetch(`/api/tasks/complete/${selectedTask._id || selectedTask.id}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: form
  });
  if (res.ok) { alert("Task marked completed"); location.reload(); }
  else {
    const err = await res.json().catch(()=>({}));
    alert(err.message || "Upload error");
  }
});

// initial load
loadTasks();
