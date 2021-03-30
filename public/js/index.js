String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// CKEDITOR
CKEDITOR.replace('body')

// tags
var tags = document.querySelector('input[name=tags]'),
tagify = new Tagify(tags)