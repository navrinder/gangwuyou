
module.exports = function (app) {
	var Bookshelf = app.get('Bookshelf');
	var models = require('./models')(app);

	var Announcements = Bookshelf.Collection.extend({
		model: models.Announcement
	});

	var Articles = Bookshelf.Collection.extend({
		model: models.Article
	});

	var Clinics = Bookshelf.Collection.extend({
		model: models.Clinic
	});

	var Comments = Bookshelf.Collection.extend({
		model: models.Comment
	});

	var Infos = Bookshelf.Model.extend({
		model: models.Info
	});

	var Questions = Bookshelf.Collection.extend({
		model: models.Questions
	});

	var Reminders = Bookshelf.Collection.extend({
		model: models.Reminder
	});

	var Replies = Bookshelf.Collection.extend({
		model: models.Reply
	});

	var Topics = Bookshelf.Collection.extend({
		model: models.Topic
	});

	var Users = Bookshelf.Collection.extend({
		model: models.User
	});

	return {
		Announcements : Announcements,
		Articles      : Articles,
		Clinics       : Clinics,
		Comments      : Comments,
		Infos         : Infos,
		Questions     : Questions,
		Reminders     : Reminders,
		Replies       : Replies,
		Topics        : Topics,
		Users         : Users
	};

};
