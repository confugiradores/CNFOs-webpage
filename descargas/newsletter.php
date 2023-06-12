<?php
  header('Content-Type: application/json; charset=utf-8');
  header("Access-Control-Allow-Origin: *");
  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $conexion = new SQLite3('../data/newsletter.db');
    $email = trim($_POST['email']);
    $email = stripslashes($email);
    $email = htmlspecialchars($email, ENT_QUOTES, "UTF-8");
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      echo json_encode(["status" => 1]);
    } else {
      $email = SQLite3::escapeString($email);
      $stmt = $conexion->prepare('SELECT COUNT(*) FROM usuarios WHERE email = :email');
      $stmt->bindParam(':email', $email, SQLITE3_TEXT);
      $result = $stmt->execute();
      $count = $result->fetchArray()[0];
      if ($count > 0) {
        echo json_encode(["status" => 2]);
      } else {
        $stmt = $conexion->prepare('INSERT INTO usuarios (email) VALUES (:email)');
        $stmt->bindParam(':email', $email, SQLITE3_TEXT);
        $stmt->execute();
        echo json_encode(["status" => 0]);
      }
    }
  }
?>
