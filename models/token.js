
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  supply: { type: String, required: true },
  tokenStandard: { type: String, default: 'spl-token' },
  decimals: { type: String, required: true },
  logo: { type: String, required: true },
  imageUploadUrl: { type: String, required: true },
  website: { type: String, required: true },
  twitter: String,
  telegram: String,
  discord: String,
  reddit: String,
  medium: String,
  description: String,
  address: String,
  status: { type: String, enum: ['live', 'upcoming'], default: 'upcoming' }
});

module.exports = mongoose.model('Token', tokenSchema);
