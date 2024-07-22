DROP DATABASE IF EXISTS FAREWELLMANAGEMENTSYSTEM;

CREATE DATABASE FAREWELLMANAGEMENTSYSTEM;

USE FAREWELLMANAGEMENTSYSTEM;

-- Students table
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers table
CREATE TABLE teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin managers table
CREATE TABLE admin_managers (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    venue VARCHAR(255)
);

-- Menu suggestions table
CREATE TABLE menu_suggestions (
    suggestion_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    menu_item VARCHAR(255) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    votes INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Performance proposals table
CREATE TABLE performance_proposals (
    proposal_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    performance_type VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    requirements TEXT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    votes INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Teacher family members table
CREATE TABLE teacher_family_members (
    family_member_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    name INT(10) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Tasks table
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    task_description TEXT NOT NULL,
    assigned_to INT,
    assigned_to_team ENUM('decor', 'invitation', 'menu', 'performance', 'other') NOT NULL,
    completion_status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    FOREIGN KEY (assigned_to) REFERENCES students(student_id)
);

-- Attendance table
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    attendee_id INT,
    attendee_type ENUM('student', 'teacher', 'family', 'manager') NOT NULL,
    event_date DATE NOT NULL,
    FOREIGN KEY (attendee_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Budget tracking table
CREATE TABLE budget_tracking (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_description TEXT NOT NULL,
    expense_amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    event_id INT,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Menu managers table
CREATE TABLE menu_managers (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    manager_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Performance managers table
CREATE TABLE performance_managers (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    manager_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Invitation managers table
CREATE TABLE invitation_managers (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    manager_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Budget managers table
CREATE TABLE budget_managers (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    manager_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Feedback table
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    attendee_id INT,
    content TEXT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (attendee_id) REFERENCES students(student_id)
);

-- Admin Announcement table
CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    departments VARCHAR(255) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


