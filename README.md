# golden-leaf API

##Users

###Create user
	POST /api/v1/users

Body:

	user_name
	email_address
	password
	type ('user' or 'doctor')



###Display user
	GET /api/v1/users/:user_id

Headers:

	Authorization: <user token>



###Update user
	PUT /api/v1/users/:user_id

Headers:

	Authorization: <user token>

Body:

	user_name
	email_address
	password


##Login
	POST /api/v1/login

Body:

	email_address
	password

Responds with user authentication user token


##Questions

###List questions
	GET /api/v1/questions


##Answers

###Add user answer
	POST /api/v1/users/:user_id/answers

Headers:

	Authorization: <user token>

Body:

	question_1 (optional)
	question_2 (optional)
	question_3 (optional)
	question_4 (optional)
	question_5 (optional)
	question_6 (optional)
	question_7 (optional)
	question_8 (optional)
	question_9 (optional)
	question_10 (optional)
	question_11 (optional)
	question_12 (optional)



###Show user answers
	GET /api/v1/users/:user_id/answers

Headers:

	Authorization: <user token>



##Articles

###Create article
	POST /api/v1/articles

Headers:

	Authorization: <user token>

Body:

	user_id
	title
	body
	category



###List articles
	GET /api/v1/articles


###Display article
	GET /api/v1/articles/:article_id


##Comments

###List comments
	GET /api/v1/articles/:article_id/comments


###Create comment
	POST /api/v1/articles/:article_id/comments

Headers:

	Authorization: <user token>

Body:

	article_id
	user_id
	title
	body



###Display comment
	GET /api/v1/articles/:article_id/comments/:comment_id


###Update comment
	PUT /api/v1/articles/:article_id/comments/:comment_id

Headers:

	Authorization: <user token>

Body:

	article_id
	user_id
	title
	body



##Information
	GET /api/v1/information
