import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import Layout from '../components/Layout';
import { FileText, Filter, Check, X, Clock, Eye } from 'lucide-react';
import { getCurrentUser, blogs, getUserById, getDepartmentById } from '../data/mockData';
import type { BlogStatus } from '../data/mockData';

export default function BlogManagementPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');
  const [localBlogs] = useState(blogs);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  // Filter blogs based on user role
  const getFilteredBlogs = () => {
    let filteredBlogs = localBlogs;

    // Role-based filtering
    if (currentUser.role === 'student') {
      // Students see only their own blogs
      filteredBlogs = filteredBlogs.filter((blog) => blog.authorId === currentUser.id);
    } else if (currentUser.role === 'dept_head') {
      // Dept heads see blogs from their department
      filteredBlogs = filteredBlogs.filter((blog) => blog.departmentId === currentUser.departmentId);
    }
    // Admins see all blogs

    // Status filtering
    if (statusFilter !== 'all') {
      filteredBlogs = filteredBlogs.filter((blog) => blog.status === statusFilter);
    }

    return filteredBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredBlogs = getFilteredBlogs();

  // Count blogs by status
  const counts = {
    approved: localBlogs.filter((b) => {
      if (currentUser.role === 'student') return b.authorId === currentUser.id && b.status === 'approved';
      if (currentUser.role === 'dept_head') return b.departmentId === currentUser.departmentId && b.status === 'approved';
      return b.status === 'approved';
    }).length,
    pending: localBlogs.filter((b) => {
      if (currentUser.role === 'student') return b.authorId === currentUser.id && b.status === 'pending';
      if (currentUser.role === 'dept_head') return b.departmentId === currentUser.departmentId && b.status === 'pending';
      return b.status === 'pending';
    }).length,
    rejected: localBlogs.filter((b) => {
      if (currentUser.role === 'student') return b.authorId === currentUser.id && b.status === 'rejected';
      if (currentUser.role === 'dept_head') return b.departmentId === currentUser.departmentId && b.status === 'rejected';
      return b.status === 'rejected';
    }).length,
  };

  const getStatusColor = (status: BlogStatus) => {
    switch (status) {
      case 'approved':
        return '#909E84';
      case 'pending':
        return '#E3D477';
      case 'rejected':
        return '#d4183d';
      default:
        return '#75654C';
    }
  };

  const getStatusIcon = (status: BlogStatus) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2" style={{ color: '#75654C' }}>Blog Management</h1>
          <p className="text-gray-600">
            {currentUser.role === 'student' && 'View all your submitted blogs and their approval status'}
            {currentUser.role === 'dept_head' && 'View all blogs from your department'}
            {currentUser.role === 'admin' && 'View all blogs across all departments'}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#909E84' }}>
                <Check className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: '#909E84' }}>{counts.approved}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>
            <button
              onClick={() => setStatusFilter('approved')}
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ color: '#909E84' }}
            >
              View All →
            </button>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E3D477' }}>
                <Clock className="w-6 h-6" style={{ color: '#75654C' }} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: '#E3D477' }}>{counts.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
            <button
              onClick={() => setStatusFilter('pending')}
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ color: '#BB8644' }}
            >
              View All →
            </button>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-500">
                <X className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-500">{counts.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
            <button
              onClick={() => setStatusFilter('rejected')}
              className="text-sm text-red-500 hover:opacity-70 transition-opacity"
            >
              View All →
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg border border-border p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5" style={{ color: '#BB8644' }} />
            <h2 className="text-xl" style={{ color: '#75654C' }}>Filter by Status</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'text-white'
                  : 'border border-border hover:bg-gray-50'
              }`}
              style={statusFilter === 'all' ? { backgroundColor: '#BB8644' } : { color: '#75654C' }}
            >
              All Blogs ({counts.approved + counts.pending + counts.rejected})
            </button>

            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'approved'
                  ? 'text-white'
                  : 'border border-border hover:bg-gray-50'
              }`}
              style={statusFilter === 'approved' ? { backgroundColor: '#909E84' } : { color: '#75654C' }}
            >
              Approved ({counts.approved})
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'pending'
                  ? 'text-white'
                  : 'border border-border hover:bg-gray-50'
              }`}
              style={statusFilter === 'pending' ? { backgroundColor: '#E3D477', color: statusFilter === 'pending' ? '#75654C' : '#75654C' } : { color: '#75654C' }}
            >
              Pending ({counts.pending})
            </button>

            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'border border-border hover:bg-gray-50'
              }`}
              style={statusFilter !== 'rejected' ? { color: '#75654C' } : {}}
            >
              Rejected ({counts.rejected})
            </button>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          {filteredBlogs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No blogs found with the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#F5F0EA' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Blog Title</th>
                    {currentUser.role !== 'student' && (
                      <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Author</th>
                    )}
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Department</th>
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Status</th>
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Submitted</th>
                    <th className="px-6 py-3 text-left text-sm" style={{ color: '#75654C' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBlogs.map((blog) => {
                    const author = getUserById(blog.authorId);
                    const department = getDepartmentById(blog.departmentId);

                    return (
                      <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <p className="font-medium line-clamp-1" style={{ color: '#75654C' }}>
                              {blog.title}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-1">{blog.content}</p>
                          </div>
                        </td>
                        {currentUser.role !== 'student' && (
                          <td className="px-6 py-4 text-sm text-gray-600">{author?.name}</td>
                        )}
                        <td className="px-6 py-4 text-sm text-gray-600">{department?.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs text-white"
                              style={{ backgroundColor: getStatusColor(blog.status) }}
                            >
                              {getStatusIcon(blog.status)}
                              {blog.status.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {blog.status === 'approved' ? (
                            <Link
                              to={`/blogs/${blog.id}`}
                              className="inline-flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
                              style={{ color: '#BB8644' }}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F5F0EA' }}>
          <p className="text-sm" style={{ color: '#75654C' }}>
            <strong>Note:</strong>{' '}
            {currentUser.role === 'student' && 'Only approved blogs are publicly visible. Pending blogs are under review, and rejected blogs need revision.'}
            {currentUser.role === 'dept_head' && 'You can manage blog approvals from your dashboard. All department blogs are shown here for reference.'}
            {currentUser.role === 'admin' && 'You have full visibility of all blogs across all departments. Manage approvals from your admin dashboard.'}
          </p>
        </div>
      </div>
    </Layout>
  );
}
