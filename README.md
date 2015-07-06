# golden-leaf API

##Users

####Create user
__POST__ /api/v1/users
```
user_name
email_address
password
type ('user' or 'doctor')
```


####Display user
__GET__ /api/v1/users/:user_id

Headers:
```
Authorization: <token>
```


####Update user
__PUT__ /api/v1/users/:user_id

Headers:
```
Authorization: <token>
```
Body:
```
user_name
email_address
password
```

##Login
__POST__ /api/v1/login
```
email_address
password
```
Responds with user authentication token


##Questions

####List questions
__GET__ /api/v1/questions


##Answers

####Add user answer
__POST__ /api/v1/users/:user_id/answers

Headers:
```
Authorization: <token>
```
Body:
```
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
```


####Show user answers
__GET__ /api/v1/users/:user_id/answers

Headers:
```
Authorization: <token>
```


##Articles

####Create article
__POST__ /api/v1/articles

Headers:
```
Authorization: <token>
```
Body:
```
user_id
title
body
category
```


####List articles
__GET__ /api/v1/articles


####Display article
__GET__ /api/v1/articles/:article_id


##Comments

####List comments
__GET__ /api/v1/articles/:article_id/comments


####Create comment
__POST__ /api/v1/articles/:article_id/comments

Headers:
```
Authorization: <token>
```
Body:
```
article_id
user_id
title
body
```


####Display comment
__GET__ /api/v1/articles/:article_id/comments/:comment_id


####Update comment
__PUT__ /api/v1/articles/:article_id/comments/:comment_id

Headers:
```
Authorization: <token>
```
Body:
```
article_id
user_id
title
body
```


##Information
__GET__ /api/v1/information
