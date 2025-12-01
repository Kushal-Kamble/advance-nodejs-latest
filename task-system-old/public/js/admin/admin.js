// public/js/admin/admin.js
// Admin dashboard small script — fetch stats and render Chart.js

const token = localStorage.getItem("token");

async function loadAdminStats() {
  const res = await fetch("/api/admin/dashboard", { headers: { "Authorization": `Bearer ${token}` } });
  if (!res.ok) return console.error("Admin stats failed");
  const data = await res.json();

  // Render top numbers if you have HTML placeholders, else log
  console.log("Admin stats:", data.stats);

  // Example: create task status chart using Chart.js if included in view
  if (window.Chart && document.getElementById("taskStatusChart")) {
    const ctx = document.getElementById("taskStatusChart").getContext("2d");
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed','Pending','InProgress'],
        datasets: [{
          data: [data.stats.completed, data.stats.pending, Math.max(0, data.stats.totalTasks - (data.stats.completed + data.stats.pending))],
        }]
      }
    });
  }
}

loadAdminStats();
