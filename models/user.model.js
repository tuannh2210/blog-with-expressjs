const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      default: 'imgaes/default.png'
    },
    bio: String,
    image: String,
    password: {
      type: String,
      required: true
    },
    role: Number
  },
  {
    timestamps: true
  }
);

UserSchema.methods.hashPasword = password => {
  return bcrypt.hash(password, bcrypt.genSalt(10));
};

UserSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
