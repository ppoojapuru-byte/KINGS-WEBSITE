const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Body parser error handler (invalid JSON)
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    console.error('Invalid JSON payload:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pooja@123', // Replace with your actual MySQL root password
  database: 'college_blog_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL Database');
});

// ================================================
// Authentication Routes
// ================================================

// POST /login - User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sanitizedEmail = String(email).trim().toLowerCase();
  const sanitizedPassword = String(password);

  const sql = `
    SELECT u.user_id, u.name, u.email, u.role_id, u.department_id, r.role_name 
    FROM users u 
    LEFT JOIN roles r ON u.role_id = r.role_id 
    WHERE LOWER(u.email) = ? AND u.password = ?
  `;

  db.query(sql, [sanitizedEmail, sanitizedPassword], (err, results) => {
    if (err) {
      console.error('Login database error:', err);
      return res.status(500).json({ error: 'Unable to authenticate at this time. Please try again later.' });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    if (!user || !user.user_id) {
      return res.status(500).json({ error: 'Unexpected login response format' });
    }

    return res.json({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role_name || 'Student',
      department_id: user.department_id,
    });
  });
});

// Generic error handler must be after all routes
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal server error' });
});

// ================================================
// Blog Routes
// ================================================

// POST /blogs - Create a new blog post
app.post('/blogs', (req, res) => {
  const { title, content, author_id, department_id } = req.body;

  if (!title || !content || !author_id || !department_id) {
    return res.status(400).json({ error: 'Title, content, author_id, and department_id are required' });
  }

  const sql = `
    INSERT INTO blog_posts
    (title, content, status, author_id, department_id, created_at)
    VALUES (?, ?, 'Pending', ?, ?, NOW())
  `;

  db.query(sql, [title, content, author_id, department_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Blog submitted successfully',
      post_id: result.insertId,
    });
  });
});

// GET /blogs - Get all approved blogs
app.get('/blogs', (req, res) => {
  const sql = `
    SELECT 
      bp.post_id, 
      bp.title, 
      bp.content, 
      bp.created_at, 
      bp.status, 
      bp.author_id, 
      bp.department_id,
      u.name as author_name,
      d.department_name
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.user_id
    LEFT JOIN departments d ON bp.department_id = d.department_id
    WHERE bp.status = 'Approved'
    ORDER BY bp.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// GET /blogs/pending - Get all pending blogs
app.get('/blogs/pending', (req, res) => {
  const sql = `
    SELECT 
      bp.post_id, 
      bp.title, 
      bp.content, 
      bp.created_at, 
      bp.status, 
      bp.author_id, 
      bp.department_id,
      u.name as author_name,
      d.department_name
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.user_id
    LEFT JOIN departments d ON bp.department_id = d.department_id
    WHERE bp.status = 'Pending'
    ORDER BY bp.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// GET /blogs/pending/:department_id - Get pending blogs for a specific department
app.get('/blogs/pending/:department_id', (req, res) => {
  const { department_id } = req.params;

  const sql = `
    SELECT 
      bp.post_id, 
      bp.title, 
      bp.content, 
      bp.created_at, 
      bp.status, 
      bp.author_id, 
      bp.department_id,
      u.name as author_name,
      d.department_name
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.user_id
    LEFT JOIN departments d ON bp.department_id = d.department_id
    WHERE bp.status = 'Pending' AND bp.department_id = ?
    ORDER BY bp.created_at DESC
  `;

  db.query(sql, [department_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// GET /blogs/:id - Get a single blog by ID
app.get('/blogs/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      bp.post_id, 
      bp.title, 
      bp.content, 
      bp.created_at, 
      bp.status, 
      bp.author_id, 
      bp.department_id,
      u.name as author_name,
      d.department_name
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.user_id
    LEFT JOIN departments d ON bp.department_id = d.department_id
    WHERE bp.post_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(results[0]);
  });
});

// GET /blogs/author/:author_id - Get all blogs by a specific author
app.get('/blogs/author/:author_id', (req, res) => {
  const { author_id } = req.params;

  const sql = `
    SELECT 
      bp.post_id, 
      bp.title, 
      bp.content, 
      bp.created_at, 
      bp.status, 
      bp.author_id, 
      bp.department_id,
      u.name as author_name,
      d.department_name
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.user_id
    LEFT JOIN departments d ON bp.department_id = d.department_id
    WHERE bp.author_id = ?
    ORDER BY bp.created_at DESC
  `;

  db.query(sql, [author_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// PUT /blogs/:id/approve - Approve a blog post
app.put('/blogs/:id/approve', (req, res) => {
  const { id } = req.params;
  const { reviewed_by } = req.body;

  if (!reviewed_by) {
    return res.status(400).json({ error: 'reviewed_by is required' });
  }

  const sql = `
    UPDATE blog_posts
    SET status = 'Approved', reviewed_by = ?, updated_at = NOW()
    WHERE post_id = ?
  `;

  db.query(sql, [reviewed_by, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ message: 'Blog approved successfully' });
  });
});

// PUT /blogs/:id/reject - Reject a blog post
app.put('/blogs/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reviewed_by } = req.body;

  if (!reviewed_by) {
    return res.status(400).json({ error: 'reviewed_by is required' });
  }

  const sql = `
    UPDATE blog_posts
    SET status = 'Rejected', reviewed_by = ?, updated_at = NOW()
    WHERE post_id = ?
  `;

  db.query(sql, [reviewed_by, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ message: 'Blog rejected successfully' });
  });
});

// ================================================
// User Routes
// ================================================

// GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT u.user_id, u.name, u.email, u.role_id, u.department_id, r.role_name 
    FROM users u 
    LEFT JOIN roles r ON u.role_id = r.role_id 
    WHERE u.user_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);
  });
});

// ================================================
// Department Routes
// ================================================

// GET /departments - Get all departments
app.get('/departments', (req, res) => {
  const sql = `
    SELECT d.department_id, d.department_name, d.description 
    FROM departments d
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// GET /departments/:id - Get department by ID
app.get('/departments/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT d.department_id, d.department_name, d.description 
    FROM departments d
    WHERE d.department_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(results[0]);
  });
});

// ================================================
// Announcement Routes
// ================================================

// GET /announcements - Get all announcements ordered by newest first
app.get('/announcements', (req, res) => {
  const sql = `
    SELECT a.announcement_id, a.title, a.content, a.created_by, a.created_at, u.name AS created_by_name
    FROM announcements a
    LEFT JOIN users u ON a.created_by = u.user_id
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// POST /announcements - Create a new announcement
app.post('/announcements', (req, res) => {
  const { title, content, created_by } = req.body;

  if (!title || !content || !created_by) {
    return res.status(400).json({ error: 'title, content, and created_by are required' });
  }

  const sql = `
    INSERT INTO announcements (title, content, created_by, created_at)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(sql, [title, content, created_by], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement_id: result.insertId,
    });
  });
});

// ================================================
// Server Start
// ================================================

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});