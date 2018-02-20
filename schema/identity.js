'use strict';

module.exports = {
    getFragments: {
		id: 'identity.getFragments',
		type: 'object',
		properties: {
			address: {
				type: 'string',
				minLength: 1,
				format: 'address'
			}
		},
		required: ['address']
	},
	getVerifications: {
		id: 'identity.getVerifications',
		type: 'object',
		properties: {
			id: {
				type: 'string',
				minLength: 1
			}
		},
		required: ['id']
	}
};