import { Link } from 'react-router';
import Layout from '../components/Layout';
import { ArrowRight, BookOpen } from 'lucide-react';
import { departments } from '../data/mockData';

export default function DepartmentsPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16" style={{ backgroundColor: '#F5F0EA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#75654C' }}>Our Departments</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore our diverse range of academic departments, each committed to excellence in education and research
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-lg border border-border p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#BB8644' }}>
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl mb-2" style={{ color: '#75654C' }}>{dept.name}</h2>
                  <p className="text-gray-600">{dept.description}</p>
                </div>
              </div>

              <Link
                to={`/departments/${dept.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#909E84' }}
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
