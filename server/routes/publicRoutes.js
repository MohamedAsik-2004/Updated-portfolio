const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const ContactMessage = require('../models/ContactMessage');
const Certification = require('../models/Certification');
const { sendEmail } = require('../utils/mailer');

// GET /api/profile - Fetch profile (first available, or empty default)
router.get('/profile', async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Return a temporary mockup if database is empty
      profile = {
        name: 'Habib Ur Rehman',
        tagline: 'Creative MERN Stack Developer',
        bio1: 'No bio seeded yet.',
        bio2: '',
        profilePhoto: '/uploads/profile/profile.png',
        heroPhoto: '/uploads/profile/hero.png',
        resumePath: '/uploads/resume/resume.pdf',
        isAvailable: false
      };
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects - Fetch projects (featured first, then displayOrder)
router.get('/projects', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ isFeatured: -1, displayOrder: 1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// GET /api/skills - Fetch skills (sorted by displayOrder)
router.get('/skills', async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ displayOrder: 1 });
    res.json(skills);
  } catch (error) {
    next(error);
  }
});

// GET /api/certifications - Fetch certifications (sorted by displayOrder)
router.get('/certifications', async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ displayOrder: 1 });
    res.json(certifications);
  } catch (error) {
    next(error);
  }
});

// POST /api/contact - Submit contact form with validators
router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('A valid email address is required.'),
    body('message').trim().notEmpty().withMessage('Message is required.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    try {
      const newMessage = new ContactMessage({
        name,
        email,
        message,
      });

      await newMessage.save();

      // Send email notification
      try {
        await sendEmail({ name, email, message });
      } catch (err) {
        console.error('Failed to send contact notification email:', err);
        // Do not fail the whole API request if email server connection times out
      }

      res.status(201).json({ message: 'Your message has been received! Thank you.' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
