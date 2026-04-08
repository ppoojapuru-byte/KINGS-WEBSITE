# Quick Reference - Code Snippets & API Examples

## 🚀 Quick Start Commands

### Start Backend
```bash
node backend/server.cjs
# Server will run on http://localhost:5000
```

### Start Frontend
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

### Import Database Schema
```bash
mysql < backend/database_schema.sql
# Or in MySQL:
mysql -u root -p < backend/database_schema.sql
```

---

## 📱 Frontend Code Examples

### 1. Login
```typescript
import { login, setUserSession } from '../utils/api';

const handleLogin = async (email: string, password: string) => {
  try {
    const user = await login(email, password);
    setUserSession(user);
    // Redirect based on user.role_name
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 2. Submit Blog
```typescript
import { createBlog } from '../utils/api';
import { getUserSession } from '../utils/api';

const handleSubmit = async (title: string, content: string, deptId: number) => {
  const currentUser = getUserSession();
  
  try {
    const result = await createBlog(
      title,
      content,
      currentUser.user_id,
      deptId
    );
    console.log('Blog submitted:', result);
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
```

### 3. Fetch Approved Blogs
```typescript
import { getApprovedBlogs } from '../utils/api';

useEffect(() => {
  const loadBlogs = async () => {
    try {
      const blogs = await getApprovedBlogs();
      // blogs = [{ post_id, title, content, author_name, ... }]
      setBlogs(blogs);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    }
  };
  
  loadBlogs();
}, []);
```

### 4. Approve Blog
```typescript
import { approveBlog } from '../utils/api';
import { getUserSession } from '../utils/api';

const handleApprove = async (blogId: number) => {
  const currentUser = getUserSession();
  
  try {
    await approveBlog(blogId, currentUser.user_id);
    console.log('Blog approved');
    // Refresh pending blogs list
  } catch (error) {
    console.error('Approval failed:', error);
  }
};
```

### 5. Get User's Blogs
```typescript
import { getBlogsByAuthor } from '../utils/api';
import { getUserSession } from '../utils/api';

const loadMyBlogs = async () => {
  const currentUser = getUserSession();
  
  try {
    const blogs = await getBlogsByAuthor(currentUser.user_id);
    setMyBlogs(blogs);
  } catch (error) {
    console.error('Failed to load blogs:', error);
  }
};
```

### 6. Get Department Info
```typescript
import { getDepartmentById } from '../utils/api';

const loadDepartment = async (deptId: number) => {
  try {
    const dept = await getDepartmentById(deptId);
    // dept = { department_id, department_name, description }
    setDepartment(dept);
  } catch (error) {
    console.error('Failed to load department:', error);
  }
};
```

### 7. Logout
```typescript
import { clearUserSession } from '../utils/api';

const handleLogout = () => {
  clearUserSession();
  navigate('/login');
};
```

---

## 🔌 Backend API Examples

### cURL Commands

#### Login
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@college.edu","password":"password123"}'
```

Response:
```json
{
  "user_id": 1,
  "name": "John Student",
  "email": "student@college.edu",
  "role_id": 3,
  "role_name": "Student",
  "department_id": 1
}
```

#### Create Blog
```bash
curl -X POST http://localhost:5000/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Blog",
    "content":"This is my blog content...",
    "author_id":1,
    "department_id":1
  }'
```

#### Get Approved Blogs
```bash
curl -X GET http://localhost:5000/blogs
```

#### Get Pending Blogs
```bash
curl -X GET http://localhost:5000/blogs/pending
```

#### Get Department Pending Blogs
```bash
curl -X GET http://localhost:5000/blogs/pending/1
```

#### Approve Blog
```bash
curl -X PUT http://localhost:5000/blogs/5/approve \
  -H "Content-Type: application/json" \
  -d '{"reviewed_by":3}'
```

#### Reject Blog
```bash
curl -X PUT http://localhost:5000/blogs/5/reject \
  -H "Content-Type: application/json" \
  -d '{"reviewed_by":3}'
```

#### Get User
```bash
curl -X GET http://localhost:5000/users/1
```

#### Get All Departments
```bash
curl -X GET http://localhost:5000/departments
```

#### Get Department
```bash
curl -X GET http://localhost:5000/departments/1
```

---

## 🗄️ SQL Query Examples

### Get User for Login
```sql
SELECT u.user_id, u.name, u.email, u.role_id, u.department_id, r.role_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.role_id
WHERE u.email = 'student@college.edu' AND u.password = 'password123';
```

### Get Approved Blogs
```sql
SELECT 
  bp.post_id, 
  bp.title, 
  bp.content,
  bp.created_at,
  bp.status,
  u.name as author_name,
  d.department_name
FROM blog_posts bp
LEFT JOIN users u ON bp.author_id = u.user_id
LEFT JOIN departments d ON bp.department_id = d.department_id
WHERE bp.status = 'Approved'
ORDER BY bp.created_at DESC;
```

### Get Pending Blogs
```sql
SELECT 
  bp.post_id, 
  bp.title, 
  bp.content,
  bp.created_at,
  u.name as author_name,
  d.department_name
FROM blog_posts bp
LEFT JOIN users u ON bp.author_id = u.user_id
LEFT JOIN departments d ON bp.department_id = d.department_id
WHERE bp.status = 'Pending'
ORDER BY bp.created_at DESC;
```

### Get Department Pending Blogs
```sql
SELECT 
  bp.post_id, 
  bp.title, 
  bp.content,
  bp.created_at,
  u.name as author_name
FROM blog_posts bp
LEFT JOIN users u ON bp.author_id = u.user_id
WHERE bp.status = 'Pending' AND bp.department_id = 1
ORDER BY bp.created_at DESC;
```

### Get User's Blogs
```sql
SELECT 
  post_id,
  title,
  content,
  created_at,
  status,
  department_id,
  d.department_name
FROM blog_posts bp
LEFT JOIN departments d ON bp.department_id = d.department_id
WHERE author_id = 1
ORDER BY created_at DESC;
```

### Insert Blog
```sql
INSERT INTO blog_posts (title, content, status, author_id, department_id, created_at)
VALUES ('My Blog', 'Blog content...', 'Pending', 1, 1, NOW());
```

### Approve Blog
```sql
UPDATE blog_posts
SET status = 'Approved', reviewed_by = 3, updated_at = NOW()
WHERE post_id = 5;
```

### Reject Blog
```sql
UPDATE blog_posts
SET status = 'Rejected', reviewed_by = 3, updated_at = NOW()
WHERE post_id = 5;
```

---

## 📊 Data Models

### User Model
```typescript
interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;        // In real app, this is hashed
  role_id: number;
  role_name: string;       // From JOIN
  department_id: number | null;
  created_at: string;      // ISO timestamp
}
```

### Blog Model
```typescript
interface Blog {
  post_id: number;
  title: string;
  content: string;
  created_at: string;      // ISO timestamp
  updated_at: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  author_id: number;
  author_name: string;     // From JOIN
  department_id: number;
  department_name: string; // From JOIN
  reviewed_by: number | null;
}
```

### Department Model
```typescript
interface Department {
  department_id: number;
  department_name: string;
  description: string;
}
```

---

## 🐛 Common Error Solutions

### Error: "Cannot GET /blogs"
**Solution:** Backend server not running. Run `node backend/server.cjs`

### Error: "Database error: connect ECONNREFUSED"
**Solution:** MySQL not running. Start MySQL service

### Error: "Invalid email or password"
**Solution:** Check database has user with exact email/password. Demo: `student@college.edu` / `password123`

### Error: "404 Not Found"
**Solution:** Check endpoint URL matches exactly. Use correct HTTP method (GET, POST, PUT)

### Error: CORS blocked request
**Solution:** Backend CORS is configured. Ensure frontend is on `http://localhost:5173`

### Error: "Access denied for user"
**Solution:** MySQL user/password mismatch. Update in `server.cjs`

---

## 🔑 Demo Credentials

| Role | Email | Password | Department |
|------|-------|----------|-----------|
| Student | student@college.edu | password123 | Computer Science |
| Dept Head | head@college.edu | password123 | Computer Science |
| Admin | admin@college.edu | password123 | N/A |

---

## ✅ Validation Rules

### Blog Submission
- Title: Required, string
- Content: Required, minimum 100 characters
- Department: Required, valid department_id
- Author: Current logged-in user

### Login
- Email: Required, valid format
- Password: Required, case-sensitive

### Blog Approval/Rejection
- Blog ID: Required, valid blog ID
- Reviewed By: Required, valid user ID
- Status: Changes to 'Approved' or 'Rejected'

---

## 🔄 State Management in React

### User Session
```typescript
// Store on login
import { setUserSession } from '../utils/api';
const user = await login(email, password);
setUserSession(user);  // Stores in localStorage

// Get on page load
import { getUserSession } from '../utils/api';
const user = getUserSession();  // Retrieves from localStorage

// Clear on logout
import { clearUserSession } from '../utils/api';
clearUserSession();  // Removes from localStorage
```

### Blog State (Component Level)
```typescript
const [blogs, setBlogs] = useState<Blog[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const data = await getApprovedBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  loadBlogs();
}, []);
```

---

## 🚀 Performance Tips

### Avoid N+1 Queries
```typescript
// ❌ BAD - Makes multiple API calls in loop
blogs.forEach(blog => {
  const dept = await getDepartmentById(blog.department_id);
});

// ✅ GOOD - Departments included in blog response
// Already included from LEFT JOIN in API
```

### Use Proper Error Boundaries
```typescript
try {
  // API call
} catch (error) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('An unknown error occurred');
  }
}
```

### Show Loading States
```typescript
if (isLoading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}
```

---

## 📝 API Response Formats

### Success Response
```json
{
  "data": { ... },        // If returning data
  "message": "Success"    // If just confirming
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

### Empty Result
```json
[]  // Returns empty array for GET requests with no matches
```

---

This quick reference covers all the common operations for your blogging website!
