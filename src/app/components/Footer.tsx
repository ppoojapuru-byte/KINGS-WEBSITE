import { Link } from 'react-router';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border" style={{ backgroundColor: '#75654C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#BB8644' }}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-lg text-white">
                KCIC Blogs
              </div>
            </div>
            <p className="text-sm text-white/80">
              Empowering students through quality education and innovative learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/departments" className="text-sm text-white/80 hover:text-white transition-colors">
                  Departments
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-sm text-white/80 hover:text-white transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-sm text-white/80 hover:text-white transition-colors">
                  Announcements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-white/80 flex-shrink-0" />
                <span className="text-sm text-white/80">
                  Campus: 36, East Coast Road, Opp to MGM Theme Park, Muttukadu, Tamil Nadu 603112, India.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/80 flex-shrink-0" />
                <span className="text-sm text-white/80">
                  (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/80 flex-shrink-0" />
                <span className="text-sm text-white/80">
                  admission@edu.in
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#BB8644' }}
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#BB8644' }}
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#BB8644' }}
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#BB8644' }}
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Excellence College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
