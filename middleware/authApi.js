var secret = require('../config.json').secret;
var jwt = require('jwt-simple');
var nodeEnv = process.env.NODE_ENV;


module.exports = function (req, res, next) {
	// token should be provided in Authorization header
	var decoded;
	// set environment variable NODE_ENV=development to disable API auth
	if (nodeEnv !== 'development') {
		if (req.headers.authorization) {
			decoded = jwt.decode(req.headers.authorization, secret);
		}
		if (decoded && decoded.api) {
			return next();
		} else {
			return res.status(401).send('Authorization failed');
		}
	} else {
		next();
	}
};
