const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Models
const AdminUser = require('../models/AdminUser');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const ContactMessage = require('../models/ContactMessage');
const Profile = require('../models/Profile');
const Certification = require('../models/Certification');

// helper helper to validation result check
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// POST /api/admin/login
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required.'),
    body('password').trim().notEmpty().withMessage('Password is required.'),
  ],
  checkValidation,
  async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const user = await AdminUser.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Generate CSRF Token for browser validation
      const csrfToken = crypto.randomBytes(32).toString('hex');

      // Set httpOnly cookie for session jwt
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Set non-httpOnly cookie for client script-headers to check CSRF
      res.cookie('csrf_token', csrfToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        message: 'Login successful.',
        user: { username: user.username },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/admin/me
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await AdminUser.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Refresh CSRF cookie state on load/page reload
    const csrfToken = req.cookies['csrf_token'] || crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.clearCookie('csrf_token', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully.' });
});

// ==========================================
// DASHBOARD STATS
// ==========================================

// GET /api/admin/stats
router.get('/stats', auth, async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalMessages = await ContactMessage.countDocuments();
    const totalSkills = await Skill.countDocuments();

    res.json({
      totalProjects,
      totalMessages,
      totalSkills,
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// PROJECTS MANAGEMENT CRUD
// ==========================================

// GET /api/admin/projects - Retrieve all
router.get('/projects', auth, async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ displayOrder: 1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/projects - Create project
router.post(
  '/projects',
  auth,
  upload.single('projectImage'),
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('githubUrl').trim().notEmpty().withMessage('GitHub URL is required.'),
    body('liveUrl').trim().notEmpty().withMessage('Live URL is required.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded file if validation failed
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Project image is required.' });
    }

    const { title, description, techTags, githubUrl, liveUrl, displayOrder, isFeatured } = req.body;

    try {
      // parse comma-separated tags
      const tagsArray = typeof techTags === 'string'
        ? techTags.split(',').map(t => t.trim()).filter(Boolean)
        : Array.isArray(techTags) ? techTags : [];

      const newProject = new Project({
        title,
        description,
        imageUrl: `/uploads/projects/${req.file.filename}`,
        techTags: tagsArray,
        githubUrl,
        liveUrl,
        displayOrder: Number(displayOrder) || 0,
        isFeatured: isFeatured === 'true' || isFeatured === true,
      });

      await newProject.save();
      res.status(201).json(newProject);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/admin/projects/:id - Update project
router.put(
  '/projects/:id',
  auth,
  upload.single('projectImage'),
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('githubUrl').trim().notEmpty().withMessage('GitHub URL is required.'),
    body('liveUrl').trim().notEmpty().withMessage('Live URL is required.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, techTags, githubUrl, liveUrl, displayOrder, isFeatured } = req.body;

    try {
      const project = await Project.findById(id);
      if (!project) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'Project not found.' });
      }

      // Convert techTags to array
      const tagsArray = typeof techTags === 'string'
        ? techTags.split(',').map(t => t.trim()).filter(Boolean)
        : Array.isArray(techTags) ? techTags : [];

      project.title = title;
      project.description = description;
      project.techTags = tagsArray;
      project.githubUrl = githubUrl;
      project.liveUrl = liveUrl;
      project.displayOrder = Number(displayOrder) || 0;
      project.isFeatured = isFeatured === 'true' || isFeatured === true;

      if (req.file) {
        // Remove old image
        const oldImagePath = path.join(__dirname, '..', project.imageUrl);
        if (fs.existsSync(oldImagePath) && project.imageUrl.startsWith('/uploads/')) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Failed to delete old project image file:', err);
          }
        }
        project.imageUrl = `/uploads/projects/${req.file.filename}`;
      }

      await project.save();
      res.json(project);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/admin/projects/:id - Delete project
router.delete('/projects/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Delete image file from disk
    const imagePath = path.join(__dirname, '..', project.imageUrl);
    if (fs.existsSync(imagePath) && project.imageUrl.startsWith('/uploads/')) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Failed to delete project image on document deletion:', err);
      }
    }

    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// SKILLS MANAGEMENT CRUD
// ==========================================

// GET /api/admin/skills - Retrieve all
router.get('/skills', auth, async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ displayOrder: 1 });
    res.json(skills);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/skills - Create skill
router.post(
  '/skills',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Skill name is required.'),
    body('category').isIn(['frontend', 'backend']).withMessage('Category must be either frontend or backend.'),
    body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be a number between 0 and 100.'),
    body('iconClass').trim().notEmpty().withMessage('Icon class is required (e.g. fab fa-react).'),
  ],
  checkValidation,
  async (req, res, next) => {
    const { name, category, percentage, iconClass, displayOrder } = req.body;
    try {
      const newSkill = new Skill({
        name,
        category,
        percentage: Number(percentage),
        iconClass,
        displayOrder: Number(displayOrder) || 0,
      });

      await newSkill.save();
      res.status(201).json(newSkill);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/admin/skills/:id - Update skill
router.put(
  '/skills/:id',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Skill name is required.'),
    body('category').isIn(['frontend', 'backend']).withMessage('Category must be either frontend or backend.'),
    body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be a number between 0 and 100.'),
    body('iconClass').trim().notEmpty().withMessage('Icon class is required (e.g. fab fa-react).'),
  ],
  checkValidation,
  async (req, res, next) => {
    const { id } = req.params;
    const { name, category, percentage, iconClass, displayOrder } = req.body;
    try {
      const skill = await Skill.findById(id);
      if (!skill) {
        return res.status(404).json({ message: 'Skill not found.' });
      }

      skill.name = name;
      skill.category = category;
      skill.percentage = Number(percentage);
      skill.iconClass = iconClass;
      skill.displayOrder = Number(displayOrder) || 0;

      await skill.save();
      res.json(skill);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/admin/skills/:id - Delete skill
router.delete('/skills/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found.' });
    }
    await Skill.findByIdAndDelete(id);
    res.json({ message: 'Skill deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// CERTIFICATIONS MANAGEMENT CRUD
// ==========================================

// GET /api/admin/certifications - Retrieve all
router.get('/certifications', auth, async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ displayOrder: 1 });
    res.json(certifications);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/certifications - Create certification
router.post(
  '/certifications',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('issuer').trim().notEmpty().withMessage('Issuer is required.'),
    body('issueDate').trim().notEmpty().withMessage('Issue date is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
  ],
  checkValidation,
  async (req, res, next) => {
    const { title, issuer, issueDate, credentialId, description, displayOrder } = req.body;
    try {
      const newCert = new Certification({
        title,
        issuer,
        issueDate,
        credentialId: credentialId || '',
        description,
        displayOrder: Number(displayOrder) || 0,
      });

      await newCert.save();
      res.status(201).json(newCert);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/admin/certifications/:id - Update certification
router.put(
  '/certifications/:id',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('issuer').trim().notEmpty().withMessage('Issuer is required.'),
    body('issueDate').trim().notEmpty().withMessage('Issue date is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
  ],
  checkValidation,
  async (req, res, next) => {
    const { id } = req.params;
    const { title, issuer, issueDate, credentialId, description, displayOrder } = req.body;
    try {
      const cert = await Certification.findById(id);
      if (!cert) {
        return res.status(404).json({ message: 'Certification not found.' });
      }

      cert.title = title;
      cert.issuer = issuer;
      cert.issueDate = issueDate;
      cert.credentialId = credentialId || '';
      cert.description = description;
      cert.displayOrder = Number(displayOrder) || 0;

      await cert.save();
      res.json(cert);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/admin/certifications/:id - Delete certification
router.delete('/certifications/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const cert = await Certification.findById(id);
    if (!cert) {
      return res.status(404).json({ message: 'Certification not found.' });
    }
    await Certification.findByIdAndDelete(id);
    res.json({ message: 'Certification deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// CONTACT MESSAGES VIEWER
// ==========================================

// GET /api/admin/messages - Retrieve all (with optional limit)
router.get('/messages', auth, async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 0;
  try {
    const query = ContactMessage.find().sort({ submittedAt: -1 });
    if (limit > 0) {
      query.limit(limit);
    }
    const messages = await query.exec();
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/messages/:id - Toggle/Mark as read
router.patch('/messages/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  const { isRead } = req.body;
  try {
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    
    message.isRead = isRead !== undefined ? isRead : true;
    await message.save();
    res.json(message);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/messages/:id - Delete message
router.delete('/messages/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    await ContactMessage.findByIdAndDelete(id);
    res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// PROFILE MANAGER
// ==========================================

// PUT /api/admin/profile - Update single profile details (supports photo & PDF uploads)
router.put(
  '/profile',
  auth,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'heroPhoto', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('tagline').trim().notEmpty().withMessage('Tagline is required.'),
    body('bio1').trim().notEmpty().withMessage('Bio paragraph 1 is required.'),
    body('bio2').trim().notEmpty().withMessage('Bio paragraph 2 is required.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded files if validation failed
      if (req.files) {
        Object.keys(req.files).forEach(fieldName => {
          req.files[fieldName].forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, tagline, bio1, bio2, isAvailable, whatsappNumber, instagramUrl } = req.body;

    try {
      let profile = await Profile.findOne();
      if (!profile) {
        // create new profile if none exists
        profile = new Profile({
          name,
          tagline,
          bio1,
          bio2,
          profilePhoto: '/uploads/profile/profile.png',
          heroPhoto: '/uploads/profile/hero.png',
          resumePath: '/uploads/resume/resume.pdf',
          isAvailable: true,
          whatsappNumber: whatsappNumber || '',
          instagramUrl: instagramUrl || '',
        });
      }

      profile.name = name;
      profile.tagline = tagline;
      profile.bio1 = bio1;
      profile.bio2 = bio2;
      profile.isAvailable = isAvailable === 'true' || isAvailable === true;
      profile.whatsappNumber = whatsappNumber || '';
      profile.instagramUrl = instagramUrl || '';

      // Handle file updates
      if (req.files) {
        if (req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
          // Remove old file path
          const oldPath = path.join(__dirname, '..', profile.profilePhoto);
          if (fs.existsSync(oldPath) && profile.profilePhoto.startsWith('/uploads/') && !profile.profilePhoto.includes('profile.png')) {
            try { fs.unlinkSync(oldPath); } catch (e) {}
          }
          profile.profilePhoto = `/uploads/profile/${req.files['profilePhoto'][0].filename}`;
        }

        if (req.files['heroPhoto'] && req.files['heroPhoto'][0]) {
          const oldPath = path.join(__dirname, '..', profile.heroPhoto);
          if (fs.existsSync(oldPath) && profile.heroPhoto.startsWith('/uploads/') && !profile.heroPhoto.includes('hero.png')) {
            try { fs.unlinkSync(oldPath); } catch (e) {}
          }
          profile.heroPhoto = `/uploads/profile/${req.files['heroPhoto'][0].filename}`;
        }

        if (req.files['resume'] && req.files['resume'][0]) {
          // Since resume has static filename 'resume.pdf', Multer will just overwrite it or write it.
          // In case Multer changes the filename, we capture the path.
          profile.resumePath = `/uploads/resume/${req.files['resume'][0].filename}`;
        }
      }

      await profile.save();
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
