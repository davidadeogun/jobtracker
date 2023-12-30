// models/Pdf.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  dateUploaded: {
    type: Date,
    default: Date.now
  },
  jobTitle: String,
  companyName: String,
  companyURL: String
});

module.exports = mongoose.model('Pdf', pdfSchema);
