import { Link, useParams } from 'react-router';
import Layout from '../components/Layout';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { getDepartmentById, getBlogsByDepartment, getUserById } from '../data/mockData';

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const department = id ? getDepartmentById(id) : null;
  const departmentBlogs = id ? getBlogsByDepartment(id) : [];

  if (!department) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl mb-4" style={{ color: '#75654C' }}>Department Not Found</h1>
          <Link to="/departments" className="text-primary hover:underline">
            Back to Departments
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-12" style={{ backgroundColor: '#F5F0EA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
            style={{ color: '#BB8644' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Departments
          </Link>
          <h1 className="text-4xl mb-4" style={{ color: '#75654C' }}>{department.name}</h1>
          <p className="text-xl text-gray-700">{department.description}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Department Information */}
        <section className="mb-16">
          <div className="bg-white rounded-lg border border-border p-8">
            <h2 className="text-2xl mb-4" style={{ color: '#75654C' }}>About the Department</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{department.details}</p>
          </div>
        </section>

        {/* Department Blogs */}
        <section>
          <h2 className="text-3xl mb-6" style={{ color: '#75654C' }}>
            Blogs from {department.name}
          </h2>

          {departmentBlogs.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <p className="text-gray-600">No blogs available from this department yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentBlogs.map((blog) => {
                const author = getUserById(blog.authorId);

                return (
                  <Link
                    key={blog.id}
                    to={`/blogs/${blog.id}`}
                    className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow group"
                  >
                    <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: '#75654C' }}>
                      <User className="w-4 h-4" />
                      <span>{author?.name}</span>
                    </div>
                    <h3 className="mb-2 group-hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {blog.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#BB8644' }}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
