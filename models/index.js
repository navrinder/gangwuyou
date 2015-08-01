
module.exports = function (app) {
	return {
		admin         : require('./admin')(app),
		announcements : require('./announcements')(app),
		answers       : require('./answers')(app),
		articles      : require('./articles')(app),
		clinics       : require('./clinics')(app),
		comments      : require('./comments')(app),
		info          : require('./information')(app),
		questions     : require('./questions')(app),
		reminders     : require('./reminders')(app),
		replies       : require('./replies')(app),
		topics        : require('./topics')(app),
		users         : require('./users')(app)
	};
};
