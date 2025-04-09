
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${randomString}-${timestamp}${extension}`);
  }
});

const upload = multer({ storage: storage });
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const Token = require('./models/token');

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Create token
app.post('/api/tokens', upload.fields([
  { name: 'imageUploadUrl', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), async (req, res) => {
  try {
    const tokenData = req.body;

    // Check if files exist
    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Add file paths to token data
    if (!req.files.imageUploadUrl || !req.files.logo) {
      return res.status(400).json({ error: 'Both imageUploadUrl and logo files are required' });
    }

    tokenData.imageUploadUrl = `/uploads/${req.files.imageUploadUrl[0].filename}`;
    tokenData.logo = `/uploads/${req.files.logo[0].filename}`;

    const token = new Token(tokenData);
    await token.save();
    // send status and data filed
    res.status(201).json({ status: 'success', data: token });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tokens with search functionality
app.get('/api/tokens', async (req, res) => {
  try {
    const { status, address, name, symbol } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (address) {
      query.address = address;
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (symbol) {
      query.symbol = { $regex: symbol, $options: 'i' };
    }

    const tokens = await Token.find(query);
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get token by ID
app.get('/api/tokens/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found' });
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update token
app.put('/api/tokens/:id', async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!token) return res.status(404).json({ error: 'Token not found' });
    res.json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete token
app.delete('/api/tokens/:id', async (req, res) => {
  try {
    const token = await Token.findByIdAndDelete(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found' });
    res.json({ message: 'Token deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
