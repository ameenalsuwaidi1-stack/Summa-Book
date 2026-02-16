
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// --- DATABASE CONFIGURATION ---
// Update these with your real cPanel MySQL details
$host = "localhost"; // Changed to localhost for cPanel internal connection
$db_name = "ameenser_summa_db"; 
$username = "ameenser_summa_user"; 
$password = "Amy@2003"; 

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$action = $request[0] ?? '';

// --- ROUTER ---
switch($action) {
    case 'login':
        handleLogin($conn);
        break;
    case 'register':
        handleRegister($conn);
        break;
    case 'books':
        handleBooks($conn, $method, $request[1] ?? null);
        break;
    case 'progress':
        handleProgress($conn, $method);
        break;
    default:
        echo json_encode(["message" => "Welcome to SummaBook API"]);
        break;
}

// --- CONTROLLERS ---

function handleLogin($conn) {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data->password, $user['password'])) {
        unset($user['password']); // Don't send password back
        echo json_encode($user);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }
}

function handleRegister($conn) {
    $data = json_decode(file_get_contents("php://input"));
    $hashed = password_hash($data->password, PASSWORD_DEFAULT);
    try {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
        $stmt->execute([$data->name, $data->email, $hashed]);
        echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
    } catch(Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => "Email already exists"]);
    }
}

function handleBooks($conn, $method, $id) {
    if ($method == 'GET') {
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM books WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            $stmt = $conn->query("SELECT * FROM books ORDER BY createdAt DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    } elseif ($method == 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        $stmt = $conn->prepare("INSERT INTO books (title_en, title_ar, author_en, author_ar, category_en, category_ar, summary_en, summary_ar, content_en, content_ar, cover, readTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $data->title->en, $data->title->ar, 
            $data->author->en, $data->author->ar,
            $data->category->en, $data->category->ar,
            $data->summary->en, $data->summary->ar,
            $data->content->en, $data->content->ar,
            $data->cover, $data->readTime
        ]);
        echo json_encode(["success" => true]);
    } elseif ($method == 'DELETE') {
        $stmt = $conn->prepare("DELETE FROM books WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    }
}

function handleProgress($conn, $method) {
    $data = json_decode(file_get_contents("php://input"));
    // Simulating progress update in a real DB would use a specific progress table
    echo json_encode(["success" => true]);
}
?>
