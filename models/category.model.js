const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: String,
    description: String,
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model('Category', CategorySchema, 'categoies');

module.exports = Category;
