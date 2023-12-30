const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Pdf = require('./models/Pdf'); // Ensure this path matches your project structure
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT;

// MongoDB Connection
mongoose.connect(process.env.MongoDB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 } // 100KB limit
}).single('resume');


// Route for file upload form
app.get('/', (req, res) => {
  res.render('upload');
});

// Route for handling file uploads
app.post('/upload', upload, async (req, res) => {
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
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
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
