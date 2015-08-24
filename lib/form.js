var formidable = require('formidable');
var fs = require('fs');

module.exports = {

	buildForm : function () {
		var form = new formidable.IncomingForm();

		form.encoding = 'utf-8';
		form.uploadDir = process.cwd() + '/public/images';
		form.keepExtensions = true;
		form.type = 'multipart';

		return form;
	},

	checkPicture : function (picture, callback) {
		if (picture.type !== 'image/jpg' && picture.type !== 'image/png' && picture.type !== 'image/gif') {
			fs.unlink(picture.path, function (error) {
				if (error) {
					return callback(error);
				} else {
					return callback({
						status: 415,
						message: 'Invalid file type'
					});
				}
			});
		} else {
			return callback();
		}
	}
};
