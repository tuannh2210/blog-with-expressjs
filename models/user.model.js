const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
		type: String,
		required: [true, 'cannot be empty.'],
		unique: true,
		lowercase: true,
		index: true
	},
	email: {
		type: String,
		required: [true, 'cannot be empty.'],
		unique: true,
		lowercase: true,
		index: true,
		trim: true
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

const User = mongoose.model('User', UserSchema, users)
