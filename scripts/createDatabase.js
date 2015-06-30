var nodeEnv = process.env.NODE_ENV;
var config = require('./config')[nodeEnv || 'development'];

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
			table.string('type');
			table.string('verified', 1);
			table.string('active', 1);
			table.timestamps(); // adds dateTimes ceated_at and updated_at
			table.string('question_1', 1),
			table.string('question_2', 1),
			table.string('question_3', 1),
			table.string('question_4', 1),
			table.string('question_5', 1),
			table.string('question_6', 1),
			table.string('question_7', 1),
			table.string('question_8', 1),
			table.string('question_9', 1),
			table.string('question_10', 1),
			table.string('question_11', 1),
			table.string('question_12', 1)

			console.log('table users added');
		});
	}
})

// create articles table
.then(function() {
	return knex.schema.hasTable('articles').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('articles', function (table) {
				table.increments('id');
				table.string('user_id');
				table.string('title');
				table.text('body');
				table.string('category');
				table.string('active', 1);
				table.timestamps(); // adds dateTimes ceated_at and updated_at

				console.log('table articles added');
			});
		}
	});
})

// create comments table
.then(function() {
	return knex.schema.hasTable('comments').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('comments', function (table) {
				table.increments('id');
				table.string('article_id');
				table.string('user_id');
				table.string('title');
				table.text('body');
				table.string('active', 1);
				table.timestamps(); // adds dateTimes ceated_at and updated_at

				console.log('table articles added');
			});
		}
	});
})

// create questions table
.then(function() {
	return knex.schema.hasTable('questions').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('questions', function (table) {
				table.increments('id');
				table.string('question');
				table.string('answer_a');
				table.string('answer_b');
				table.string('answer_c');
				table.string('answer_d');
				table.timestamps(); // adds dateTimes ceated_at and updated_at

				console.log('table questions added');
			});
		}
	});
})

// create information table
.then(function() {
	return knex.schema.hasTable('information').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('information', function (table) {
				table.increments('id');
				table.string('title');
				table.text('information');
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
