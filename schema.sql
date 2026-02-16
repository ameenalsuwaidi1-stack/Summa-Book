
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    author_en VARCHAR(255) NOT NULL,
    author_ar VARCHAR(255) NOT NULL,
    category_en VARCHAR(100) NOT NULL,
    category_ar VARCHAR(100) NOT NULL,
    summary_en TEXT,
    summary_ar TEXT,
    content_en LONGTEXT,
    content_ar LONGTEXT,
    cover VARCHAR(255),
    readTime INT DEFAULT 10,
    rating DECIMAL(3,2) DEFAULT 4.5,
    views INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@summa.com', '$2y$10$7R6v7u/K/z7m/J/L/A.9i.f5H.k.L.C.k.L.C.k.L.C.k.L.C.k.L.C', 'admin');
