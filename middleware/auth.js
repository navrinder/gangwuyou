var jwt = require('jwt-simple');
var secret = require('../config.json').secret;

// this middleware can be used to check the scope of a user's token
// to see if they have correct permissions
module.exports = function (scopes) {
	return function (req, res, next) {
		var decoded;
		if (req.body.token) {
			decoded = jwt.decode(req.body.token, secret);
		}

		if (decoded && decoded.scopes.length) {
			for (var i = 0, l = decoded.scopes.length; i < l; i++) {
				for (var j = 0, m = scopes.length; j < m; j++) {
					if (decoded.scopes[i] === scopes[i]) {
						return next();
					}
				}
			}
		}

		return res.status(401).send('Unauthorized.');
	};
};
