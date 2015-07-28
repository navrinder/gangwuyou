
module.exports = function (app) {
	return {
		authUser : require('./authUser')(app),
		routes   : require('./routes')(app)
	}
};
