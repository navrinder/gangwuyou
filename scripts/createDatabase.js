var config = require('../config.json');

var knex = require('knex')({
	client: 'mysql',
	connection: config.database
});


// create users table
knex.schema.hasTable('users').then(function(exists) {
	if (!exists) {
		return knex.schema.createTable('users', function (table) {
			table.increments('id');
			table.string('user_name');
			table.string('email_address');
			table.string('password');
			table.timestamps(); // adds dateTimes ceated_at and updated_at
			table.string('type');
			table.string('verified');

			console.log('table users added');
		});
	}
})

// create articles table
.then(function() {
	knex.schema.hasTable('articles').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('articles', function (table) {
				table.increments('id');
				table.string('creator');
				table.string('title');
				table.string('body');
				table.string('category');
				table.timestamps(); // adds dateTimes ceated_at and updated_at

				console.log('table articles added');
			});
		}
	});
})

// create questions table
.then(function() {
	knex.schema.hasTable('questions').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('questions', function (table) {
				table.increments('id');
				table.string('question');
				table.string('answers');
				table.timestamps(); // adds dateTimes ceated_at and updated_at

				console.log('table questions added');
			});
		}
	});
})

// create answers table
.then(function() {
	knex.schema.hasTable('answers').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('answers', function (table) {
				table.increments('id');
				table.string('user_id');
				table.string('user_answers')
				table.timestamps(); // adds dateTimes ceated_at and updated_at

				console.log(table('answers added'));
			});
		}
	});
})

// create information table
.then(function() {
	knex.schema.hasTable('information').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('information', function (table) {
				table.increments('id');
				table.string('title');
				table.string('information');
				table.timestamps(); // adds dateTimes ceated_at and updated_at

				console.log('table information added');
			});
		}
	});
})

.then(function() {
	console.log('database creation complete');
	process.exit();
})

// error handler
.catch(function(e) {
	console.error(e);
});
