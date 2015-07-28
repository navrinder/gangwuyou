var jwt = require('jwt-simple');

// this middleware can be used to check the scope of a user's token
// to see if they have correct permissions
module.exports = function (app) {
	var secret = app.get('config').secret;

	return function (scopes) {
		return function (req, res, next) {
			var authorization = req.headers.authorization || '';
			var token = authorization.trim();
			var decoded;
			var authorized = false;
			var userId = req.params.user_id || req.body.user_id || req.query.user_id;

			if (token) {
				decoded = jwt.decode(token, secret);
			}

			if (decoded && decoded.scopes && decoded.scopes.length) {

				for (var i = 0, l = decoded.scopes.length; i < l; i++) {
					for (var j = 0, m = scopes.length; j < m; j++) {
						// if scope is currentUser, check for user_id in the
						// route, body, or query string and compare
						if (!authorized && scopes[j] === 'currentUser') {
							if (decoded.id && userId && decoded.id == userId) {
								authorized = true;
							}
						} else if (!authorized && decoded.scopes[i] === scopes[j]) {
							authorized = true;
						}
					}
				}
			}

			if (authorized) {
				return next();
			} else {
				return next({
					status: 401,
					message: 'Unauthorized user token.'
				});
			}
		};
	};
};
