const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  bio1: {
    type: String,
    required: true,
  },
  bio2: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    required: true,
  },
  heroPhoto: {
    type: String,
    required: true,
  },
  resumePath: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  whatsappNumber: {
    type: String,
    default: '',
  },
  instagramUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', ProfileSchema);
