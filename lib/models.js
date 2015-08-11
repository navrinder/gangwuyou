var Promise = require('bluebird');


module.exports = function (app) {
	var Bookshelf = app.get('Bookshelf');

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
			return self.fetch({ require: true })
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

	// default BaseModel
	var BaseModel = Bookshelf.Model.extend({
		// authenticate must be called on an instantiated model
		authenticate: Promise.method(authenticator)
	});

	var AnnouncementModel = BaseModel.extend({
		tableName: 'announcements',
		hasTimestamps: true
	});

	var AnswerModel = BaseModel.extend({
		tableName: 'answers',
		hasTimestamps: true
	});

	var ArticleModel = BaseModel.extend({
		tableName: 'articles',
		hasTimestamps: true
	});

	var ClinicModel = BaseModel.extend({
		tableName: 'clinics',
		hasTimestamps: true
	});

	var CommentModel = BaseModel.extend({
		tableName: 'comments',
		hasTimestamps: true
	});

	var DoctorModel = BaseModel.extend({
		tableName: 'doctors',
		hasTimestamps: true
	});

	var InfoModel = BaseModel.extend({
		tableName: 'information',
		hasTimestamps: true
	});

	var QuestionModel = BaseModel.extend({
		tableName: 'questions',
		hasTimestamps: true
	});

	var ReminderModel = BaseModel.extend({
		tableName: 'reminders',
		hasTimestamps: true
	});

	var ReplyModel = BaseModel.extend({
		tableName: 'replies',
		hasTimestamps: true
	});

	var TopicModel = BaseModel.extend({
		tableName: 'topics',
		hasTimestamps: true
	});

	var UserModel = BaseModel.extend({
		tableName: 'users',
		hasTimestamps: true
	});

	return {
		AnnouncementModel : AnnouncementModel,
		AnswerModel       : AnswerModel,
		ArticleModel      : ArticleModel,
		ClinicModel       : ClinicModel,
		CommentModel      : CommentModel,
		DoctorModel       : DoctorModel,
		InfoModel         : InfoModel,
		QuestionModel     : QuestionModel,
		ReminderModel     : ReminderModel,
		ReplyModel        : ReplyModel,
		TopicModel        : TopicModel,
		UserModel         : UserModel
	};

};
