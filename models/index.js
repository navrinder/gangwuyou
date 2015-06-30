
module.exports = function (app) {
	admin     : require('./admin')(app),
	answers   : require('./answers')(app),
	articles  : require('./articles')(app),
	info      : require('./information')(app),
	login     : require('./login')(app),
	questions : require('./questions')(app),
	users     : require('./users')(app)
}
