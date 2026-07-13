const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['frontend', 'backend'],
    required: true,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  iconClass: {
    type: String,
    required: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Skill', SkillSchema);
