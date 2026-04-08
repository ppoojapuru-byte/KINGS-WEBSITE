import { Link, useParams } from 'react-router';
import Layout from '../components/Layout';
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';
import { getBlogById, getUserById, getDepartmentById } from '../data/mockData';

export default function BlogDetailsPage() {
  const { id } = useParams();
  const blog = id ? getBlogById(id) : null;
  const author = blog ? getUserById(blog.authorId) : null;
  const department = blog ? getDepartmentById(blog.departmentId) : null;

  if (!blog || blog.status !== 'approved') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl mb-4" style={{ color: '#75654C' }}>Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist or hasn't been approved yet.</p>
          <Link to="/blogs" className="text-primary hover:underline">
            Back to Blogs
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity"
          style={{ color: '#BB8644' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>

        {/* Blog Header */}
        <article className="bg-white rounded-lg border border-border p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl mb-6" style={{ color: '#75654C' }}>
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2" style={{ color: '#75654C' }}>
              <User className="w-5 h-5" />
              <div>
                <div className="text-sm text-gray-500">Author</div>
                <div>{author?.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-2" style={{ color: '#75654C' }}>
              <BookOpen className="w-5 h-5" />
              <div>
                <div className="text-sm text-gray-500">Department</div>
                <Link
                  to={`/departments/${department?.id}`}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: '#BB8644' }}
                >
                  {department?.name}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2" style={{ color: '#75654C' }}>
              <Calendar className="w-5 h-5" />
              <div>
                <div className="text-sm text-gray-500">Published</div>
                <div>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</div>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {blog.content}
            </div>
          </div>
        </article>

        {/* Related Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            to={`/departments/${department?.id}`}
            className="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#909E84' }}
          >
            More from {department?.name}
          </Link>
          <Link
            to="/blogs"
            className="px-6 py-3 rounded-lg border border-border hover:bg-gray-50 transition-colors"
            style={{ color: '#75654C' }}
          >
            Browse All Blogs
          </Link>
        </div>
      </div>
    </Layout>
  );
}
