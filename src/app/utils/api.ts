// API Configuration
const API_BASE_URL = '/api';

// Helper function to make API calls
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log('Making API call to:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('Response status:', response.status);

    const bodyText = await response.text();

    if (!response.ok) {
      if (!bodyText) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let parsed;
      try {
        parsed = JSON.parse(bodyText);
      } catch (parseError) {
        throw new Error(bodyText);
      }

      throw new Error(
        (parsed && (parsed.error || parsed.message)) ||
          `HTTP error! status: ${response.status}`
      );
    }

    if (!bodyText) {
      return null;
    }

    try {
      return JSON.parse(bodyText);
    } catch (parseError) {
      return null;
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// ================================================================
// Authentication API Calls
// ================================================================

export const login = async (email: string, password: string) => {
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// ================================================================
// Blog API Calls
// ================================================================

// Get all approved blogs
export const getApprovedBlogs = async () => {
  return apiCall('/blogs');
};

// Get all pending blogs
export const getPendingBlogs = async () => {
  return apiCall('/blogs/pending');
};

// Get pending blogs for a specific department
export const getPendingBlogsByDepartment = async (departmentId: number) => {
  return apiCall(`/blogs/pending/${departmentId}`);
};

// Get a single blog by ID
export const getBlogById = async (id: number) => {
  return apiCall(`/blogs/${id}`);
};

// Get all blogs by a specific author
export const getBlogsByAuthor = async (authorId: number) => {
  return apiCall(`/blogs/author/${authorId}`);
};

// Create a new blog post
export const createBlog = async (
  title: string,
  content: string,
  author_id: number,
  department_id: number
) => {
  return apiCall('/blogs', {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
      author_id,
      department_id,
    }),
  });
};

// Approve a blog post
export const approveBlog = async (blogId: number, reviewedBy: number) => {
  return apiCall(`/blogs/${blogId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ reviewed_by: reviewedBy }),
  });
};

// Reject a blog post
export const rejectBlog = async (blogId: number, reviewedBy: number) => {
  return apiCall(`/blogs/${blogId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reviewed_by: reviewedBy }),
  });
};

// ================================================================
// User API Calls
// ================================================================

// Get user by ID
export const getUserById = async (userId: number) => {
  return apiCall(`/users/${userId}`);
};

// ================================================================
// Department API Calls
// ================================================================

// Get all departments
export const getDepartments = async () => {
  return apiCall('/departments');
};

// Get department by ID
export const getDepartmentById = async (departmentId: number) => {
  return apiCall(`/departments/${departmentId}`);
};

// ================================================================
// Announcements API Calls
// ================================================================

// Get all announcements
export const getAnnouncements = async () => {
  return apiCall('/announcements');
};

// Create a new announcement
export const createAnnouncement = async (
  title: string,
  content: string,
  created_by: number
) => {
  return apiCall('/announcements', {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
      created_by,
    }),
  });
};

// ================================================================
// Session Management
// ================================================================

// Store user session in localStorage
export const setUserSession = (user: any) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// Get user session from localStorage
export const getUserSession = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Clear user session
export const clearUserSession = () => {
  localStorage.removeItem('currentUser');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getUserSession();
};
