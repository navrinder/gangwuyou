var jwt = require('jwt-simple');

module.exports = function (app) {
	var secret = app.get('config').secret;
	return function (req, res, next) {
		var authorization = req.headers.authorization || '';
		var apiToken = authorization.split(',')[0].trim();
		// token should be provided in Authorization header
		var decoded;
		if (apiToken) {
			decoded = jwt.decode(apiToken, secret);

			if (decoded && decoded.api) {
				return next();
			} else {
				return res.status(401).send('Authorization failed');
			}
		} else {
			next({
				status: 401,
				message: 'Unauthorized'
			});
		}
	};
};
