<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'summa_db';
$username = getenv('DB_USER') ?: 'summa_user';
$password = getenv('DB_PASS') ?: 'change_me';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$route = getRouteSegments();
$action = $route[0] ?? '';
$id = $route[1] ?? null;

switch ($action) {
    case 'login':
        handleLogin($conn);
        break;
    case 'register':
        handleRegister($conn);
        break;
    case 'books':
        handleBooks($conn, $method, $id);
        break;
    case 'progress':
        handleProgress($method);
        break;
    default:
        echo json_encode(['message' => 'SummaBook API ready']);
        break;
}

function getRouteSegments(): array {
    if (!empty($_GET['route'])) {
        return explode('/', trim($_GET['route'], '/'));
    }

    if (!empty($_SERVER['PATH_INFO'])) {
        return explode('/', trim($_SERVER['PATH_INFO'], '/'));
    }

    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    $relativePath = trim(str_replace($scriptName, '', $requestPath), '/');

    return $relativePath === '' ? [] : explode('/', $relativePath);
}

function readJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON body']);
        exit;
    }

    return $data;
}

function handleLogin(PDO $conn): void {
    $data = readJsonBody();

    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }

    $stmt = $conn->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if ($user && password_verify($data['password'], $user['password'])) {
        unset($user['password']);
        echo json_encode($user);
        return;
    }

    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}

function handleRegister(PDO $conn): void {
    $data = readJsonBody();

    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email, and password are required']);
        return;
    }

    $hashed = password_hash($data['password'], PASSWORD_DEFAULT);

    try {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
        $stmt->execute([$data['name'], $data['email'], $hashed]);
        http_response_code(201);
        echo json_encode(['success' => true, 'id' => (int)$conn->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Email already exists']);
    }
}

function handleBooks(PDO $conn, string $method, ?string $id): void {
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM books WHERE id = ?');
            $stmt->execute([$id]);
            $book = $stmt->fetch();

            if (!$book) {
                http_response_code(404);
                echo json_encode(['error' => 'Book not found']);
                return;
            }

            echo json_encode($book);
            return;
        }

        $stmt = $conn->query('SELECT * FROM books ORDER BY createdAt DESC');
        echo json_encode($stmt->fetchAll());
        return;
    }

    if ($method === 'POST') {
        $data = readJsonBody();
        $stmt = $conn->prepare('INSERT INTO books (title_en, title_ar, author_en, author_ar, category_en, category_ar, summary_en, summary_ar, content_en, content_ar, cover, readTime, rating, views, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['title']['en'] ?? '', $data['title']['ar'] ?? '',
            $data['author']['en'] ?? '', $data['author']['ar'] ?? '',
            $data['category']['en'] ?? '', $data['category']['ar'] ?? '',
            $data['summary']['en'] ?? '', $data['summary']['ar'] ?? '',
            $data['content']['en'] ?? '', $data['content']['ar'] ?? '',
            $data['cover'] ?? '',
            (int)($data['readTime'] ?? 10),
            (float)($data['rating'] ?? 4.5),
            (int)($data['views'] ?? 0),
            $data['createdAt'] ?? date('Y-m-d H:i:s')
        ]);

        http_response_code(201);
        echo json_encode(['success' => true, 'id' => (int)$conn->lastInsertId()]);
        return;
    }

    if ($method === 'PUT' && $id) {
        $data = readJsonBody();
        $stmt = $conn->prepare('UPDATE books SET title_en = ?, title_ar = ?, author_en = ?, author_ar = ?, category_en = ?, category_ar = ?, summary_en = ?, summary_ar = ?, content_en = ?, content_ar = ?, cover = ?, readTime = ?, rating = ?, views = ? WHERE id = ?');
        $stmt->execute([
            $data['title']['en'] ?? '', $data['title']['ar'] ?? '',
            $data['author']['en'] ?? '', $data['author']['ar'] ?? '',
            $data['category']['en'] ?? '', $data['category']['ar'] ?? '',
            $data['summary']['en'] ?? '', $data['summary']['ar'] ?? '',
            $data['content']['en'] ?? '', $data['content']['ar'] ?? '',
            $data['cover'] ?? '',
            (int)($data['readTime'] ?? 10),
            (float)($data['rating'] ?? 4.5),
            (int)($data['views'] ?? 0),
            $id
        ]);

        echo json_encode(['success' => true]);
        return;
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM books WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

function handleProgress(string $method): void {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    readJsonBody();
    echo json_encode(['success' => true]);
}
