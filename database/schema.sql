-- ISIM College ERP Database Schema

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    enrollment_number VARCHAR(50) UNIQUE,
    roll_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    course VARCHAR(50),
    current_year INTEGER,
    current_semester INTEGER,
    section VARCHAR(10),
    mobile VARCHAR(20),
    address TEXT
);

CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    faculty_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    designation VARCHAR(50),
    qualification VARCHAR(100),
    mobile VARCHAR(20)
);

CREATE TABLE hods (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER REFERENCES faculty(id),
    department_id INTEGER UNIQUE REFERENCES departments(id),
    assigned_year INTEGER
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    year INTEGER,
    semester INTEGER,
    credits INTEGER,
    type VARCHAR(20) -- Theory, Practical, Lab, Elective
);

CREATE TABLE faculty_subjects (
    faculty_id INTEGER REFERENCES faculty(id),
    subject_id INTEGER REFERENCES subjects(id),
    section VARCHAR(10),
    PRIMARY KEY (faculty_id, subject_id, section)
);

-- Initial Roles Insertion
INSERT INTO roles (name) VALUES 
('ROLE_DIRECTOR'),
('ROLE_HOD'),
('ROLE_FACULTY'),
('ROLE_STUDENT'),
('ROLE_FINANCE'),
('ROLE_EXAM_ADMIN'),
('ROLE_LIBRARIAN'),
('ROLE_REGISTRAR');
