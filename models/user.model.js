const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
	bio: String,
	image: String,
})

// UserSchema.methods.hashPassword = async function(password) {
//   let salt = await bcrypt.genSalt(10);
//   return bcrypt.hashSync(password, salt);
// }
UserSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User
