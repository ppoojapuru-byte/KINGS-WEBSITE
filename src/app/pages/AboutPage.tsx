import Layout from '../components/Layout';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Target, Eye, Building, Users } from 'lucide-react';
import campusImage from "../../assets/kcic-campus.jpg";
import libraryImage from "../../assets/library.jpg";
import studentsImage from "../../assets/students.jpg";
import classroomImage from "../../assets/classroom.jpg";

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={campusImage}
            alt="About KCIC"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">About KCIC</h1>
            <p className="text-xl text-white/90">Learn about our history, mission, and values</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* College Description */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl mb-4" style={{ color: '#75654C' }}>Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Founded in 1950, Excellence College has been at the forefront of higher education for over seven decades. 
              Our institution was built on the principles of academic excellence, innovation, and community engagement.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we serve thousands of students from diverse backgrounds, offering world-class education across 
              multiple disciplines. Our commitment to excellence extends beyond the classroom, fostering critical thinking, 
              creativity, and leadership skills that prepare our students for success in an ever-changing world.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-border p-8">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#BB8644' }}>
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl mb-4" style={{ color: '#75654C' }}>Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be a globally recognized institution that transforms lives through innovative education, 
                groundbreaking research, and meaningful community partnerships. We envision a future where 
                our graduates are leaders, innovators, and changemakers in their respective fields.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-8">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#909E84' }}>
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl mb-4" style={{ color: '#75654C' }}>Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To provide accessible, high-quality education that empowers students to achieve their full potential. 
                We are committed to fostering intellectual curiosity, promoting diversity and inclusion, 
                and preparing students to make positive contributions to society through ethical leadership and innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4" style={{ color: '#75654C' }}>World-Class Facilities</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our campus features state-of-the-art facilities designed to support academic excellence and student wellbeing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src={libraryImage}
                  alt="Modern Library"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#E8B38C' }}>
                  <Building className="w-6 h-6" style={{ color: '#75654C' }} />
                </div>
                <h3 className="mb-2" style={{ color: '#75654C' }}>Modern Library</h3>
                <p className="text-sm text-gray-600">
                  A comprehensive collection of over 500,000 volumes, digital resources, and quiet study spaces 
                  available 24/7 during exam periods.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src={classroomImage}
                  alt="Research Labs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#E8B38C' }}>
                  <Building className="w-6 h-6" style={{ color: '#75654C' }} />
                </div>
                <h3 className="mb-2" style={{ color: '#75654C' }}>Research Labs</h3>
                <p className="text-sm text-gray-600">
                  Cutting-edge laboratories equipped with the latest technology for hands-on research and experimentation 
                  across all scientific disciplines.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src={studentsImage}
                  alt="Student Center"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#E8B38C' }}>
                  <Users className="w-6 h-6" style={{ color: '#75654C' }} />
                </div>
                <h3 className="mb-2" style={{ color: '#75654C' }}>Student Center</h3>
                <p className="text-sm text-gray-600">
                  A vibrant hub for student activities, featuring dining facilities, recreation areas, 
                  and spaces for clubs and organizations to meet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="rounded-lg p-12 text-center" style={{ backgroundColor: '#75654C' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-white mb-2">15,000+</div>
                <div className="text-white/80">Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">800+</div>
                <div className="text-white/80">Faculty Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-white/80">Programs</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">75+</div>
                <div className="text-white/80">Years of Excellence</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
