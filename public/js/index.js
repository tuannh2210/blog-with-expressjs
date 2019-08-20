// tinymce.init({
//   selector: 'textarea',
//   height: 500,
//   plugins: [
//     'advlist autolink lists link image charmap print preview anchor textcolor',
//     'searchreplace visualblocks code fullscreen',
//     'insertdatetime media table paste code help wordcount',
//     'media'
//   ],
//   images_upload_base_path: '/some/basepath',
//   toolbar:
//     'undo redo | formatselect | bold italic backcolor | media | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
//   content_css: [
//     '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
//     '//www.tiny.cloud/css/codepen.min.css'
//   ]
// });

// tinymce.init({
//   selector: 'textarea#description',
//   height: 100,
//   menubar: false,
//   plugins: [
//     'advlist autolink lists link image charmap print preview anchor textcolor',
//     'searchreplace visualblocks code fullscreen',
//     'insertdatetime media table paste code help wordcount',
//     'media'
//   ],
//   images_upload_base_path: '/some/basepath',
//   toolbar: false,
//   content_css: [
//     '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
//     '//www.tiny.cloud/css/codepen.min.css'
//   ]
// });

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
