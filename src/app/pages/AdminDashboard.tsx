import { useNavigate, Link } from 'react-router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Users, BookOpen, FileText, Bell, Database, LogOut, Check, X } from 'lucide-react';
import {
  getUserSession,
  clearUserSession,
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  getDepartments,
} from '../utils/api';



export default function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = getUserSession();
  const [pendingBlogs, setPendingBlogs] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingBlogId, setLoadingBlogId] = useState<number | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'news' as 'news' | 'event' | 'update',
  });
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role_name !== 'Admin') {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const blogs = await getPendingBlogs();
        const depts = await getDepartments();
        setPendingBlogs(blogs);
        setDepartments(depts);
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
      // Remove the blog from pending list
      setPendingBlogs(pendingBlogs.filter((b) => b.post_id !== blogId));
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
      // Remove the blog from pending list
      setPendingBlogs(pendingBlogs.filter((b) => b.post_id !== blogId));
      alert('Blog rejected successfully!');
    } catch (error) {
      console.error('Rejection failed:', error);
      alert('Failed to reject blog. Please try again.');
    } finally {
      setLoadingBlogId(null);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        created_by: currentUser.user_id
      })
    });

    if (!response.ok) {
      throw new Error("Failed to add announcement");
    }

    alert("Announcement added successfully!");
    setNewAnnouncement({ title: "", content: "", type: "news" });
    setShowAnnouncementForm(false);

  } catch (error) {
    console.error("Failed to add announcement:", error);
    alert("Failed to add announcement.");
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

  const getDepartmentName = (deptId: number) => {
    const dept = departments.find((d) => d.department_id === deptId);
    return dept?.department_name || 'Unknown';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: '#75654C' }}>Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <div className="bg-white rounded-lg border-2 p-4" style={{ borderColor: '#BB8644' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#BB8644' }}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#75654C' }}>Manage Users</h3>
            <p className="text-xs text-gray-600">View all users</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#909E84' }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#75654C' }}>Departments</h3>
            <p className="text-xs text-gray-600">{departments.length} depts</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#E8B38C' }}>
              <FileText className="w-5 h-5" style={{ color: '#75654C' }} />
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#75654C' }}>Approve Blogs</h3>
            <p className="text-xs text-gray-600">{pendingBlogs.length} pending</p>
          </div>

          <button
            onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
            className="bg-white rounded-lg border border-border p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#E3D477' }}>
              <Bell className="w-5 h-5" style={{ color: '#75654C' }} />
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#75654C' }}>Add Announcement</h3>
            <p className="text-xs text-gray-600">Click to add</p>
          </button>

          <div className="bg-white rounded-lg border border-border p-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#75654C' }}>
              <Database className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#75654C' }}>Database</h3>
            <p className="text-xs text-gray-600">All blogs</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-white rounded-lg border border-border p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#75654C' }}>
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#75654C' }}>Logout</h3>
            <p className="text-xs text-gray-600">Sign out</p>
          </button>
        </div>

        {/* Add Announcement Form */}
        {showAnnouncementForm && (
          <section className="mb-12">
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-2xl mb-6" style={{ color: '#75654C' }}>Add New Announcement</h2>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#75654C' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: '#75654C' }}>
                    Type
                  </label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="news">News</option>
                    <option value="event">Event</option>
                    <option value="update">Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: '#75654C' }}>
                    Content
                  </label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#BB8644' }}
                  >
                    Add Announcement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementForm(false)}
                    className="px-6 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Approve Blogs */}
        <section>
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
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Blog</th>
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Author</th>
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Department</th>
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Status</th>
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pendingBlogs.map((blog) => (
                      <tr key={blog.post_id}>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="font-medium" style={{ color: '#75654C' }}>{blog.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">{blog.content}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{blog.author_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{getDepartmentName(blog.department_id)}</td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs text-white"
                            style={{ backgroundColor: '#E3D477' }}
                          >
                            PENDING
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(blog.post_id)}
                              disabled={loadingBlogId === blog.post_id}
                              className="px-3 py-1 rounded-lg text-white hover:opacity-90 transition-opacity text-sm flex items-center gap-1 disabled:opacity-50"
                              style={{ backgroundColor: '#909E84' }}
                            >
                              <Check className="w-4 h-4" />
                              {loadingBlogId === blog.post_id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReject(blog.post_id)}
                              disabled={loadingBlogId === blog.post_id}
                              className="px-3 py-1 rounded-lg bg-red-500 text-white hover:opacity-90 transition-opacity text-sm flex items-center gap-1 disabled:opacity-50"
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
      </div>
    </Layout>
  );
}