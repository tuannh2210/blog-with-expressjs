const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
    bio: String,
    image: String,
    password: { type: String, required: true },
    role: Number
  },
  {
    timestamps: true
  }
);

UserSchema.methods.setPassword = password => {
  let salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
