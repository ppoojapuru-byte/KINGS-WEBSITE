import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowRight, Calendar, User, BookOpen, Bell } from 'lucide-react';
import { getApprovedBlogs, getBlogsByAuthor, getUserSession } from '../utils/api';
import { departments, blogs, users } from '../data/mockData.ts';
import campusImage from "../../assets/kcic-campus.jpg";

export default function HomePage() {
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const featuredDepartments = departments.slice(0, 4);
  const latestAnnouncements = [...announcements]
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 3);

  useEffect(() => {
    const loadAnnouncements = async () => {
  try {
    const res = await fetch("http://127.0.0.1:5000/announcements");
    const data = await res.json();
    setAnnouncements(data);
  } catch (error) {
    console.error("Failed to load announcements:", error);
  }
};
    
    const loadLatestBlogs = async () => {
      setIsLoading(true);
      const currentUser = getUserSession();

      try {
        const apiBlogsData = await getApprovedBlogs();
        let combinedBlogs: any[] = [];

        if (apiBlogsData && apiBlogsData.length > 0) {
          combinedBlogs = [...apiBlogsData];
        }

        if (currentUser) {
          const authorBlogs = await getBlogsByAuthor(currentUser.user_id);
          const pendingAndApproved = authorBlogs
            .filter((blog: any) => ['Pending', 'Approved'].includes(blog.status))
            .map((blog: any) => ({
              ...blog,
              author_name: blog.author_name || currentUser.name,
              department_name: blog.department_name || 'Unknown Department',
            }));

          // Ensure no duplicate entries by post_id
          const existingIds = new Set<number>(combinedBlogs.map((b: any) => b.post_id));
          pendingAndApproved.forEach((b: any) => {
            if (!existingIds.has(b.post_id)) {
              combinedBlogs.unshift(b);
            }
          });
        }

        if (combinedBlogs.length === 0) {
          // Fallback to mock data
          const mockApprovedBlogs = blogs
            .filter(b => b.status === 'approved')
            .map(blog => {
              const author = users.find(u => u.id === blog.authorId);
              const dept = departments.find(d => d.id === blog.departmentId);
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
          combinedBlogs = mockApprovedBlogs;
        }

        setLatestBlogs(combinedBlogs.slice(0, 3));
      } catch (error) {
        console.error('Failed to load latest blogs; fallback to mock data:', error);
        const mockApprovedBlogs = blogs
          .filter(b => b.status === 'approved')
          .map(blog => {
            const author = users.find(u => u.id === blog.authorId);
            const dept = departments.find(d => d.id === blog.departmentId);
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
        setLatestBlogs(mockApprovedBlogs.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnouncements();
    loadLatestBlogs();
  }, []);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={campusImage}
            alt="College Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Welcome to KCIC Blogs
            </h1>
            <p className="text-xl text-white/90 mb-8">
              
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/blogs"
                className="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity font-medium"
                style={{ backgroundColor: '#BB8644' }}
              >
                Explore Blogs
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
                style={{ backgroundColor: '#909E84', color: 'white' }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Latest Announcements */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E3D477' }}>
                <Bell className="w-5 h-5" style={{ color: '#75654C' }} />
              </div>
              <h2 className="text-3xl" style={{ color: '#75654C' }}>Latest Announcements</h2>
            </div>
            <Link to="/announcements" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: '#BB8644' }}>
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestAnnouncements.map((announcement) => (
              <div
                key={announcement.announcement_id}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                     className="px-3 py-1 rounded-full text-xs text-white"
                     style={{ backgroundColor: '#BB8644' }} 
>
                 
                    ANNOUNCEMENT
                  </span>
                  <span className="text-xs" style={{ color: '#75654C' }}>
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="mb-2" style={{ color: '#75654C' }}>{announcement.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Approved Blogs */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#BB8644' }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl" style={{ color: '#75654C' }}>Latest Blogs</h2>
            </div>
            <Link to="/blogs" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: '#BB8644' }}>
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 text-center py-12 text-gray-500">Loading latest blogs...</div>
            ) : latestBlogs.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">No approved blogs available.</div>
            ) : (
              latestBlogs.map((blog) => (
                <Link
                  key={blog.post_id}
                  to={`/blogs/${blog.post_id}`}
                  className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: '#75654C' }}>
                      <User className="w-4 h-4" />
                      <span>{blog.author_name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{blog.department_name || 'Unknown'}</span>
                    </div>
                    <h3 className="mb-2 group-hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {blog.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#BB8644' }}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Department Highlights */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#909E84' }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl" style={{ color: '#75654C' }}>Our Departments</h2>
            </div>
            <Link to="/departments" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: '#BB8644' }}>
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDepartments.map((dept) => (
              <Link
                key={dept.id}
                to={`/departments/${dept.id}`}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow group"
              >
                <h3 className="mb-3 group-hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
                  {dept.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {dept.description}
                </p>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#BB8644' }}>
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
