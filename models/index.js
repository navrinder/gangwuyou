
module.exports = function (app) {
	return {
		admin     : require('./admin')(app),
		answers   : require('./answers')(app),
		articles  : require('./articles')(app),
		comments  : require('./comments')(app),
		info      : require('./information')(app),
		questions : require('./questions')(app),
		users     : require('./users')(app)
	};
};
