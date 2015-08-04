var Promise = require('bluebird');


module.exports = function (app) {
	var Bookshelf = app.get('Bookshelf');

	// this function is used to determine if the currentUser is
	// able to perform an operation
	function authenticator (id, token, needsAuth) {
		var self = this;
		var error = {
			status: 401,
			message: 'Unauthorized user'
		};

		if (!token) {
			throw error;
		} else if (!needsAuth) {
			return true;
		} else {
  		return new self({
  			id: id
  		})
  		.fetch({
  			require: true
  		}).then(function(model) {
  			if (model.get('user_id') === token.id) {
  				return true;
  			} else {
  				throw error;
  			}
  		});
		}
	}


	var Announcement = Bookshelf.Model.extend({
		tableName: 'announcements',
		hasTimestamps: true
	});

	var Answer = Bookshelf.Model.extend({
		tableName: 'answers',
		hasTimestamps: true
	});

	var Article = Bookshelf.Model.extend({
		tableName: 'articles',
		hasTimestamps: true
	},
	{

		authenticate: Promise.method(authenticator)

	});

	var Clinic = Bookshelf.Model.extend({
		tableName: 'clinics',
		hasTimestamps: true
	});

	var Comment = Bookshelf.Model.extend({
		tableName: 'comments',
		hasTimestamps: true
	});

	var Info = Bookshelf.Model.extend({
		tableName: 'information',
		hasTimestamps: true
	});

	var Question = Bookshelf.Model.extend({
		tableName: 'questions',
		hasTimestamps: true
	});

	var Reminder = Bookshelf.Model.extend({
		tableName: 'reminders',
		hasTimestamps: true
	});

	var Reply = Bookshelf.Model.extend({
		tableName: 'replies',
		hasTimestamps: true
	});

	var Topic = Bookshelf.Model.extend({
		tableName: 'topics',
		hasTimestamps: true
	});

	var User = Bookshelf.Model.extend({
		tableName: 'users',
		hasTimestamps: true
	});

	return {
		Announcement : Announcement,
		Answer       : Answer,
		Article      : Article,
		Clinic       : Clinic,
		Comment      : Comment,
		Info         : Info,
		Question     : Question,
		Reminder     : Reminder,
		Reply        : Reply,
		Topic        : Topic,
		User         : User
	};

};
