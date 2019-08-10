const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      lowercase: true
    },
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

CategorySchema.methods.slugify = function() {
  this.slug = slug(this.name);
};

CategorySchema.pre('validate', function(next) {
  this.slugify();
  return next();
});
const Category = mongoose.model('Category', CategorySchema, 'categoies');

module.exports = Category;
