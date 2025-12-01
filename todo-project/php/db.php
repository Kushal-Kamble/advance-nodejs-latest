<?php
$host = "localhost";
$username = "lscmitsde_user_todo_with_ai"; 
$password = ")t9c.9^^YOnc"; 
$database = "lscmitsde_todo_with_ai";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
  die("❌ Connection failed: " . mysqli_connect_error());
} else {
  // echo "✅ Connected successfully!";
}
?>
