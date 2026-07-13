const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  techTags: [
    {
      type: String,
    },
  ],
  githubUrl: {
    type: String,
    required: true,
  },
  liveUrl: {
    type: String,
    required: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', ProjectSchema);
