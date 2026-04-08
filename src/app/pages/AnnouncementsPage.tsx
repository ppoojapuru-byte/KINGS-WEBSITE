import Layout from '../components/Layout';
import { Bell, Calendar } from 'lucide-react';
import { useEffect, useState } from "react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    // Simulate an API call to fetch announcements
    const fetchAnnouncements = async () => {
      // Replace this with your actual API call
      const response = await fetch('http://localhost:5000/announcements');
      const data = await response.json();
      setAnnouncements(data);
    };

    fetchAnnouncements();
  }, []);

  const sortedAnnouncements = [...announcements].sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'event':
        return '#BB8644';
      case 'news':
        return '#909E84';
      case 'update':
        return '#E8B38C';
      default:
        return '#75654C';
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16" style={{ backgroundColor: '#F5F0EA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: '#E3D477' }}>
            <Bell className="w-8 h-8" style={{ color: '#75654C' }} />
          </div>
          <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#75654C' }}>Announcements</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Stay updated with the latest news, events, and important updates from Excellence College
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {sortedAnnouncements.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No announcements available at this time.</p>
            </div>
          ) : (
            sortedAnnouncements.map((announcement) => (
              <div
                key={announcement.announcement_id}
                className="bg-white rounded-lg border border-border p-6 md:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs text-white font-medium"
                    style={{ backgroundColor: getAnnouncementColor(announcement.type) }}
                  >
                    ANNOUNCEMENT
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl mb-3" style={{ color: '#75654C' }}>
                  {announcement.title}
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  {announcement.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
