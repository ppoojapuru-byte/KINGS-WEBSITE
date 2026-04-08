import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { ArrowLeft, FileText } from 'lucide-react';
import { getUserSession, createBlog, getDepartments } from '../utils/api';

export default function BlogSubmissionPage() {
  const navigate = useNavigate();
  const currentUser = getUserSession();
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    departmentId: currentUser?.department_id || '',
  });

  // Load departments on component mount
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const depts = await getDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error('Failed to load departments:', error);
      }
    };

    loadDepartments();
  }, []);

  // Check if user is logged in and is a student
  useEffect(() => {
    if (!currentUser) {
      alert('Please login to submit a blog');
      navigate('/login');
      return;
    }

    if (currentUser.role_name !== 'Student') {
      alert('Only students can submit blogs');
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);

    if (!formData.title.trim()) {
      setSubmitError('Please enter a blog title');
      setIsLoading(false);
      return;
    }

    if (formData.content.length < 100) {
      setSubmitError('Blog content must be at least 100 characters');
      setIsLoading(false);
      return;
    }

    if (!formData.departmentId) {
      setSubmitError('Please select a department');
      setIsLoading(false);
      return;
    }

    try {
      await createBlog(
        formData.title,
        formData.content,
        currentUser.user_id,
        parseInt(formData.departmentId)
      );

      alert('Blog submitted successfully! Your blog is now pending approval.');
      navigate('/dashboard/student');
    } catch (error) {
      console.error('Blog submission failed:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit blog. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
          style={{ color: '#BB8644' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-lg border border-border p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#BB8644' }}>
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl" style={{ color: '#75654C' }}>Submit Blog</h1>
              <p className="text-gray-600">Share your knowledge with the college community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm mb-2" style={{ color: '#75654C' }}>
                Blog Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a compelling title for your blog"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Department Selection */}
            <div>
              <label htmlFor="department" className="block text-sm mb-2" style={{ color: '#75654C' }}>
                Department *
              </label>
              <select
                id="department"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Editor */}
            <div>
              <label htmlFor="content" className="block text-sm mb-2" style={{ color: '#75654C' }}>
                Content *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here..."
                rows={15}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-normal"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Minimum 100 characters required. Current: {formData.content.length}
              </p>
            </div>

            {/* Status Info */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F0EA' }}>
              <p className="text-sm" style={{ color: '#75654C' }}>
                <strong>Note:</strong> Your blog will be submitted with a "Pending" status and will be reviewed by your department head before publication.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#BB8644' }}
              >
                {isLoading ? 'Submitting...' : 'Submit Blog'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 rounded-lg border border-border hover:bg-gray-50 transition-colors"
                style={{ color: '#75654C' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
