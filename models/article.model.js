const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: String,
    images: String,
    description: String,
    body: String,
    view: Number,
    tags: [{ type: String }],
    favoritesCount: { type: Number, default: 0 },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

ArticleSchema.plugin(uniqueValidator, {
  message: 'Aricle is alrealy taken',
});

ArticleSchema.methods.slugify = function () {
  let randomSlug = (Math.random() * Math.pow(36, 6)) | 0;
  this.slug = slug(this.title) + '-' + randomSlug;
};

ArticleSchema.pre('validate', function (next) {
  this.slugify();
  return next();
});

ArticleSchema.methods.toJSONFor = function (user) {
  return {
    author: this.author.toProfileJSONFor(user),
  };
};
const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
