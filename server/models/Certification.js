const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  issueDate: {
    type: String,
    required: true,
  },
  credentialId: {
    type: String,
    default: '',
  },
  description: {
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

module.exports = mongoose.model('Certification', CertificationSchema);
