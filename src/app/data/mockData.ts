export type UserRole = 'student' | 'dept_head' | 'admin';
export type BlogStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  details: string;
  headId?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  departmentId: string;
  status: BlogStatus;
  createdAt: string;
  publishedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'event' | 'update';
  createdAt: string;
}

// Mock Users
export const users: User[] = [
  { id: '1', name: 'John Student', email: 'student@college.edu', role: 'student', departmentId: '1' },
  { id: '2', name: 'Dr. Sarah Head', email: 'head@college.edu', role: 'dept_head', departmentId: '1' },
  { id: '3', name: 'Admin User', email: 'admin@college.edu', role: 'admin' },
  { id: '4', name: 'Jane Doe', email: 'jane@college.edu', role: 'student', departmentId: '2' },
  { id: '5', name: 'Dr. Michael Brown', email: 'mbrown@college.edu', role: 'dept_head', departmentId: '2' },
];

// Mock Departments
export const departments: Department[] = [
  {
    id: '1',
    name: 'Computer Science',
    description: 'Pioneering the future of technology and innovation through cutting-edge research and education.',
    details: 'The Computer Science department offers undergraduate and graduate programs focusing on software engineering, artificial intelligence, cybersecurity, and data science. Our state-of-the-art labs and experienced faculty provide students with hands-on experience in the latest technologies.',
    headId: '2',
  },
  {
    id: '2',
    name: 'Business Administration',
    description: 'Developing tomorrow\'s business leaders with comprehensive management and entrepreneurship programs.',
    details: 'Our Business Administration department prepares students for successful careers in various business sectors. With emphasis on leadership, strategic thinking, and ethical business practices, students gain practical experience through internships and real-world case studies.',
    headId: '5',
  },
  {
    id: '3',
    name: 'Engineering',
    description: 'Building innovative solutions to complex engineering challenges through hands-on learning.',
    details: 'The Engineering department encompasses mechanical, electrical, and civil engineering programs. Students work on real-world projects, participate in research initiatives, and collaborate with industry partners to develop practical engineering solutions.',
  },
  {
    id: '4',
    name: 'Arts & Humanities',
    description: 'Exploring human culture, creativity, and critical thinking through diverse artistic disciplines.',
    details: 'Our Arts & Humanities department offers programs in literature, philosophy, history, and fine arts. Students develop critical thinking skills, cultural awareness, and creative expression through rigorous academic study and artistic practice.',
  },
];

// Mock Blogs
export const blogs: Blog[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Education',
    content: `Artificial Intelligence is revolutionizing the way we approach education. From personalized learning experiences to automated grading systems, AI is making education more accessible and efficient.

In this comprehensive analysis, we explore how machine learning algorithms are being used to identify student learning patterns and adapt curriculum accordingly. We discuss the ethical implications of AI in education and the importance of maintaining human oversight in the learning process.

Key areas covered include:
- Adaptive learning platforms
- Intelligent tutoring systems
- Automated assessment tools
- Predictive analytics for student success
- Ethical considerations and privacy concerns

The integration of AI in education promises to transform traditional teaching methods while maintaining the essential human element that makes learning meaningful and engaging.`,
    authorId: '1',
    departmentId: '1',
    status: 'approved',
    createdAt: '2026-02-28T10:00:00Z',
    publishedAt: '2026-02-28T12:00:00Z',
  },
  {
    id: '2',
    title: 'Sustainable Business Practices in the Modern Economy',
    content: `Sustainability is no longer just a buzzword – it's a business imperative. Companies worldwide are recognizing that environmental and social responsibility are crucial for long-term success.

This article examines how leading businesses are integrating sustainable practices into their operations. From reducing carbon footprints to implementing circular economy principles, we explore the strategies that are driving both profitability and positive environmental impact.

Topics include:
- Green supply chain management
- Corporate social responsibility initiatives
- Sustainable finance and investment
- Employee engagement in sustainability programs
- Measuring and reporting environmental impact

The business case for sustainability is stronger than ever, with consumers, investors, and regulators all demanding greater accountability from corporations.`,
    authorId: '4',
    departmentId: '2',
    status: 'approved',
    createdAt: '2026-02-27T14:30:00Z',
    publishedAt: '2026-02-27T16:00:00Z',
  },
  {
    id: '3',
    title: 'Innovations in Renewable Energy Engineering',
    content: `The renewable energy sector is experiencing unprecedented growth and innovation. Engineers are developing new technologies that make clean energy more efficient and affordable than ever before.

This post explores recent breakthroughs in solar panel efficiency, wind turbine design, and energy storage solutions. We also discuss the challenges that remain in transitioning to a fully renewable energy grid.

Key innovations discussed:
- Next-generation photovoltaic cells
- Offshore wind farm technology
- Advanced battery storage systems
- Smart grid integration
- Hydrogen fuel cell developments

As we move toward a carbon-neutral future, these engineering innovations will play a critical role in addressing climate change.`,
    authorId: '1',
    departmentId: '3',
    status: 'approved',
    createdAt: '2026-02-26T09:15:00Z',
    publishedAt: '2026-02-26T11:00:00Z',
  },
  {
    id: '4',
    title: 'The Role of Art in Social Change',
    content: `Throughout history, art has been a powerful catalyst for social change. From political murals to protest music, artists have used their creativity to challenge injustice and inspire action.

This essay examines contemporary art movements that address social issues such as inequality, environmental degradation, and human rights. We analyze how different artistic mediums contribute to raising awareness and fostering dialogue.

Areas explored:
- Street art and activism
- Documentary photography
- Performance art and protest
- Digital art and social media
- Community-based art projects

Art's unique ability to evoke emotion and provoke thought makes it an invaluable tool in the pursuit of social justice and positive change.`,
    authorId: '4',
    departmentId: '4',
    status: 'approved',
    createdAt: '2026-02-25T16:00:00Z',
    publishedAt: '2026-02-25T18:00:00Z',
  },
  {
    id: '5',
    title: 'Cybersecurity Best Practices for Small Businesses',
    content: `Small businesses are increasingly becoming targets for cyber attacks. This guide provides practical cybersecurity measures that can protect your business from common threats.

We cover essential topics like password management, network security, employee training, and incident response planning. Learn how to create a security-conscious culture in your organization.`,
    authorId: '1',
    departmentId: '1',
    status: 'pending',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: '6',
    title: 'Understanding Blockchain Technology',
    content: `Blockchain is more than just cryptocurrency. This article explores the fundamental concepts behind distributed ledger technology and its potential applications across various industries.`,
    authorId: '4',
    departmentId: '1',
    status: 'rejected',
    createdAt: '2026-02-24T12:00:00Z',
  },
];

// Mock Announcements
export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Annual Tech Symposium 2026',
    content: 'Join us for the Annual Tech Symposium on March 15, 2026. Leading industry experts will share insights on emerging technologies. Register now!',
    type: 'event',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: '2',
    title: 'New Research Lab Opening',
    content: 'We are excited to announce the opening of our state-of-the-art AI Research Lab in Building C. The facility will be available to students and faculty starting March 10.',
    type: 'news',
    createdAt: '2026-02-28T15:00:00Z',
  },
  {
    id: '3',
    title: 'Spring Break Schedule',
    content: 'The college will be closed for Spring Break from March 20-28, 2026. Classes will resume on March 29. Have a great break!',
    type: 'update',
    createdAt: '2026-02-27T10:00:00Z',
  },
  {
    id: '4',
    title: 'Career Fair Registration Open',
    content: 'The Spring Career Fair is scheduled for April 5, 2026. Over 50 companies will be attending. Register on the career services portal.',
    type: 'event',
    createdAt: '2026-02-26T14:00:00Z',
  },
  {
    id: '5',
    title: 'Library Extended Hours',
    content: 'During finals week (March 13-19), the library will be open 24/7 to support your studies.',
    type: 'update',
    createdAt: '2026-02-25T11:00:00Z',
  },
];

// Current logged in user (for demo purposes)
export let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;

// Helper functions
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getDepartmentById = (id: string) => departments.find(d => d.id === id);
export const getBlogById = (id: string) => blogs.find(b => b.id === id);
export const getApprovedBlogs = () => blogs.filter(b => b.status === 'approved');
export const getPendingBlogs = () => blogs.filter(b => b.status === 'pending');
export const getBlogsByDepartment = (deptId: string) => blogs.filter(b => b.departmentId === deptId && b.status === 'approved');
export const getBlogsByAuthor = (authorId: string) => blogs.filter(b => b.authorId === authorId);

export const addAnnouncement = (announcement: Announcement) => {
  announcements.unshift(announcement);
};
