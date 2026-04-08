-- Create Database
DROP DATABASE IF EXISTS college_blog_db;
CREATE DATABASE college_blog_db;
USE college_blog_db;

-- Create Roles Table
CREATE TABLE roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create Departments Table
CREATE TABLE departments (
  department_id INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Create Users Table
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role_id INT NOT NULL,
  department_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Create Blog Posts Table
CREATE TABLE blog_posts (
  post_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  author_id INT NOT NULL,
  department_id INT NOT NULL,
  reviewed_by INT,
  FOREIGN KEY (author_id) REFERENCES users(user_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);

-- Insert Roles
INSERT INTO roles (role_name) VALUES ('Admin');
INSERT INTO roles (role_name) VALUES ('Department Head');
INSERT INTO roles (role_name) VALUES ('Student');

-- Insert Departments
INSERT INTO departments (department_name, description) VALUES 
  ('Computer Science', 'Pioneering the future of technology and innovation through cutting-edge research and education.');
INSERT INTO departments (department_name, description) VALUES 
  ('Business Administration', 'Developing tomorrow\'s business leaders with comprehensive management and entrepreneurship programs.');
INSERT INTO departments (department_name, description) VALUES 
  ('Engineering', 'Building innovative solutions to complex engineering challenges through hands-on learning.');
INSERT INTO departments (department_name, description) VALUES 
  ('Arts & Humanities', 'Exploring human culture, creativity, and critical thinking through diverse artistic disciplines.');

-- Insert Users (Passwords should be hashed in production)
-- Student User
INSERT INTO users (name, email, password, role_id, department_id) 
VALUES ('John Student', 'student@college.edu', 'password123', 3, 1);

-- Department Head User
INSERT INTO users (name, email, password, role_id, department_id) 
VALUES ('Dr. Sarah Head', 'head@college.edu', 'password123', 2, 1);

-- Admin User
INSERT INTO users (name, email, password, role_id, department_id) 
VALUES ('Admin User', 'admin@college.edu', 'password123', 1, NULL);

-- Another Student
INSERT INTO users (name, email, password, role_id, department_id) 
VALUES ('Jane Doe', 'jane@college.edu', 'password123', 3, 2);

-- Another Department Head
INSERT INTO users (name, email, password, role_id, department_id) 
VALUES ('Dr. Michael Brown', 'mbrown@college.edu', 'password123', 2, 2);

-- Insert Sample Blog Posts
INSERT INTO blog_posts (title, content, status, author_id, department_id, reviewed_by) 
VALUES (
  'The Future of Artificial Intelligence in Education',
  'Artificial Intelligence is revolutionizing the way we approach education. From personalized learning experiences to automated grading systems, AI is making education more accessible and efficient.

In this comprehensive analysis, we explore how machine learning algorithms are being used to identify student learning patterns and adapt curriculum accordingly. We discuss the ethical implications of AI in education and the importance of maintaining human oversight in the learning process.

Key areas covered include:
- Adaptive learning platforms
- Intelligent tutoring systems
- Automated assessment tools
- Predictive analytics for student success
- Ethical considerations and privacy concerns

The integration of AI in education promises to transform traditional teaching methods while maintaining the essential human element that makes learning meaningful and engaging.',
  'Approved',
  1,
  1,
  1
);

INSERT INTO blog_posts (title, content, status, author_id, department_id, reviewed_by) 
VALUES (
  'Sustainable Business Practices in the Modern Economy',
  'Sustainability is no longer just a buzzword – it\'s a business imperative. Companies worldwide are recognizing that environmental and social responsibility are crucial for long-term success.

This article examines how leading businesses are integrating sustainable practices into their operations. From reducing carbon footprints to implementing circular economy principles, we explore the strategies that are driving both profitability and positive environmental impact.

Topics include:
- Green supply chain management
- Corporate social responsibility initiatives
- Sustainable finance and investment
- Employee engagement in sustainability programs
- Measuring and reporting environmental impact

The business case for sustainability is stronger than ever, with consumers, investors, and regulators all demanding greater accountability from corporations.',
  'Approved',
  4,
  2,
  1
);

INSERT INTO blog_posts (title, content, status, author_id, department_id, reviewed_by) 
VALUES (
  'Innovations in Renewable Energy Engineering',
  'The renewable energy sector is experiencing unprecedented growth and innovation. Engineers are developing new technologies that make clean energy more efficient and affordable than ever before.

This post explores recent breakthroughs in solar panel efficiency, wind turbine design, and energy storage solutions. We also discuss the challenges that remain in transitioning to a fully renewable energy grid.

Key innovations discussed:
- Next-generation photovoltaic cells
- Offshore wind farm technology
- Advanced battery storage systems
- Smart grid integration
- Hydrogen fuel cell developments

As we move toward a carbon-neutral future, these engineering innovations will play a critical role in addressing climate change.',
  'Approved',
  1,
  3,
  1
);

-- Pending Blog Post
INSERT INTO blog_posts (title, content, status, author_id, department_id) 
VALUES (
  'The Role of Art in Social Change',
  'Throughout history, art has been a powerful catalyst for social change. From political murals to protest music, artists have used their creativity to challenge injustice and inspire action.

This essay examines contemporary art movements that address social issues such as inequality, environmental degradation, and human rights. We analyze how different artistic mediums contribute to raising awareness and fostering dialogue.

Areas explored:
- Street art and activism
- Documentary photography
- Performance art and protest
- Digital art and social media
- Community-based art projects

Art\'s unique ability to evoke emotion and provoke thought makes it an invaluable tool in the pursuit of social justice and positive change.',
  'Pending',
  4,
  4
);


