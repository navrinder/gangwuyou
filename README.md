# Golden Leaf API

If you have any questions or issues, please [create an Issue](https://github.com/tjbrennan/golden-leaf/issues/new)

###Connecting to the API

You can connect to the API on the Aliyun server by visiting:

	120.26.113.30:8080

The server is currently running in `development` mode. To log in as an `admin`, use these crendtials:

	email_address: test@test.com
	password: foobar

The admin account has full access to the API and create all items.


###Running locally

#####Requirements

- Node.js
- MySQL

Clone the project, `cd` into it and run `npm install`.

To start the project, run `node app` in the root of the directory.

#####Environment

The default environment is `development`. To run in production mode, run `NODE_ENV=production node app`.

#####Config

You must create a MySQL database locally and add the necessary info to `config.json`. You must also add a `secret` that will be used during authentication token creation.

#####Database

Before running locally, run `node db/createDatabase.js` to create the tables. You must specify the database credentials in `config.json`.

###Routes

All routes begin with `/api/v1`. `v1` indicates that this is version 1. The base URL `/` should respond with `hello world`. These documents can be viewed by visiting `/readme`.

###Authorization

All requests require an authentication token (except login and create user). The token is returned by the API when logging in. Some API calls can only be accessed by certain types of users.

The user types are `user`, `doctor`, and `admin`. An admin token can access any API call, but they can only be created manually in the database. To create an admin, you must log in to the MySQL database and set the user's `type` to `admin`.

They type of token required is specified below. In some cases, the API call can only be made if the `user_id` of the current user's token matches the `user_id` in the URL or the item being edited. This is referred to as `currentUser` in the documentation below.

The token should be included in the Authorization header:

	Authorization: <token>

###Return values

All responses are objects with the key `success`. If `success: true` the status will be `200` and the object will contain the key `data`. The data will come directly from the database as an object or array.

If `success: false` the status will be >= `400` and the object will contain the key `message` with details about the error. More detailed information is provided when in `developtment` mode.

###Removing items / The `active` key

Some API calls return items with the key `active: Y`. This should be checked for when receiving data. It indicates that the item exists and can be used. Making a `DELETE` call to remove an item sets the key to `active: N` indicating that the item has been removed. This way, the item can be removed from use while still preserving the data.

###Query parameters and limts, offsets, ordering

All List API calls that return collections can be modified using the query string. The available options are:

	<column>=<value>
	limit=<number>
	offset=<number>
	sort=<column>,<asc OR desc>
	after=<YYYY-MM-DD>
	before=<YYYY-MM-DD>
	dateType=<number>


This example will return articles in the category medicine, limited to 20, after the first 10, sorted by `id` descending, after June 1, and before July 1:

	/api/v1/articles?category=medicine&limit=20&offset=10&sort=id,desc&after=2015-06-01&before=2015-07-01

The `dateType` argument takes an integer input and returns all rows within the specified date. The values are:

	1 : day
	2 : week
	3 : month
	4 : year




###Responses

####Success

Status: `200`
```
{
	success: true,
	data: {}
}
```

####Failure

Status: >= `400`
```
{
	success: false,
	code: '',
	message: ''
}
```

####Invalid API version

Status: >= `410`
```
{
	success: false,
	code: 'DEPRECATED',
	message: 'The API version is deprecated or does not exist.'
}
```
This response indicates that the API is invalid and the user should upgrade their app.


# API calls

- [Users](#users)
- [Reminders](#reminders)
- [Questions](#questions)
- [Answers](#answers)
- [Articles](#articles)
- [Comments](#comments)
- [Categories](#categories)
- [Announcements](#announcements)
- [Topics](#topics)
- [Replies](#replies)
- [Clinics](#clinics)
- [Doctors](#doctors)


##Users

User accounts for users and doctors. Some optional fields are only for doctors.

####Create user
	POST /api/v1/users

Body:

	user_name
	email_address
	password
	type ('user' or 'doctor')
	name (optional)
	sex (optional)
	birth_day (optional)
	birth_month (optional)
	birth_year (optional)
	phone_number (optional)
	picture (optional)
	occupation (optional)
	hospital (optional)
	department (optional)
	city (optional)

Authorized: no authorization

####List all users
	GET /api/v1/users

Can use query string to provide arguments

Authorized: `admin`

####Show user
	GET /api/v1/users/:user_id

Authorized: `currentUser`, `admin`

####Update user
	PUT /api/v1/users/:user_id

Body:

	user_name (optional)
	email_address (optional)
	password (optional)
	type ('user' or 'doctor') (optional)
	name (optional)
	sex (optional)
	birth_day (optional)
	birth_month (optional)
	birth_year (optional)
	phone_number (optional)
	picture (optional)
	occupation (optional)
	hospital (optional)
	department (optional)
	city (optional)

Authorized: `currentUser`, `admin`

####Remove user
	DELETE /api/v1/users/:user_id

Authorized: `admin`

####List users' public info
	GET /api/v1/users-public

Authorized: no authorization

####Show user's public info
	GET /api/v1/users-public/:user_id

Authorized: no authorization


##Reminders

Reminders set by the user for appointments, medication, etc.

###Create reminder
	POST /api/v1/users/:user_id/reminders

Body:

	user_id
	day (optional)
	time (optional)
	medicine (y/n)
	pad (y/n)
	medicine_name (optional)
	daily (y/n)
	weekly (y/n)

Authorized: `user`, `doctor`, `admin`

###List reminders belonging to a user
	GET /api/v1/users/:user_id/reminders

Authorized: `currentUser`, `admin`

###Show reminder
	GET /api/v1/users/:user_id/reminders/:reminder_id

Authorized: `currentUser`, `admin`

###Update reminder
	PUT /api/v1/users/:user_id/reminders/:reminder_id

Body:

	user_id
	day (optional)
	time (optional)
	medicine (y/n)
	pad (y/n)
	medicine_name (optional)
	daily (y/n)
	weekly (y/n)

Authorized: `admin`

###Remove reminder
	DELETE /api/v1/users/:user_id/reminders/:reminder_id

Authorized: `currentUser`, `admin`





##Questions

Quiz questions can be stored here but should be hardcoded. Adding more than 12 questions may lead to database errors.

###Create question
	POST /api/v1/questions

Body:

	question
	answer_a
	answer_b
	answer_c
	answer_d

Authorized: `admin`

###List questions
	GET /api/v1/questions

Authorized: `user`, `doctor`, `admin`

###Show question
	GET /api/v1/questions/:question_id

Authorized: `user`, `doctor`, `admin`

###Update question
	PUT /api/v1/questions/:question_id

Body:

	question (optional)
	answer_a (optional)
	answer_b (optional)
	answer_c (optional)
	answer_d (optional)

Authorized: `admin`

###Remove question
	DELETE /api/v1/questions/:question_id

Authorized: `admin`


##Answers

The User's answers to quiz questions. Answer values should be `A`, `B`, `C`, or `D`

####Create/update answer
	POST /api/v1/users/:user_id/answers

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

Authorized: `currentUser`, `admin`

####Show answers for a user
	GET /api/v1/users/:user_id/answers

Authorized: `currentUser`, `doctor`, `admin`



##Articles

Articles written by doctors

###Create article
	POST /api/v1/articles

Body:

	user_id
	title
	body
	category
	picture

Authorized: `doctor`, `admin`

###List all articles
	GET /api/v1/articles

Can use query string to provide arguments

Authorized: no authorization

###Show article
	GET /api/v1/articles/:article_id

Authorized: no authorization

###Update article
	PUT /api/v1/articles/:article_id

Body:

	user_id
	title (optional)
	body (optional)
	category (optional)
	picture (optional)

Authorized: `currentUser`, `admin`

###Remove article
	DELETE /api/v1/articles/:article_id

Authorized: `currentUser`, `admin`

###Show user articles
	GET /api/v1/users/:user_id/articles

Authorized: `user`, `doctor`, `admin`


##Comments

Comments left by users on articles

###Create comment
	POST /api/v1/articles/:article_id/comments

Body:

	article_id
	user_id
	title
	body

Authorized: `user`, `doctor`, `admin`

###List all comments belonging to an article
	GET /api/v1/articles/:article_id/comments

Authorized: no authorization

###Show comment
	GET /api/v1/articles/:article_id/comments/:comment_id

Authorized: no authorization

###Update comment
	PUT /api/v1/articles/:article_id/comments/:comment_id

Body:

	article_id
	user_id
	title (optional)
	body _(optinal)_

Authorized: `currentUser`, `admin`

###Remove comment
	DELETE /api/v1/articles/:article_id/comments/:comment_id

Authorized: `currentUser`, `admin`

###List all comments belonging to a user
	GET /api/v1/users/:user_id/comments

Authorized: `currentUser`, `admin`




##Categories

Categories for articles

###Create category
	POST /api/v1/categories

Body:

	name

Authorized: `admin`

###List all categories
	GET /api/v1/categories

Authorized: `user`, `doctor`, `admin`

###Show category
	GET /api/v1/categories/:category_id

Authorized: `user`, `doctor`, `admin`

###Update category
	PUT /api/v1/categories/:category_id

Body:

	name

Authorized: `admin`

###Remove category
	DELETE /api/v1/categories/:category_id

Authorized: `admin`





##Announcements

Announcements are short updates created by doctors.

####Create announcement
	POST /api/v1/announcements

Body:

	user_id
	title
	body
	hospital (optional)
	location (optional)

Authorized: `doctor`

####List all announcements
	GET /api/v1/announcements

Can use query string to provide arguments

Authorized: no authorization

####Show announcement
	GET /api/v1/announcements/:announcement_id

Authorized: no authorization

####Update announcement
	PUT /api/v1/announcements/:announcement_id

Body:

	user_id
	title (optional)
	body (optional)
	hospital (optional)
	location (optional)

####Remove announcement
	DELETE /api/v1/announcements/:announcement_id

Authorized: `user`, `doctor`, `admin`






##Topics

Topics for discussion written by users

###Create topic
	POST /api/v1/topics

Body:

	user_id
	title
	body
	category
	picture (optional)

Authorized: `user`, `doctor`, `admin`

###List all topics
	GET /api/v1/topics

Can use query string to provide arguments

Authorized: `user`, `doctor`, `admin`

###Show topic
	GET /api/v1/topics/:topic_id

Authorized: `user`, `doctor`, `admin`

###Update topic
	PUT /api/v1/topics/:topic_id

Body:

	user_id
	title (optional)
	body (optional)
	category (optional)
	picture (optional)

Authorized: `currentUser`, `admin`

###Remove topic
	DELETE /api/v1/topics/:topic_id

Authorized: `currentUser`, `admin`



##Replies

Replies to topics created by other users

###Create replies
	POST /api/v1/topics/:topic_id/replies

Body:

	topic_id
	user_id
	title
	body

Authorized: `user`, `doctor`, `admin`

###List all replies belonging to an article
	GET /api/v1/topics/:topic_id/replies

Authorized: `user`, `doctor`, `admin`

###Show reply
	GET /api/v1/topics/:topic_id/replies/:reply_id

Authorized: `user`, `doctor`, `admin`

###Update reply
	PUT /api/v1/topics/:topic_id/replies/:reply_id

Body:

	topic_id
	user_id
	title (optional)
	body (optional)

Authorized: `currentUser`, `admin`

###Remove reply
	DELETE /api/v1/topics/:topic_id/replies/:reply_id

Authorized: `currentUser`, `admin`

###List all replies belonging to a user
	GET /api/v1/users/:user_id/replies

Authorized: `user`, `doctor`, `admin`






##Clinics

Clinic and hospital information

###Create clinic
	POST /api/v1/clinics

Body:

	name
	address_1
	address_2 (optional)
	address_3 (optional)
	city
	province
	postal_code
	description (optional)
	picture (optional)
	latitude (optional)
	longitude (optional)

Authorized: `admin`

###List clinics
	GET /api/v1/clinics

Can use query string to provide arguments

Authorized: `user`, `doctor`, `admin`

###Show clinic
	GET /api/v1/clinics/:clinic_id

Authorized: `user`, `doctor`, `admin`

###Update clinic
	PUT /api/v1/clinics/:clinic_id

Body:

	name (optional)
	address_1 (optional)
	address_2 (optional)
	address_3 (optional)
	city (optional)
	province (optional)
	postal_code (optional)
	description (optional)
	picture (optional)
	latitude (optional)
	longitude (optional)

Authorized: `admin`

###Remove clinic
	DELETE /api/v1/clinics/:clinic_id

Authorized: `admin`



##Doctors

Doctors information that belongs to a clinic. These doctors are NOT user accounts.

####Create doctor
	POST /api/v1/clinics/:clinic_id/doctors

Body:

	name
	occupation
	picture
	hours

Authorized: `admin`

####List all doctors for a clinic
	GET /api/v1/clinics/:clinic_id/doctors

Authorized: `user`, `doctor`, `admin`

####Show doctor
	GET /api/v1/clinics/:clinic_id/doctors/:doctor_id

Authorized: `user`, `doctor`, `admin`

####Update doctor
	POST /api/v1/clinics/:clinic_id/doctors

Body:

	name
	occupation
	picture
	hours

Authorized: `admin`

####Remove doctor
	DELETE /api/v1/clinics/:clinic_id/doctors/:doctor_id

Authorized: `admin`


##Login

Responds with an authentication token

###Log in
	POST /api/v1/login

Body:

	email_address
	password

Authorized: no authorization
