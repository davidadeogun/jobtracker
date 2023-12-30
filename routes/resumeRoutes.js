const express = require('express');
const router = express.Router();
const Pdf = require('../models/Pdf'); // Adjust the path as per your project structure

// Route for listing all resumes
router.get('/resumes', async (req, res) => {
  try {
    const resumes = await Pdf.find({});
    res.render('list', { resumes: resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for downloading a specific resume
router.get('/download/:id', async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf || !pdf.data) {
      return res.status(404).send('No file found');
    }

    res.setHeader('Content-Type', pdf.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${pdf.filename}`);
    res.send(pdf.data);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
