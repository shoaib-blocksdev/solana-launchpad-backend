
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  supply: String,
  tokenStandard: { type: String, default: 'spl-token' },
  decimals: { type: String, default: '6' },
  imageUploadUrl: String,
  website: String,
  twitter: String,
  telegram: String,
  discord: String,
  reddit: String,
  medium: String,
  description: String,
  address: String
});

module.exports = mongoose.model('Token', tokenSchema);
