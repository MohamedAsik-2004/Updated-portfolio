const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

const AdminUser = require('./models/AdminUser');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const ContactMessage = require('./models/ContactMessage');
const Certification = require('./models/Certification');

const seed = async (shouldExit = true) => {
  try {
    console.log('Clearing database...');

    await AdminUser.deleteMany({});
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await ContactMessage.deleteMany({});
    await Certification.deleteMany({});

    console.log('Database cleared. Seeding initial data...');

    // Seed Admin User (using credentials in walkthrough)
    const adminPassword = 'Asik.2004';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const admin = new AdminUser({
      username: 'admin',
      passwordHash,
    });
    await admin.save();
    console.log(`Admin User seeded. Username: admin, Password: ${adminPassword}`);

    // Seed Profile
    const profile = new Profile({
      name: 'Mohamed Asik K',
      tagline: 'Flutter Developer',
      bio1: 'I am a highly motivated Flutter Developer. I specialize in crafting clean, fast, and feature-rich mobile and web applications.',
      bio2: 'With a focus on beautiful styling, fluid animations, and robust backend services, I design digital solutions that bridge the gap between complex functionality and an exceptional user experience.',
      profilePhoto: '/uploads/profile/profile.png',
      heroPhoto: '/uploads/profile/hero.png',
      resumePath: '/uploads/resume/resume.pdf',
      isAvailable: true,
      whatsappNumber: '6382555230',
      instagramUrl: 'https://www.instagram.com/rx_asik_ttp/?hl=en',
    });
    await profile.save();
    console.log('Profile seeded.');

    // Seed Projects
    const projects = [
      {
        title: 'MERN SaaS Dashboard',
        description: 'A cloud-based sales tracking SaaS panel featuring real-time data visualizations, charts, user management, and JWT-authenticated roles.',
        imageUrl: '/uploads/projects/project1.webp',
        techTags: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
        githubUrl: 'https://github.com/Panda-Coders',
        liveUrl: 'https://pandacoders.dev',
        displayOrder: 1,
        isFeatured: true,
      },
      {
        title: 'Atmospheric Task Arena',
        description: 'A dark-themed drag-and-drop kanban task planner featuring real-time collaborative socket synchronization, client caching, and glassmorphic aesthetics.',
        imageUrl: '/uploads/projects/project2.webp',
        techTags: ['React', 'TailwindCSS', 'Socket.io', 'Express', 'Framer Motion'],
        githubUrl: 'https://github.com/Panda-Coders',
        liveUrl: 'https://pandacoders.dev',
        displayOrder: 2,
        isFeatured: true,
      },
      {
        title: 'Secure File Vault API',
        description: 'A production-ready Node/Express backend that handles secure multipart file uploads, image optimizations, content validation headers, and JWT-protected downloads.',
        imageUrl: '/uploads/projects/project3.webp',
        techTags: ['Node.js', 'Express', 'Multer', 'MongoDB', 'JWT'],
        githubUrl: 'https://github.com/Panda-Coders',
        liveUrl: 'https://pandacoders.dev',
        displayOrder: 3,
        isFeatured: false,
      },
      {
        title: 'Fintech Wallet UI',
        description: 'A gorgeous glassmorphic personal finance dashboard containing scroll parallax effects, responsive grid listings, and customizable user budget goals.',
        imageUrl: '/uploads/projects/project4.webp',
        techTags: ['React', 'TailwindCSS', 'Framer Motion', 'React Query'],
        githubUrl: 'https://github.com/Panda-Coders',
        liveUrl: 'https://pandacoders.dev',
        displayOrder: 4,
        isFeatured: true,
      },
    ];

    await Project.insertMany(projects);
    console.log('Projects seeded.');

    // Seed Skills
    const skills = [
      // Frontend
      { name: 'React 18 & Vite', category: 'frontend', percentage: 90, iconClass: 'fab fa-react', displayOrder: 1 },
      { name: 'JavaScript (ES6+)', category: 'frontend', percentage: 85, iconClass: 'fab fa-js-square', displayOrder: 2 },
      { name: 'TailwindCSS & CSS3', category: 'frontend', percentage: 95, iconClass: 'fab fa-css3-alt', displayOrder: 3 },
      { name: 'Framer Motion', category: 'frontend', percentage: 80, iconClass: 'fas fa-wind', displayOrder: 4 },
      // Backend
      { name: 'Node.js & Express', category: 'backend', percentage: 85, iconClass: 'fab fa-node-js', displayOrder: 1 },
      { name: 'MongoDB & Mongoose', category: 'backend', percentage: 80, iconClass: 'fas fa-database', displayOrder: 2 },
      { name: 'REST APIs & Security', category: 'backend', percentage: 85, iconClass: 'fas fa-shield-alt', displayOrder: 3 },
      { name: 'JWT Auth & Cookies', category: 'backend', percentage: 90, iconClass: 'fas fa-key', displayOrder: 4 },
    ];

    await Skill.insertMany(skills);
    console.log('Skills seeded.');

    // Seed Certifications
    const certifications = [
      {
        title: 'Internship in IT Infrastructure',
        issuer: 'INNOSAS INFOTECH PVT LTD',
        issueDate: 'Jun 2026',
        credentialId: 'HRD/REF/049/2026',
        description: 'Completed a comprehensive 5-month hands-on industrial internship in IT Infrastructure and Systems at InnoSAS Infotech Pvt Ltd. Gained experience working with IT infrastructure, network setup, troubleshooting, and team collaboration.',
        displayOrder: 1
      },
      {
        title: 'Certification Program in Artificial Intelligence',
        issuer: 'EDUBRIDGE & NIRMAAN (INFOSYS FOUNDATION)',
        issueDate: 'Jun 2025',
        credentialId: 'EBEON05251093557',
        description: 'Successfully completed the intensive Certification Program in Artificial Intelligence with an outstanding score of 96% (Grade A+). Covered fundamental concepts of AI, Machine Learning algorithms, Python programming for AI, and real-world project implementations.',
        displayOrder: 2
      },
      {
        title: 'Internship in Full Stack Development',
        issuer: 'NOVITECH R&D PRIVATE LIMITED',
        issueDate: 'Feb 2025',
        credentialId: 'FSDIN2655',
        description: 'Completed a comprehensive 1-month hands-on industrial internship in Full Stack Development. Gained practical experience in architecting, developing, and deploying end-to-end web applications, focusing on scalable backend APIs, database design, and responsive, interactive frontend interfaces.',
        displayOrder: 3
      }
    ];

    await Certification.insertMany(certifications);
    console.log('Certifications seeded.');

    console.log('Seeding completed successfully!');
    if (shouldExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    if (shouldExit) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  dotenv.config({ path: path.join(__dirname, '.env') });
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pandacoders';

  console.log('Connecting to MongoDB...');
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB. Starting seed...');
    seed(true);
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
} else {
  module.exports = seed;
}
