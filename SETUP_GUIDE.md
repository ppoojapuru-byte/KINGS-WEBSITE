# Full-Stack Academic Blogging Website - Setup & Integration Guide

## Overview

Your college blogging website has been successfully modified to connect the frontend with a backend API and MySQL database. This document explains all the changes made and how to set up and run everything.

---

## 🎯 What Was Done

### 1. **Backend API Server** (`backend/server.cjs`)
Complete Express.js server with:
- Authentication system (POST /login)
- Blog CRUD operations
- User and department management
- Blog approval/rejection workflow
- MySQL database integration

### 2. **MySQL Database Schema** (`backend/database_schema.sql`)
Complete database setup with:
- Users table with roles and departments
- Roles table (Admin, Department Head, Student)
- Departments table
- Blog posts table with status tracking
- Proper foreign key relationships

### 3. **Frontend API Utility** (`src/app/utils/api.ts`)
Centralized API client with all necessary functions:
- Login authentication
- Blog CRUD operations
- User session management
- Department fetching

### 4. **Updated Frontend Pages**
All pages now use real API calls instead of mock data:
- **LoginPage.tsx** - Real authentication with backend
- **BlogSubmissionPage.tsx** - Submit blogs to database
- **BlogListPage.tsx** - Fetch approved blogs from API
- **AdminDashboard.tsx** - Review and approve/reject blogs
- **DeptHeadDashboard.tsx** - Department-specific blog management
- **StudentDashboard.tsx** - View student's own blogs

---

## 📋 Setup Instructions

### Step 1: Install Required Dependencies

First, ensure your `package.json` includes the necessary backend packages:

```bash
npm install express body-parser cors mysql2
```

Make sure these are already in your dependencies. The backend uses `mysql2` for database connection.

### Step 2: Set Up MySQL Database

1. **Open MySQL Command Line or MySQL Workbench**

2. **Run the database schema:**
   ```bash
   mysql> source /path/to/backend/database_schema.sql
   ```
   
   Or copy the entire SQL content from `backend/database_schema.sql` and execute it.

3. **Verify the database was created:**
   ```bash
   mysql> SHOW DATABASES;
   mysql> USE college_blog_db;
   mysql> SHOW TABLES;
   ```

### Step 3: Configure Backend Connection

Update the MySQL connection settings in `backend/server.cjs`:

```javascript
const db = mysql.createConnection({
  host: 'localhost',        // Your MySQL host
  user: 'root',            // Your MySQL username
  password: '',            // Your MySQL password (empty by default)
  database: 'college_blog_db',
});
```

### Step 4: Start the Backend Server

```bash
node backend/server.cjs
```

Expected output:
```
Connected to MySQL Database
Server is running on http://localhost:5000
```

### Step 5: Start the Frontend Development Server

In a separate terminal:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is in use).

---

## 🔑 Demo Credentials

Use these credentials to test the system:

**Student Login:**
- Email: `student@college.edu`
- Password: `password123`
- Role: Student

**Department Head Login:**
- Email: `head@college.edu`
- Password: `password123`
- Role: Department Head (Computer Science)

**Admin Login:**
- Email: `admin@college.edu`
- Password: `password123`
- Role: Admin

---

## 📝 API Endpoints Reference

### Authentication
- **POST** `/login` - User login
  - Request: `{ email, password }`
  - Response: User data with role and department info

### Blogs
- **GET** `/blogs` - Get all approved blogs
- **GET** `/blogs/pending` - Get all pending blogs (admin)
- **GET** `/blogs/pending/:department_id` - Get department's pending blogs
- **GET** `/blogs/:id` - Get specific blog
- **GET** `/blogs/author/:author_id` - Get blogs by author
- **POST** `/blogs` - Create new blog
  - Request: `{ title, content, author_id, department_id }`
- **PUT** `/blogs/:id/approve` - Approve a blog
  - Request: `{ reviewed_by }`
- **PUT** `/blogs/:id/reject` - Reject a blog
  - Request: `{ reviewed_by }`

### Users
- **GET** `/users/:id` - Get user by ID

### Departments
- **GET** `/departments` - Get all departments
- **GET** `/departments/:id` - Get specific department

---

## 🔄 Frontend-Backend Data Flow

### Login Flow
```
User fills login form
  ↓
Frontend calls: login(email, password)
  ↓
API calls: POST /login
  ↓
Backend validates credentials in MySQL users table
  ↓
Returns user object with role and department
  ↓
Frontend stores user in localStorage
  ↓
Redirect to appropriate dashboard
```

### Blog Submission Flow
```
Student fills blog form
  ↓
Frontend calls: createBlog(title, content, author_id, dept_id)
  ↓
API calls: POST /blogs
  ↓
Backend inserts blog with status="Pending"
  ↓
Blog appears in Admin/DeptHead pending list
```

### Blog Approval Flow
```
Admin/DeptHead clicks Approve button
  ↓
Frontend calls: approveBlog(blogId, reviewedBy)
  ↓
API calls: PUT /blogs/:id/approve
  ↓
Backend updates status to "Approved"
  ↓
Blog appears on public BlogListPage
```

---

## 📂 File Structure

```
KCIC WEB/
├── backend/
│   ├── server.cjs              ✗ UPDATED - Complete Express server
│   └── database_schema.sql     ✗ NEW - MySQL schema
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx               ✗ UPDATED
│   │   │   ├── BlogSubmissionPage.tsx      ✗ UPDATED
│   │   │   ├── BlogListPage.tsx            ✗ UPDATED
│   │   │   ├── AdminDashboard.tsx          ✗ UPDATED
│   │   │   ├── DeptHeadDashboard.tsx       ✗ UPDATED
│   │   │   └── StudentDashboard.tsx        ✗ UPDATED
│   │   ├── utils/
│   │   │   └── api.ts                      ✗ NEW - API client
│   │   └── data/
│   │       └── mockData.ts                 (No longer used)
```

---

## 🔧 Key Technical Changes

### API Client Pattern (`src/app/utils/api.ts`)

```typescript
// Centralized API utility functions
export const login = async (email: string, password: string) => {
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const createBlog = async (
  title: string,
  content: string,
  author_id: number,
  department_id: number
) => {
  return apiCall('/blogs', {
    method: 'POST',
    body: JSON.stringify({ title, content, author_id, department_id }),
  });
};
```

### Session Management

**Frontend:**
```typescript
// Store session after login
setUserSession(user);

// Get session on page load
const currentUser = getUserSession();

// Clear session on logout
clearUserSession();
```

**Storage:**
- User data is stored in localStorage under key `currentUser`
- Persists across browser refreshes
- Cleared when user logs out

### Error Handling

All API calls include try-catch with user-friendly error messages:
```typescript
try {
  const result = await apiCall(...);
  // Success handling
} catch (error) {
  // Display error message to user
  console.error(error);
}
```

---

## ⚠️ Important Security Notes

### For Production:

1. **Password Security:**
   - **NEVER** store passwords in plain text (current demo only)
   - Use bcrypt or similar for password hashing
   - Update database schema to hash passwords

2. **Environment Variables:**
   - Use `.env` file for database credentials
   - Don't commit sensitive data to GitHub
   
   Example `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=college_blog_db
   PORT=5000
   ```

3. **Session/Authentication:**
   - Implement JWT tokens instead of localStorage
   - Add session expiration time
   - Implement refresh token rotation

4. **CORS:**
   - Currently allows all origins: `app.use(cors());`
   - Restrict to specific frontend URL in production:
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com',
     credentials: true
   }));
   ```

5. **Input Validation:**
   - Add validation on backend for all inputs
   - Sanitize user inputs to prevent SQL injection
   - Use parameterized queries (already done in code)

---

## 🧪 Testing the Integration

### Test 1: Login
1. Go to http://localhost:5173/login
2. Use any demo credential
3. Verify redirect to correct dashboard

### Test 2: Blog Submission
1. Login as Student
2. Click "Submit Blog"
3. Fill form and submit
4. Check Admin dashboard - blog should appear as "Pending"

### Test 3: Blog Approval
1. Login as Admin
2. Click "Approve" on pending blog
3. Blog disappears from pending list
4. Visit https://localhost:5173/blogs and filter - approved blog appears

### Test 4: View My Blogs
1. Login as Student
2. Student Dashboard shows submitted blogs
3. Status changes from "Pending" to "Approved" after admin approval

---

## 📊 Database Queries Reference

### Get User Login
```sql
SELECT u.user_id, u.name, u.email, u.role_id, r.role_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.role_id
WHERE u.email = ? AND u.password = ?;
```

### Get Pending Blogs
```sql
SELECT * FROM blog_posts
WHERE status = 'Pending'
ORDER BY created_at DESC;
```

### Get Approved Blogs
```sql
SELECT * FROM blog_posts
WHERE status = 'Approved'
ORDER BY created_at DESC;
```

### Approve Blog
```sql
UPDATE blog_posts
SET status = 'Approved', reviewed_by = ?
WHERE post_id = ?;
```

---

## 🚀 Next Steps / Future Enhancements

1. **Implement JWT Authentication**
   - Replace localStorage with secure tokens
   - Add token expiration

2. **Add Comment System**
   - Create comments table
   - Add comment endpoints

3. **Add Like/Favorite Feature**
   - Track user likes on blogs
   - Show liked blogs in user dashboard

4. **Email Notifications**
   - Send email when blog is approved
   - Notify admin of new submissions

5. **Search & Advanced Filtering**
   - Full-text search on blog content
   - Filter by date range
   - Popular/trending blogs

6. **User Profile Management**
   - Allow users to update their profile
   - Profile picture uploads
   - Bio/bio management

7. **Analytics Dashboard**
   - Track blog views
   - Popular authors/blogs
   - Engagement metrics

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MySQL"
**Solution:**
- Ensure MySQL is running
- Check credentials in server.cjs
- Verify database `college_blog_db` exists

### Problem: "Login fails"
**Solution:**
- Check database has users table with demo data
- Verify passwords match exactly (password123)
- Check browser console for API errors

### Problem: "Frontend can't reach API"
**Solution:**
- Ensure backend server is running on port 5000
- Check firewall isn't blocking port 5000
- Verify CORS isn't blocking requests
- Check browser console network tab

### Problem: "Blog submission fails"
**Solution:**
- Ensure user is logged in (currentUser exists)
- Check all required fields are filled
- Verify author_id and department_id are numbers
- Check MySQL blog_posts table permissions

---

## 📞 Support

For issues:
1. Check browser console (F12) for errors
2. Check backend server terminal for logs
3. Check MySQL error logs
4. Verify all files have been updated correctly
5. Ensure database schema was loaded completely

---

## ✅ Summary

Your academic blogging website is now fully integrated with:
- ✅ Express.js backend server
- ✅ MySQL database
- ✅ Real-time API calls
- ✅ User authentication
- ✅ Blog workflow management
- ✅ Role-based access control

All frontend pages have been updated to use real data from the backend instead of mock data. The system is ready for testing and deployment!

