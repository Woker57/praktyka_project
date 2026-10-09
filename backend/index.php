<?php
// backend/index.php — minimalny placeholder (alternatywa: ASP.NET Core Web API)
// Uruchomienie: php -S localhost:8000 -t backend

header('Content-Type: application/json');
echo json_encode(["status" => "ok", "message" => "Task Manager API"]);
