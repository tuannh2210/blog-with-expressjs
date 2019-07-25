const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');
const User = mongoose.model('User');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    // slug: {type: String, lowercase: true},
    description: String,
    body: String,
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// ArticleSchema.plugin(uniqueValidator, {message: "is already taken."});

// ArticleSchema.methods.slugify = function() {
//   this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
// }

// ArticleSchema.pre('validate', function(next) {
//   if(!this.slug){
//     this.slugify();
//   }
//   return next()
// })
ArticleSchema.methods.toJSONFor = function(user) {
  return {
    author: this.author.toProfileJSONFor(user)
  };
};
const Article = mongoose.model('Article', ArticleSchema, 'articles');

module.exports = Article;
