CREATE TABLE IF NOT EXISTS users
(
	id 				INT,
	user_name 		VARCHAR(255),
	email_address	VARCHAR(255),
	password		VARCHAR(255),
	type			VARCHAR(255),
	verified		CHAR(1),
	created_at		DATETIME DEFAULT NOW(),
	updated_at		DATETIME DEFAULT NOW(),
	question_1		CHAR(1),
	question_2		CHAR(1),
	question_3		CHAR(1),
	question_4		CHAR(1),
	question_5		CHAR(1),
	question_6		CHAR(1),
	question_7		CHAR(1),
	question_8		CHAR(1),
	question_9		CHAR(1),
	question_10		CHAR(1),
	question_11		CHAR(1),
	question_12		CHAR(1)
);

CREATE TABLE IF NOT EXISTS articles
(
	id 				INT,
	creator 		VARCHAR(255),
	title			VARCHAR(255),
	body			TEXT,
	category		VARCHAR(255),
	created_at		DATETIME DEFAULT NOW(),
	updated_at		DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions
(
	id 				INT,
	question 		VARCHAR(255),
	answer_a 		VARCHAR(255),
	answer_b 		VARCHAR(255),
	answer_c 		VARCHAR(255),
	answer_d 		VARCHAR(255),
	created_at		DATETIME DEFAULT NOW(),
	updated_at		DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS information
(
	id 				INT,
	title 			VARCHAR(255),
	information		TEXT,
	created_at		DATETIME DEFAULT NOW(),
	updated_at		DATETIME DEFAULT NOW()
);
