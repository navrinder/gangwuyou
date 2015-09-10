var Promise = require('bluebird');


module.exports = function (app) {
	var Bookshelf = app.get('Bookshelf');
	var models = require('./models')(app);

	// this function is used to determine if the individual user
	// is able to perform an operation
	function authenticator (req, res) {
		var self = this;
		var authError = {
			status: 401,
			message: 'Unauthorized user'
		};
		var user = res.locals.auth.decoded;
		var authorized = res.locals.auth.authorized;
		var needsUserAuth = res.locals.auth.needsUserAuth;

		if (authorized) {
			// if user is authorized, per user authentication is not needed
			return true;
		} else if (needsUserAuth) {
			// check if the current user is the user being accessed by the route
			// check to see if user is allowed to access model
			return self.fetchOne({ require: true })
  		.then(function(model) {
  			if (model && model.get('user_id')) {
  				// check to see if data being accessed belongs to user
  				if (model.get('user_id') == user.id) {
  					return true;
  				} else {
  					throw authError;
  				}
  			} else if (req.params.user_id && req.params.user_id == user.id) {
  				// check to see if user route being accessed belongs to user
  				// CAUTION: this may be insecure. Be careful when creating new routes with :user_id
  				return true;
  			} else {
  				throw authError;
  			}
  		})
  		.catch(function(error) {
  			if (error == authError) {
  				throw error;
  			} else if (req.params.user_id && req.params.user_id == user.id) {
  				return true;
  			} else {
  				throw error;
  			}
  		});
		} else {
			throw authError;
		}
	}

	var BaseCollection = Bookshelf.Collection.extend({
		// authenticate must be called on an instantiated collection
		authenticate: Promise.method(authenticator)
	});

	var AnnouncementCollection = BaseCollection.extend({
		model: models.AnnouncementModel
	});

	var ArticleCollection = BaseCollection.extend({
		model: models.ArticleModel
	});

	var CategoryCollection = BaseCollection.extend({
		model: models.CategoryModel
	});

	var ClinicCollection = BaseCollection.extend({
		model: models.ClinicModel
	});

	var CommentCollection = BaseCollection.extend({
		model: models.CommentModel
	});

	var DoctorCollection = BaseCollection.extend({
		model: models.DoctorModel
	});

	var InfoCollection = Bookshelf.Model.extend({
		model: models.InfoModel
	});

	var QuestionCollection = BaseCollection.extend({
		model: models.QuestionsModel
	});

	var ReminderCollection = BaseCollection.extend({
		model: models.ReminderModel
	});

	var ReplyCollection = BaseCollection.extend({
		model: models.ReplyModel
	});

	var TopicCollection = BaseCollection.extend({
		model: models.TopicModel
	});

	var UserCollection = BaseCollection.extend({
		model: models.UserModel
	});

	return {
		AnnouncementCollection : AnnouncementCollection,
		ArticleCollection      : ArticleCollection,
		CategoryCollection     : CategoryCollection,
		ClinicCollection       : ClinicCollection,
		CommentCollection      : CommentCollection,
		DoctorCollection			 : DoctorCollection,
		InfoCollection         : InfoCollection,
		QuestionCollection     : QuestionCollection,
		ReminderCollection     : ReminderCollection,
		ReplyCollection        : ReplyCollection,
		TopicCollection        : TopicCollection,
		UserCollection         : UserCollection
	};

};
