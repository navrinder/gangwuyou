var jwt = require('jwt-simple');
var secret = require('../config.json').secret;

module.exports = function (scope) {
	return function (req, res, next) {
		var decoded;
		if (req.body.token) {
			decoded = jwt.decode(req.body.token, secret);
		}

		if (decoded && decoded.scopes.length) {
			for (var i = 0, l = decoded.scopes.length; i < l; i++) {
				if (decoded.scopes[i] === scope) {
					return next();
				}
			}
		}

		return res.status(401).send('Unauthorized.');
	};
};
