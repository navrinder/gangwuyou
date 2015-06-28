INSERT INTO users
(
	id,
	user_name,
	email_address,
	password,
	type,
	verified,
	question_1,
	question_2,
	question_3,
	question_4,
	question_5,
	question_6,
	question_7,
	question_8,
	question_9,
	question_10,
	question_11,
	question_12
)
VALUES
(
	1,
	'test',
	'test@test.test',
	'testing',
	'user',
	NULL,
	'A',
	'B',
	'C',
	'D',
	'A',
	'B',
	'C',
	'D',
	'A',
	'B',
	'C',
	'D',
	'A',
	'B',
	'C',
	'D'
);

INSERT INTO articles
(
	id,
	creator,
	title,
	body,
	category,
	created_at,
	updated_at
)
VALUES
(
	1,
	'test',
	'test title',
	'test article body foo bar baz',
	'test category'
);

INSERT INTO questions
(
	id,
	question,
	a,
	b,
	c,
	d,
	created_at,
	updated_at
)
VALUES
(
	1,
	'Is this a test?',
	'Foo',
	'Bar',
	'Baz',
	'Qux'

);

INSERT INTO information
(
	id,
	title,
	information,
	created_at,
	updated_at
)
VALUES
(
	1,
	'test info',
	'This is test information.'
);
