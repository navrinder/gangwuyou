
module.exports = function (app) {
	return {
		announcements : require('./announcements')(app),
		answers       : require('./answers')(app),
		articles      : require('./articles')(app),
		categories    : require('./categories')(app),
		clinics       : require('./clinics')(app),
		comments      : require('./comments')(app),
		doctors       : require('./doctors')(app),
		info          : require('./information')(app),
		questions     : require('./questions')(app),
		reminders     : require('./reminders')(app),
		replies       : require('./replies')(app),
		topics        : require('./topics')(app),
		users         : require('./users')(app)
	};
};
