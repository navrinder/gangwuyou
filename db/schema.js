module.exports = {
	users: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		email_address: {
			type: 'string',
			maxlength: 255,
			nullable: false,
			unique: true
		},
		user_name: {
			type: 'string',
			maxlength: 50,
			nullable: false,
			unique: true
		},
		password: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		type: {
			type: 'string',
			maxlength: 50,
			nullable: false
		},
		verified: {
			type: 'string',
			maxlength: 1,
			nullable: false
		},
		active: {
			type: 'string',
			maxlength: 1,
			nullable: false
		},
		created_at: {
			type: 'dateTime',
			nullable: false
		},
		updated_at: {
			type: 'dateTime',
			nullable: true
		}
	},

	answers: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		user_id : {
			type: 'integer',
			nullable: false,
			unsigned: true,
			references: 'users.id'
		},
		question_1: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_2: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_3: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_4: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_5: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_6: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_7: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_8: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_9: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_10: {
			type: 'string',
			maxlength: 1,
			nullable: true
		},
		question_11: {
			type: 'string',
			maxlength: 1,
			nullable: true
		}
	},

	articles: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		user_id: {
			type: 'integer',
			nullable: false,
			unsigned: true,
			references: 'users.id'
		},
		title: {
			type: 'string',
			maxlength: 150,
			nullable: false
		},
		body: {
			type: 'text',
			nullable: false
		},
		category: {
			type: 'string',
			nullable: false
		},
		active: {
			type: 'string',
			maxlength: 1,
			nullable: false
		},
		created_at: {
			type: 'dateTime',
			nullable: false
		},
		updated_at: {
			type: 'dateTime',
			nullable: true
		}
	},

	comments: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		article_id: {
			type: 'integer',
			nullable: false,
			unsigned: true,
			references: 'articles.id'
		},
		user_id: {
			type: 'integer',
			nullable: false,
			unsigned: true,
			references: 'users.id'
		},
		title: {
			type: 'string',
			maxlength: 150,
			nullable: false
		},
		body: {
			type: 'text',
			nullable: false
		},
		active: {
			type: 'string',
			maxlength: 1,
			nullable: false
		},
		created_at: {
			type: 'dateTime',
			nullable: false
		},
		updated_at: {
			type: 'dateTime',
			nullable: true
		}
	},

	questions: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		question: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		answer_a: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		answer_b: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		answer_c: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		answer_d: {
			type: 'string',
			maxlength: 255,
			nullable: false
		}
	},

	information: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		title: {
			type: 'string',
			maxlength: 255
		},
		body: {
			type: 'text'
		}
	}
};
