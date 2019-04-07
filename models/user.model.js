const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
		type: String,
		required: true,
		index: true
	},
	email: {
		type: String,
		required: true,
		index: true,
	},
  hash_password: {
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

UserSchema.methods.hashPassword = async function(password) {
  let salt = await bcrypt.genSalt(10);
  this.hash_password =  bcrypt.hashSync(password, salt);
}

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User
