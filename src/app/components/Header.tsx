import { Link, useNavigate } from 'react-router';
import { GraduationCap, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { getUserSession, clearUserSession } from '../utils/api';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = getUserSession();

  const handleLogout = () => {
    clearUserSession();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!currentUser) return null;
    switch (currentUser.role_name) {
      case 'Student':
        return '/dashboard/student';
      case 'Department Head':
        return '/dashboard/dept-head';
      case 'Admin':
        return '/dashboard/admin';
      default:
        return null;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#BB8644' }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-lg" style={{ color: '#75654C' }}>
                KCIC Blogs
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
              Home
            </Link>
            <Link to="/about" className="hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
              About
            </Link>
            <Link to="/departments" className="hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
              Departments
            </Link>
            <Link to="/blogs" className="hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
              Blogs
            </Link>
            <Link to="/announcements" className="hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
              Announcements
            </Link>
            {currentUser && (
              <Link to="/blog-management" className="hover:opacity-70 transition-opacity" style={{ color: '#75654C' }}>
                Blog Management
              </Link>
            )}
          </nav>

          {/* Search & Login */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: '#75654C' }}
            >
              <Search className="w-5 h-5" />
            </button>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to={getDashboardLink() || '/'}
                  className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#BB8644' }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: '#75654C' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#BB8644' }}
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              style={{ color: '#75654C' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-border">
            <input
              type="text"
              placeholder="Search blogs, departments, announcements..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: '#75654C' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: '#75654C' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/departments"
                className="px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: '#75654C' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Departments
              </Link>
              <Link
                to="/blogs"
                className="px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: '#75654C' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs
              </Link>
              <Link
                to="/announcements"
                className="px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: '#75654C' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Announcements
              </Link>

              {currentUser && (
                <Link
                  to="/blog-management"
                  className="px-4 py-2 rounded-lg hover:bg-gray-100"
                  style={{ color: '#75654C' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog Management
                </Link>
              )}

              {currentUser ? (
                <>
                  <Link
                    to={getDashboardLink() || '/'}
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: '#BB8644' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-left hover:bg-gray-100"
                    style={{ color: '#75654C' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: '#BB8644' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}