const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Pdf = require('./models/Pdf'); // Ensure this path matches your project structure
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000

// MongoDB Connection
mongoose.connect(process.env.MongoDB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 }, // 100KB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      req.fileValidationError = 'Only PDF files are allowed!';
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  }
}).single('resume');


// Route for file upload form
app.get('/', (req, res) => {
  res.render('upload');
});

// Route for handling file uploads
app.post('/upload', (req, res) => {
  upload(req, res, async function (error) {
    // Handling file validation errors
    if (req.fileValidationError) {
      return res.status(400).send(req.fileValidationError);
    } 

    // Handling Multer errors
    else if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send('File too large. Maximum size is 100KB.');
      }
      return res.status(500).send(error.message);
    } 

    // Handling other unknown errors
    else if (error) {
      return res.status(500).send(error.message);
    }

    // If no file is uploaded
    if (!req.file) {
      return res.status(400).send('Please upload a file.');
    }

    // If file upload is successful
    try {
      const newPdf = new Pdf({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        jobTitle: req.body.jobTitle,
        companyName: req.body.companyName,
        companyURL: req.body.companyURL
      });

      await newPdf.save();
      res.render('success', { filename: req.file.originalname });
    } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).send('Error saving file.');
    }
  });
});



// Route for listing all resumes
app.get('/resumes', async (req, res) => {
  try {
    const resumes = await Pdf.find({});
    res.render('list', { resumes: resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for downloading a specific resume
app.get('/download/:id', async (req, res) => {
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

// Start the server
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
