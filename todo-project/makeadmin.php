<?php
session_start();
include("php/db.php");

// ✅ Only allow if user is logged in and is admin
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    die("❌ Access Denied: Only admins can access this page.");
}

$message = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $role = $_POST['role'];

    $stmt = $conn->prepare("UPDATE users SET role = ? WHERE email = ?");
    $stmt->bind_param("ss", $role, $email);

    if ($stmt->execute()) {
        $message = "✅ <strong>$email</strong> promoted to <strong>$role</strong>.";
    } else {
        $message = "❌ Error updating role.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Update User Role</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #f5f7fb;
      font-family: 'Segoe UI', sans-serif;
    }
    .container {
      margin-top: 60px;
    }
    .card {
      max-width: 500px;
      margin: auto;
      border: none;
      border-radius: 20px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.05);
    }
    .card-header {
      background-color: #fe9e43;
      color: #fff;
      font-size: 1.25rem;
      border-radius: 20px 20px 0 0;
      text-align: center;
      font-weight: bold;
    }
    .btn-primary {
      background-color: #fe9e43;
      border: none;
    }
    .btn-primary:hover {
      background-color: #e58a2f;
    }
    .form-label {
      color: #212428;
      font-weight: 500;
    }
    .alert-info {
      background-color: #fff8e6;
      color: #856404;
      border: 1px solid #ffeeba;
    }
  </style>
</head>
<body>

<div class="container">
  <div class="card">
    <div class="card-header">
      🎛️ Promote/Demote User
    </div>
    <div class="card-body">
      <?php if ($message): ?>
        <div class="alert alert-success"><?= $message ?></div>
      <?php endif; ?>
      <form method="POST">
        <div class="mb-3">
          <label for="email" class="form-label">User Email</label>
          <input type="email" class="form-control" id="email" name="email" placeholder="user@example.com" required>
        </div>
        <div class="mb-3">
          <label for="role" class="form-label">Select Role</label>
          <select name="role" id="role" class="form-select">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary w-100">Update Role</button>
      </form>
    </div>
  </div>
</div>

</body>
</html>
