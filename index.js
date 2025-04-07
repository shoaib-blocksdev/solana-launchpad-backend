
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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

// Create token
app.post('/api/tokens', async (req, res) => {
  try {
    const token = new Token(req.body);
    await token.save();
    res.status(201).json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tokens
app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await Token.find();
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
