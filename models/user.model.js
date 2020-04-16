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
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    bio: String,
    image: String,
    role: Number
  }, { timestamps: true });

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    let salt = bcrypt.genSaltSync(16).toString('hex')
    let hash = bcrypt.hashSync(user.password, salt);
    this.password = hash;
    next();
  } catch {
    return next(err);
  }
});

UserSchema.methods.setPassword = password => {
  const salt = bcrypt.genSaltSync(16).toString('hex');
  this.password = bcrypt.hashSync(password, salt);
};

UserSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
