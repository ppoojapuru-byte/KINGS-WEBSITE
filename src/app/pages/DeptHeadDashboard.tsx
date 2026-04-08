import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { FileText, BookOpen, LogOut, Check, X } from 'lucide-react';
import {
  getUserSession,
  clearUserSession,
  getPendingBlogsByDepartment,
  approveBlog,
  rejectBlog,
  getDepartmentById,
} from '../utils/api';

export default function DeptHeadDashboard() {
  const navigate = useNavigate();
  const currentUser = getUserSession();
  const [pendingBlogs, setPendingBlogs] = useState<any[]>([]);
  const [departmentBlogs, setDepartmentBlogs] = useState<any[]>([]);
  const [department, setDepartment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingBlogId, setLoadingBlogId] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role_name !== 'Department Head') {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        // Load pending blogs for the department
        const pending = await getPendingBlogsByDepartment(currentUser.department_id);
        setPendingBlogs(pending);

        // Load department info
        const deptData = await getDepartmentById(currentUser.department_id);
        setDepartment(deptData);

        // For now, departmentBlogs will be the same as pending
        // In a real scenario, you might want to add an API to get all blogs from a department
        setDepartmentBlogs(pending);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser, navigate]);

  const handleApprove = async (blogId: number) => {
    if (!currentUser) return;

    setLoadingBlogId(blogId);
    try {
      await approveBlog(blogId, currentUser.user_id);
      setPendingBlogs(pendingBlogs.filter((b) => b.post_id !== blogId));
      setDepartmentBlogs(departmentBlogs.filter((b) => b.post_id !== blogId));
      alert('Blog approved successfully!');
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Failed to approve blog. Please try again.');
    } finally {
      setLoadingBlogId(null);
    }
  };

  const handleReject = async (blogId: number) => {
    if (!currentUser) return;

    setLoadingBlogId(blogId);
    try {
      await rejectBlog(blogId, currentUser.user_id);
      setPendingBlogs(pendingBlogs.filter((b) => b.post_id !== blogId));
      setDepartmentBlogs(departmentBlogs.filter((b) => b.post_id !== blogId));
      alert('Blog rejected successfully!');
    } catch (error) {
      console.error('Rejection failed:', error);
      alert('Failed to reject blog. Please try again.');
    } finally {
      setLoadingBlogId(null);
    }
  };

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
            <h1 className="text-3xl mb-2" style={{ color: '#75654C' }}>Department Head Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser.name}!</p>
            {department && (
              <p className="text-sm text-gray-500">Managing: {department.department_name}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: '#BB8644' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#BB8644' }}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1" style={{ color: '#75654C' }}>Pending Blogs</h3>
            <p className="text-sm text-gray-600">{pendingBlogs.length} waiting</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#909E84' }}>
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1" style={{ color: '#75654C' }}>Approve / Reject</h3>
            <p className="text-sm text-gray-600">Review below</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#E8B38C' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#75654C' }} />
            </div>
            <h3 className="mb-1" style={{ color: '#75654C' }}>Department Blogs</h3>
            <p className="text-sm text-gray-600">{departmentBlogs.length} total</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#75654C' }}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1" style={{ color: '#75654C' }}>Info</h3>
            <p className="text-sm text-gray-600">Manager Role</p>
          </div>

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

        {/* Pending Blogs Section */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6" style={{ color: '#75654C' }}>Pending Blogs for Review</h2>

          {pendingBlogs.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No pending blogs to review.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#F5F0EA' }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Blog Title</th>
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Author</th>
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Date</th>
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pendingBlogs.map((blog) => (
                      <tr key={blog.post_id}>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <p className="font-medium" style={{ color: '#75654C' }}>{blog.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">{blog.content}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{blog.author_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(blog.post_id)}
                              disabled={loadingBlogId === blog.post_id}
                              className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                              style={{ backgroundColor: '#909E84' }}
                            >
                              <Check className="w-4 h-4" />
                              {loadingBlogId === blog.post_id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReject(blog.post_id)}
                              disabled={loadingBlogId === blog.post_id}
                              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              {loadingBlogId === blog.post_id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Department Blogs Section */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#75654C' }}>All Department Blogs</h2>

          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#F5F0EA' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Blog Title</th>
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Author</th>
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Status</th>
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {departmentBlogs.map((blog) => (
                    <tr key={blog.post_id}>
                      <td className="px-6 py-4">
                        <p className="font-medium" style={{ color: '#75654C' }}>{blog.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{blog.author_name}</td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}