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
		sex: {
			type: 'string',
			maxlength: 1
		},
		birth_day: {
			type: 'integer'
		},
		birth_month: {
			type: 'integer'
		},
		birth_year: {
			type: 'integer'
		},
		phone_number: {
			type: 'string',
			maxlength: 20
		},
		picture: {
			type: 'text',
			nullable: true
		},
		occupation: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		hospital: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		department: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		city: {
			type: 'string',
			maxlength: 255,
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
		},
		question_12: {
			type: 'string',
			maxlength: 1,
			nullable: true
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
		picture: {
			type: 'text',
			nullable: true
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
	},

	announcements: {
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
			maxlength: 255,
			nullable: false
		},
		body: {
			type: 'text',
			maxlength: 2000,
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

	clinics: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		name: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		address_1: {
			type: 'string',
			maxlength: 255
		},
		address_2: {
			type: 'string',
			maxlength: 255
		},
		address_3: {
			type: 'string',
			maxlength: 255
		},
		city: {
			type: 'string',
			maxlength: 255
		},
		province: {
			type: 'string',
			maxlength: 255
		},
		postal_code: {
			type: 'string',
			maxlength: 255
		},
		description: {
			type: 'text'
		},
		picture: {
			type: 'text'
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

	doctors: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		clinic_id: {
			type: 'integer',
			nullable: false,
			unsigned: true,
			references: 'clinics.id'
		},
		name: {
			type: 'string',
			maxlength: 255,
			nullable: false
		},
		position: {
			type: 'string',
			maxlength: 255
		},
		picture: {
			type: 'text'
		},
		hours: {
			type: 'string',
			maxlength: 255
		}
	},

	reminders: {
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
		day: {
			type: 'string',
			maxlength: 40
		},
		time: {
			type: 'string',
			maxlength: 10
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

	topics: {
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

	replies: {
		id: {
			type: 'increments',
			nullable: false,
			primary: true
		},
		topic_id: {
			type: 'integer',
			nullable: false,
			unsigned: true,
			references: 'topics.id'
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
	}
};
