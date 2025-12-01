// public/js/script.js - Frontend JavaScript for Dashboard interactions

// ============================================
// DOCUMENT READY - Jab page load ho jaye tab ye code chalega
// ============================================
$(document).ready(function () {
  // User ID extract karte hain hidden input se
  const user_id = $("input[name=user_id]").val(); // User ka ID jo form me hidden field me hai
  
  console.log('📱 Dashboard JavaScript loaded for user:', user_id);

  // ============================================
  // FUNCTION: LOAD ALL TASKS
  // ============================================
  // Ye function user ke saare tasks fetch karke display karega
  function loadTasks() {
    console.log('🔄 Loading tasks...');
    
    // AJAX GET request bhejte hain tasks fetch karne ke liye
    $.get("/tasks/get?user_id=" + user_id, function (data) {
      // data me tasks array aayega
      const tasks = data; // Tasks array
      console.log(`✅ Loaded ${tasks.length} tasks`);
      
      let html = ""; // HTML string banayenge tasks ke liye

      // Agar koi task nahi hai to empty message dikhayenge
      if (tasks.length === 0) {
        html = `
          <div class="col-12 text-center py-5">
            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No tasks yet! Click "Add Task" to create one.</h5>
          </div>
        `;
      } else {
        // Har task ke liye card banate hain
        tasks.forEach(task => {
          // Priority ke according badge color decide karte hain
          const priorityBadge = task.priority === 'High' ? 'danger' : 
                               task.priority === 'Medium' ? 'warning' : 
                               'success';
          
          // Status check karte hain
          const statusText = task.completed ? '✅ Completed' : '❌ Pending';
          const statusClass = task.completed ? 'text-success' : 'text-danger';
          
          // Date format karte hain
          const startDate = new Date(task.start_date).toLocaleDateString();
          const deadline = new Date(task.deadline).toLocaleDateString();
          
          // Task card HTML banate hain
          html += `
            <div class="col-md-4 mb-3">
              <div class="card shadow-sm h-100">
                <div class="card-body d-flex flex-column">
                  <!-- Task Title aur Priority Badge -->
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="mb-0">${task.title}</h5>
                    <span class="badge bg-${priorityBadge}">${task.priority}</span>
                  </div>
                  
                  <!-- Task Description -->
                  <p class="text-muted small mb-2">${task.description || 'No description'}</p>
                  
                  <!-- Dates -->
                  <div class="small mb-2">
                    <strong>📅 Start:</strong> ${startDate}<br>
                    <strong>⏰ Deadline:</strong> ${deadline}
                  </div>
                  
                  <!-- Status -->
                  <p class="mb-3"><strong>Status:</strong> <span class="${statusClass}">${statusText}</span></p>
                  
                  <!-- Action Buttons -->
                  <div class="mt-auto d-flex gap-2 flex-wrap">
                    ${!task.completed ? `
                      <button class="btn btn-sm btn-outline-success completeBtn" data-id="${task._id}">
                        <span class="spinner-border spinner-border-sm d-none me-1" role="status"></span>
                        <i class="fas fa-check"></i> Complete
                      </button>
                    ` : ''}
                    <button class="btn btn-sm btn-outline-primary editBtn" data-task='${JSON.stringify(task).replace(/'/g, "&apos;")}'>
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger deleteBtn" data-id="${task._id}">
                      <span class="spinner-border spinner-border-sm d-none me-1" role="status"></span>
                      <i class="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      }

      // Tasks ko page pe display karte hain
      $("#taskList").html(html);
    }).fail(function(error) {
      console.error('❌ Error loading tasks:', error);
      Toastify({
        text: "❌ Failed to load tasks. Please refresh the page.",
        duration: 3000,
        backgroundColor: "#dc3545"
      }).showToast();
    });
  }

  // ============================================
  // FUNCTION: UPDATE TASK STATS
  // ============================================
  // Dashboard pe stats cards update karta hai
  function updateStats() {
    console.log('📊 Updating stats...');
    
    // AJAX GET request bhejte hain stats fetch karne ke liye
    $.get("/tasks/stats", function (data) {
      // data me total, completed, pending count hoga
      console.log('✅ Stats updated:', data);
      
      // Stats cards me numbers update karte hain with animation
      $("#totalTasks").text(data.total).addClass('animate-number');
      $("#pendingTasks").text(data.pending).addClass('animate-number');
      $("#completedTasks").text(data.completed).addClass('animate-number');
      
      // Animation class remove karte hain 500ms baad
      setTimeout(() => {
        $('.animate-number').removeClass('animate-number');
      }, 500);
    }).fail(function(error) {
      console.error('❌ Error updating stats:', error);
    });
  }

  // ============================================
  // INITIAL LOAD - Page load hone pe tasks aur stats load karte hain
  // ============================================
  loadTasks(); // Tasks load karo
  updateStats(); // Stats load karo

  // ============================================
  // EVENT: ADD/UPDATE TASK FORM SUBMIT
  // ============================================
  $("#taskForm").submit(function (e) {
    e.preventDefault(); // Default form submission prevent karte hain
    
    console.log('💾 Saving task...');
    
    // Save button pe loader show karte hain
    $("#saveBtn").attr("disabled", true); // Button disable kar diya
    $("#saveLoader").removeClass("d-none"); // Spinner show kar diya
    $("#saveBtnText").text("Saving..."); // Button text change kar diya

    // Form data ko serialize karke AJAX POST request bhejte hain
    $.post("/tasks/save", $(this).serialize(), function (response) {
      console.log('✅ Task saved successfully');
      
      // Modal close karte hain
      $("#taskModal").modal("hide");
      
      // Tasks aur stats reload karte hain
      loadTasks();
      updateStats();
      
      // Form reset karte hain
      $("#taskForm")[0].reset();
      $("#task_id").val(''); // Task ID clear kar di (edit mode se normal mode me)

      // Success notification dikhate hain
      Toastify({
        text: "✅ Task saved successfully!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#28a745"
      }).showToast();
    }).fail(function(error) {
      console.error('❌ Error saving task:', error);
      
      // Error notification
      Toastify({
        text: "❌ Failed to save task. Please try again.",
        duration: 3000,
        backgroundColor: "#dc3545"
      }).showToast();
    }).always(function() {
      // Save button ko reset karte hain (success ya fail dono me)
      $("#saveBtn").attr("disabled", false);
      $("#saveLoader").addClass("d-none");
      $("#saveBtnText").text("Save Task");
    });
  });

  // ============================================
  // EVENT: EDIT TASK BUTTON CLICK
  // ============================================
  // Edit button pe click karne se modal open hoga with task data
  $(document).on("click", ".editBtn", function () {
    // Button se task data extract karte hain
    const task = $(this).data("task");
    console.log('✏️ Editing task:', task.title);
    
    // Form fields me task data fill karte hain
    $("#task_id").val(task._id); // Task ID (update ke liye zaroori)
    $("input[name=title]").val(task.title); // Title
    $("textarea[name=description]").val(task.description); // Description
    
    // Date fields me ISO format se YYYY-MM-DD format me convert karte hain
    $("input[name=start_date]").val(task.start_date.split('T')[0]);
    $("input[name=deadline]").val(task.deadline.split('T')[0]);
    
    $("select[name=priority]").val(task.priority); // Priority
    
    // Modal open karte hain
    $("#taskModal").modal("show");
  });

  // ============================================
  // EVENT: DELETE TASK BUTTON CLICK
  // ============================================
  $(document).on("click", ".deleteBtn", function () {
    const $btn = $(this); // Button reference store kar liya
    const id = $btn.data("id"); // Task ID extract kiya
    
    // Confirmation dialog dikhate hain
    if (!confirm("Are you sure you want to delete this task?")) {
      return; // Agar user cancel kare to return kar do
    }
    
    console.log('🗑️ Deleting task:', id);

    // Button pe loader show karte hain
    const loader = $btn.find(".spinner-border");
    loader.removeClass("d-none");
    $btn.attr("disabled", true);

    // AJAX POST request bhejte hain task delete karne ke liye
    $.post("/tasks/delete", { id: id }, function (response) {
      console.log('✅ Task deleted successfully');
      
      // Tasks aur stats reload karte hain
      loadTasks();
      updateStats();

      // Success notification
      Toastify({
        text: "🗑️ Task deleted successfully!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#dc3545"
      }).showToast();
    }).fail(function(error) {
      console.error('❌ Error deleting task:', error);
      
      // Error notification
      Toastify({
        text: "❌ Failed to delete task. Please try again.",
        duration: 3000,
        backgroundColor: "#dc3545"
      }).showToast();
      
      // Button ko re-enable karte hain
      loader.addClass("d-none");
      $btn.attr("disabled", false);
    });
  });

  // ============================================
  // EVENT: MARK TASK AS COMPLETED BUTTON CLICK
  // ============================================
  $(document).on("click", ".completeBtn", function () {
    const $btn = $(this); // Button reference
    const id = $btn.data("id"); // Task ID
    
    console.log('✅ Marking task as completed:', id);

    // Button pe loader show karte hain
    const loader = $btn.find(".spinner-border");
    loader.removeClass("d-none");
    $btn.attr("disabled", true);

    // AJAX POST request bhejte hain task complete karne ke liye
    $.post("/tasks/complete", { id: id }, function (response) {
      console.log('✅ Task marked as completed');
      
      // Tasks aur stats reload karte hain
      loadTasks();
      updateStats();

      // Success notification with celebration
      Toastify({
        text: "🎉 Task completed successfully!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#28a745"
      }).showToast();
    }).fail(function(error) {
      console.error('❌ Error completing task:', error);
      
      // Error notification
      Toastify({
        text: "❌ Failed to mark task as completed. Please try again.",
        duration: 3000,
        backgroundColor: "#dc3545"
      }).showToast();
      
      // Button ko re-enable karte hain
      loader.addClass("d-none");
      $btn.attr("disabled", false);
    });
  });

  // ============================================
  // EVENT: MODAL CLOSE - Form reset karte hain
  // ============================================
  $('#taskModal').on('hidden.bs.modal', function () {
    // Modal close hone pe form reset kar dete hain
    $("#taskForm")[0].reset();
    $("#task_id").val(''); // Task ID clear
    console.log('🔄 Task form reset');
  });

  // ============================================
  // EVENT: VOICE BUTTON CLICK (Future Feature)
  // ============================================
  $("#voiceBtn").click(function() {
    console.log('🎤 Voice button clicked');
    
    Toastify({
      text: "🎤 Voice feature coming soon!",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "#667eea"
    }).showToast();
    
    // Future me voice recognition implement kar sakte hain
    // Web Speech API use kar sakte hain
  });

  // ============================================
  // UTILITY FUNCTION: AUTO-REFRESH (Optional)
  // ============================================
  // Har 5 minute me automatically tasks reload kar sakte hain
  // Uncomment karke enable kar sakte hain
  /*
  setInterval(function() {
    console.log('🔄 Auto-refreshing tasks...');
    loadTasks();
    updateStats();
  }, 5 * 60 * 1000); // 5 minutes = 5 * 60 * 1000 milliseconds
  */

  // ============================================
  // KEYBOARD SHORTCUTS (Optional Enhancement)
  // ============================================
  $(document).keydown(function(e) {
    // Ctrl/Cmd + N = New Task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      $("#taskModal").modal("show");
      console.log('⌨️ Keyboard shortcut: New Task');
    }
    
    // Escape = Close Modal
    if (e.key === 'Escape') {
      $("#taskModal").modal("hide");
    }
  });

  // ============================================
  // CONSOLE LOG: Dashboard Ready
  // ============================================
  console.log('✅ Dashboard initialized successfully!');
  console.log('📋 Available functions:', {
    loadTasks: 'Reload all tasks',
    updateStats: 'Update statistics',
    shortcuts: 'Ctrl+N for new task'
  });
});

// ============================================
// GLOBAL FUNCTIONS (Window scope me available)
// ============================================

// Page reload function - Manually call kar sakte hain console se
window.reloadDashboard = function() {
  location.reload();
};

// Debug mode toggle - Console se enable/disable kar sakte hain
window.debugMode = false;
window.toggleDebug = function() {
  window.debugMode = !window.debugMode;
  console.log('🐛 Debug mode:', window.debugMode ? 'ON' : 'OFF');
};