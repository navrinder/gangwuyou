// Script to generate API token. Only holders of this token
// may make API calls to the server.

var jwt = require('jwt-simple');
var nodeEnv = process.env.NODE_ENV;
var secret = require('../config.json')[nodeEnv || 'development'].secret;

var payload = {
	iat: Date.now(),
	api: true
};

var token = jwt.encode(payload, secret);

console.log(token);
