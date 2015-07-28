// This can be used to retrieve the bookshelf connection.
// It is currently not used.
// Instead, use app.get('Bookshelf')

var config = require('../config')[process.env.NODE_ENV];
var knex = require('knex')({
	client: 'mysql',
	connection: config.database
});

module.exports = require('bookshelf')(knex);
