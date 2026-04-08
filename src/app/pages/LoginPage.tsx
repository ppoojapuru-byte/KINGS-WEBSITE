import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { LogIn, GraduationCap } from 'lucide-react';
import { login, setUserSession } from '../utils/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the login API
      const user = await login(email, password);

      // Store user session in localStorage
      setUserSession(user);

      // Redirect based on role
      switch (user.role_name) {
        case 'Student':
          navigate('/dashboard/student');
          break;
        case 'Department Head':
          navigate('/dashboard/dept-head');
          break;
        case 'Admin':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[600px] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-border p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#BB8644' }}>
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2" style={{ color: '#75654C' }}>Welcome Back</h1>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            {/* Demo Credentials */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F5F0EA' }}>
              <p className="text-sm mb-2" style={{ color: '#75654C' }}>
                <strong>Demo Credentials:</strong>
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Student: student@college.edu</div>
                <div>Dept Head: head@college.edu</div>
                <div>Admin: admin@college.edu</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm mb-2" style={{ color: '#75654C' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@college.edu"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm mb-2" style={{ color: '#75654C' }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#BB8644' }}
              >
                <LogIn className="w-5 h-5" />
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Don't have an account? Contact administration</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
