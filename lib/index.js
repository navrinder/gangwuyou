
module.exports = function (app) {
	return {
		models: require('./models')(app),
		collections: require('./collections')(app)
	};
};
