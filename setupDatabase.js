var config = require('./config.json');

var knex = require('knex')({
	client: 'mysql',
	connection: config.database
});


knex.schema.dropTableIfExists('users')


// create users table
.then(function() {
	return knex.schema.hasTable('users').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('users', function (table) {
				table.increments('id');
				table.string('user_name');
				table.string('email_address');
				table.string('password');
				table.timestamps(); // adds dateTimes ceated_at and updated_at
				table.string('is_doctor');
			});
		}
	});
})

// add test user
.then(function() {
	return knex.insert({
		user_name: 'Test',
		email_address: 'test@test.test',
		password: 'password',
		created_at: knex.raw('NOW()'),
		is_doctor: 'N'
	}).into('users');
})

// select test user
.then(function() {
	return knex('users')
		.select('*');
})

// display results
.map(function(row) {
	console.log(row);
})

// error handler
.catch(function(e) {
	console.error(e);
});
