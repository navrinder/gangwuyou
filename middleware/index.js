
module.exports = function (app) {
	return {
		authUser : require('./authUser')(app),
		authApi  : require('./authApi')(app)
	}
};