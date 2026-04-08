import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Layout from '../components/Layout';
import { Search, Filter, Calendar, User, BookOpen } from 'lucide-react';
import { getApprovedBlogs, getDepartments, getBlogsByAuthor, getUserSession } from '../utils/api';
import { blogs, departments as mockDepartments, users } from '../data/mockData';



export default function BlogListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [approvedBlogs, setApprovedBlogs] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const [blogsData, deptsData] = await Promise.all([getApprovedBlogs(), getDepartments()]);
        const currentUser = getUserSession();

        let finalBlogs = [];

        if (blogsData && blogsData.length > 0) {
          finalBlogs = [...blogsData];
        }

        if (currentUser) {
          const userBlogs = await getBlogsByAuthor(currentUser.user_id);

          const userRelevant = (userBlogs || [])
            .filter((b: any) => ['Pending', 'Approved'].includes(b.status))
            .map((b: any) => ({
              ...b,
              author_name: b.author_name || currentUser.name,
              department_name: b.department_name || 'Unknown',
            }));

          const existingIds = new Set(finalBlogs.map((b: any) => b.post_id));
          for (const blog of userRelevant) {
            if (!existingIds.has(blog.post_id)) {
              finalBlogs.unshift(blog);
            }
          }
        }

        if (finalBlogs.length === 0) {
          // fallback to mock approved blogs when API returns none
          finalBlogs = blogs
            .filter((b) => b.status === 'approved')
            .map((blog) => {
              const author = users.find((u) => u.id === blog.authorId);
              const dept = mockDepartments.find((d) => d.id === blog.departmentId);
              return {
                post_id: blog.id,
                title: blog.title,
                content: blog.content,
                author_id: parseInt(blog.authorId),
                author_name: author?.name || 'Unknown Author',
                department_id: parseInt(blog.departmentId),
                department_name: dept?.name || 'Unknown Department',
                created_at: blog.createdAt,
              };
            });
        }

        setApprovedBlogs(finalBlogs);

        if (deptsData && deptsData.length > 0) {
          setDepartments(deptsData);
        } else {
          setDepartments(
            mockDepartments.map((dept) => ({
              department_id: parseInt(dept.id),
              department_name: dept.name,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to load data, using mock blogs:', error);

        const transformedBlogs = blogs
          .filter((b) => b.status === 'approved')
          .map((blog) => {
            const author = users.find((u) => u.id === blog.authorId);
            const dept = mockDepartments.find((d) => d.id === blog.departmentId);
            return {
              post_id: blog.id,
              title: blog.title,
              content: blog.content,
              author_id: parseInt(blog.authorId),
              author_name: author?.name || 'Unknown Author',
              department_id: parseInt(blog.departmentId),
              department_name: dept?.name || 'Unknown Department',
              created_at: blog.createdAt,
            };
          });

        setApprovedBlogs(transformedBlogs);
        setDepartments(
          mockDepartments.map((dept) => ({
            department_id: parseInt(dept.id),
            department_name: dept.name,
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique authors from approved blogs
  const authors = Array.from(
    new Map(approvedBlogs.map((blog) => [blog.author_id, blog])).values()
  ).map((blog) => ({ id: blog.author_id, name: blog.author_name }));

  // Get department by ID
  const getDepartmentName = (deptId: number) => {
    const dept = departments.find((d) => d.department_id === deptId);
    return dept?.department_name || 'Unknown';
  };

  // Filter blogs
  const filteredBlogs = approvedBlogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || blog.department_id === parseInt(selectedDepartment);
    const matchesAuthor = selectedAuthor === 'all' || blog.author_id === parseInt(selectedAuthor);

    return matchesSearch && matchesDepartment && matchesAuthor;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16" style={{ backgroundColor: '#F5F0EA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#75654C' }}>College Blogs</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover insights, research, and stories from our talented students and faculty
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search & Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-5 h-5" style={{ color: '#BB8644' }} />
              <h2 className="text-xl" style={{ color: '#75654C' }}>Search & Filter</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-2" style={{ color: '#75654C' }}>
                  Search by Topic or Author
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm mb-2" style={{ color: '#75654C' }}>
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Filter */}
              <div>
                <label className="block text-sm mb-2" style={{ color: '#75654C' }}>
                  Author
                </label>
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Authors</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredBlogs.length} of {approvedBlogs.length} blogs
          </p>
        </div>

        {/* Blog Cards */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No blogs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.post_id}
                to={`/blogs/${blog.post_id}`}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: '#75654C' }}>
                  <User className="w-4 h-4" />
                  <span>{blog.author_name}</span>
                </div>

                <h3 className="mb-2 group-hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {blog.content}
                </p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1" style={{ color: '#BB8644' }}>
                    <BookOpen className="w-4 h-4" />
                    <span>{blog.department_name}</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: '#909E84' }}>
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
