-- Author: Vaishnavi Jambhale
-- Version: 1.0
-- Since: 26-09-2025

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS finance;
USE finance;

-- Create users table 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'reviewer', 'accountant') DEFAULT NULL,
    resetPasswordToken VARCHAR(255) NULL,
    resetPasswordExpires DATETIME NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    CHECK (phone REGEXP '^[0-9]{10}$')
);

--- Insert users in Users Table
INSERT INTO users (name, email, phone, password, role)
VALUES
('Super Admin', 'superadmin@example.com', '9999999999', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8JwZQp8iH7TzZbKZJr3vQ1qf0U9ZkK', 'superadmin'),
('Reviewer User', 'reviewer@example.com', '8888888888', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8JwZQp8iH7TzZbKZJr3vQ1qf0U9ZkK', 'reviewer'),
('Accountant User', 'accountant@example.com', '7777777777', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8JwZQp8iH7TzZbKZJr3vQ1qf0U9ZkK', 'accountant');


-- Create projects table
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    department VARCHAR(255),
    sub_department VARCHAR(255),
    product VARCHAR(255),
    quantity INT,
    description TEXT,
    estimated_budget DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    status ENUM('planned','ongoing','completed','on-hold') DEFAULT 'planned',
    created_by INT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    deletedAt DATETIME NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

--- Insert projects into projects table
INSERT INTO projects 
(name, location, department, sub_department, product, quantity, description, estimated_budget, start_date, end_date, status, created_by, createdAt, updatedAt)
VALUES
('Smart City Lighting', 'Pune', 'Electrical', 'Infrastructure', 'LED Street Lights', 500, 'Installation of smart LED street lights across city areas', 2500000.00, '2025-01-10', '2025-06-30', 'ongoing', 3, NOW(), NOW())

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE DEFAULT NULL,
    phone VARCHAR(10) DEFAULT NULL,
    role VARCHAR(50) DEFAULT 'employee',
    created_by INT DEFAULT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    CHECK (phone REGEXP '^[0-9]{10}$'),
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

--- Insert employees into employees table
INSERT INTO employees (name, email, phone, role, created_by)
VALUES
('Rohit Sharma', 'rohit.sharma@example.com', '9876543210', 'employee', 3);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    expense_type ENUM('advance', 'recurring') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    mode_of_payment ENUM('cash', 'bank_transfer', 'upi', 'cheque', 'other') NULL DEFAULT NULL,
    expense_date DATE NOT NULL,
    created_by INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

--- Insert expenses into expenses table
INSERT INTO expenses (project_id, expense_type, title, description, amount, mode_of_payment, expense_date, created_by)
VALUES
(1, 'advance', 'Site Material Advance', 'Advance payment for site materials', 50000.00, 'bank_transfer', '2025-10-31', 3);


-- Create investors table
CREATE TABLE investors (
    investor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) DEFAULT NULL,
    invested_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    mode_of_payment ENUM('cash', 'bank_transfer', 'upi', 'cheque', 'other') NOT NULL,
    investment_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    description TEXT DEFAULT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    expense_id INT DEFAULT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (expense_id) REFERENCES expenses(expense_id) ON DELETE SET NULL
);

--- Insert investors into investors table
INSERT INTO investors (name, email, phone, invested_amount, mode_of_payment, investment_date, description, status, user_id, project_id, expense_id)
VALUES
('John Doe', 'johndoe@example.com', '9998887776', 100000.00, 'bank_transfer', '2025-10-31', 'Initial investment for project 1', 'active', 3, 1, 1);


---- Created project_assignments table
CREATE TABLE project_assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  employee_id INT NOT NULL,
  assigned_by INT NOT NULL,
  
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME DEFAULT NULL,

  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE
);

--- Insert project assignments into project_assignments table
INSERT INTO project_assignments (project_id, employee_id, assigned_by)
VALUES 
(1, 1, 3);

--- Created expense_reviews table
CREATE TABLE expense_reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  expense_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  comment TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME DEFAULT NULL,

  CONSTRAINT fk_er_expense FOREIGN KEY (expense_id) REFERENCES expenses(expense_id) ON DELETE CASCADE,
  INDEX idx_er_expense (expense_id),
  INDEX idx_er_reviewer (reviewer_id),
  INDEX idx_er_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--- Insert expense reviews into expense_reviews table
INSERT INTO expense_reviews (expense_id, reviewer_id, status, comment)
VALUES (1, 2, 'approved', 'Expense verified successfully and approved.');


--- Alter table expenses to add employee_id foreign key
ALTER TABLE expenses
ADD COLUMN employee_id INT NOT NULL
AFTER project_id;


---Alter table investor to add employee_id foreign key
ALTER TABLE investors
ADD COLUMN employee_id INT NOT NULL;

--- Drop table investors
DROP TABLE investors;


--- Created Table investors
CREATE TABLE investors (
    investor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL UNIQUE,
    created_by INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

--- Fixed insertion into investors table
INSERT INTO investors (name, email, phone, created_by)
 VALUES ('Vedant Enterprises','vedantaccountant@gmail.com', '7447446801', 3);

INSERT INTO investors (name, email, phone, created_by)
 VALUES ('VKMD Global Solutions Pvt. Ltd.','vkmd.globalsolutionspvt@gmail.com', '96578 22121', 3);

INSERT INTO investors (name, email, phone, created_by)
VALUES ('Dvijtech Global Solutions Pvt. Ltd.','dvijtechaccountant@gmail.com', '8789876787', 3);

--- Insert investors into investors tableINSERT INTO investors (name, email, phone, created_by)
INSERT INTO investors (name, email, phone, created_by)
VALUES ('rohit gore', 'rohitgore@gmail.com', '9876583210', 3);

--- Create investments table assign_investors
CREATE TABLE assign_investors (
    assign_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    investor_id INT NOT NULL,
    assigned_by INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (investor_id) REFERENCES investors(investor_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO assign_investors (project_id, investor_id, assigned_by, createdAt, updatedAt, deletedAt)
VALUES (2, 4, 3, NOW(), NOW(), NULL);


--- Create table Investments 
CREATE TABLE investments (
    investment_id INT AUTO_INCREMENT PRIMARY KEY,
    investor_id INT NOT NULL,
    project_id INT NOT NULL,
    invested_amount DECIMAL(15,2) NOT NULL,
    mode_of_payment ENUM('cash', 'bank_transfer', 'upi', 'cheque', 'other') NOT NULL,
    investment_type ENUM('self', 'other') NOT NULL,  
    investment_date DATE NOT NULL,
    description TEXT,  
    created_by INT NOT NULL,  
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    FOREIGN KEY (investor_id) REFERENCES investors(investor_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
