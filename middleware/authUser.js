var jwt = require('jwt-simple');

// this middleware can be used to check the scope of a user's token
// to see if they have correct permissions
module.exports = function (app) {
	var secret = app.get('config').secret;
	return function (scopes) {
		return function (req, res, next) {
			var authorization = req.headers.authorization || '';
			var token = authorization.split(',') || [];
			token = (token[1] || token[0] || '').trim();
			var decoded;

			if (token) {
				decoded = jwt.decode(token, secret);
			}

			if (decoded && decoded.scopes && decoded.scopes.length) {
				for (var i = 0, l = decoded.scopes.length; i < l; i++) {
					for (var j = 0, m = scopes.length; j < m; j++) {
						if (decoded.scopes[i] === scopes[j]) {
							return next();
						}
					}
				}
			}

			return next({
				status: 401,
				message: 'Unauthorized user token.'
			});
		};
	};
};
