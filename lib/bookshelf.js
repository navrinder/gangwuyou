var nodeEnv = process.env.NODE_ENV;
var config = require('./config')[nodeEnv || 'development'];
var knex = require('knex')({
	client: 'mysql',
	connection: config.database
});

module.exports = require('bookshelf')(knex);
