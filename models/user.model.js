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
      required: true
    },
    password: {
      type: String,
      required: true
    },
    bio: String,
    image: String
  },
  {
    timestamps: true
  }
);

UserSchema.methods.hashPasword = password => {
  return 'bcrypt.hash(password, bcrypt.genSalt(10));';
};

UserSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

UserSchema.methods.toProfileJSONFor = function(user) {
  return {
    username: this.username
  };
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
