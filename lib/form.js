var formidable = require('formidable');

module.exports = function () {
	var form = new formidable.IncomingForm();

	form.encoding = 'utf-8';
	form.uploadDir = process.cwd() + '/public/images';
	form.keepExtensions = true;
	form.type = 'multipart';

	return form;
};
