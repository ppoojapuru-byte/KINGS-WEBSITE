import { Link } from 'react-router';
import Layout from '../components/Layout';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[600px] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl mb-4" style={{ color: '#BB8644' }}>404</h1>
          <h2 className="text-3xl mb-4" style={{ color: '#75654C' }}>Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#BB8644' }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
