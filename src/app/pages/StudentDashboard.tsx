import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { FileText, PlusCircle, LogOut, BookOpen } from 'lucide-react';
import {
  getUserSession,
  clearUserSession,
  getBlogsByAuthor,
  getDepartmentById,
} from '../utils/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const currentUser = getUserSession();
  const [myBlogs, setMyBlogs] = useState<any[]>([]);
  const [department, setDepartment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role_name !== 'Student') {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        // Load user's blogs
        const blogs = await getBlogsByAuthor(currentUser.user_id);
        setMyBlogs(blogs);

        // Load department info
        if (currentUser.department_id) {
          const deptData = await getDepartmentById(currentUser.department_id);
          setDepartment(deptData);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser, navigate]);

  const handleLogout = () => {
    clearUserSession();
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: '#75654C' }}>Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser.name}!</p>
            {department && (
              <p className="text-sm text-gray-500">Department: {department.department_name}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Link
            to="/dashboard/student"
            className="bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-shadow"
            style={{ borderColor: '#BB8644' }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#BB8644' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1" style={{ color: '#75654C' }}>Dashboard</h3>
            <p className="text-sm text-gray-600">Overview</p>
          </Link>

          <Link
            to="/submit-blog"
            className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#909E84' }}>
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1" style={{ color: '#75654C' }}>Submit Blog</h3>
            <p className="text-sm text-gray-600">Create new blog</p>
          </Link>

          <Link
            to="/blogs"
            className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#E8B38C' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#75654C' }} />
            </div>
            <h3 className="mb-1" style={{ color: '#75654C' }}>View All Blogs</h3>
            <p className="text-sm text-gray-600">Published blogs</p>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#75654C' }}>
              <LogOut className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1" style={{ color: '#75654C' }}>Logout</h3>
            <p className="text-sm text-gray-600">Sign out</p>
          </button>
        </div>

        {/* My Blogs Section */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#75654C' }}>My Blogs</h2>

          {myBlogs.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">You haven't submitted any blogs yet.</p>
              <Link
                to="/submit-blog"
                className="inline-block px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#BB8644' }}
              >
                Submit Your First Blog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBlogs.map((blog) => (
                <div
                  key={blog.post_id}
                  className="bg-white rounded-lg border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs text-white"
                      style={{
                        backgroundColor:
                          blog.status === 'Approved'
                            ? '#909E84'
                            : blog.status === 'Pending'
                            ? '#E3D477'
                            : '#d4183d',
                      }}
                    >
                      {blog.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="mb-2" style={{ color: '#75654C' }}>
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {blog.content}
                  </p>

                  <p className="text-xs" style={{ color: '#BB8644' }}>
                    {blog.department_name}
                  </p>

                  {blog.status === 'Approved' && (
                    <Link
                      to={`/blogs/${blog.post_id}`}
                      className="mt-3 inline-block text-sm hover:opacity-70 transition-opacity"
                      style={{ color: '#BB8644' }}
                    >
                      View Blog →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}