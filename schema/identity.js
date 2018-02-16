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
	}
};