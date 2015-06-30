var jwt = require('jwt-simple');
var nodeEnv = process.env.NODE_ENV;

module.exports = function (app) {
	var secret = app.get('config').secret;
	return function (req, res, next) {
		var authorization = req.headers.authorization || '';
		var apiToken = authorization.split(',')[0].trim();
		// token should be provided in Authorization header
		var decoded;
		// set environment variable NODE_ENV=development to disable API auth
		if (apiToken && nodeEnv !== 'development') {
			decoded = jwt.decode(apiToken, secret);

			if (decoded && decoded.api) {
				return next();
			} else {
				return res.status(401).send('Authorization failed');
			}
		} else {
			next();
		}
	};
};
