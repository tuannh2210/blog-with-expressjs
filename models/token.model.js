const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 120
  }
});

const Token = mongoose.model('Token', TokenSchema, 'tokens');

module.exports = Token;
