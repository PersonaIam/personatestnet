'use strict';

module.exports = {
	listAttributes: {
		id: 'attributes.getAttributesByFilter',
		type: 'object',
		properties: {
			owner: {
				type: 'string',
				minLength: 1
			},
            type: {
                type: 'integer',
                minimum: 1
            },
            value: {
                type: 'string',
                minLength: 0
            },
            timestamp: {
                type: 'integer',
                minimum: 0
            }
		}
	},
    listAttributeTypes: {
        id: 'attributes.listAttributeTypes',
        type: 'object',
    },
    getAttributeType: {
        id: 'attributes.getAttributeType',
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 1
            }
        },
        required: ['name']
    },
    createAttributeType: {
        id: 'attributes.createAttributeType',
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 1,
            },
            data_type: {
                type: 'string',
                minLength: 1
            },
            validation: {
                type: 'string',
                minLength: 1,
            },
            options: {
                type: 'string',
                minLength: 1,
            },
        },
        required: ['name','data_type']
    },
    getAttribute: {
        id: 'attributes.getAttribute',
        type: 'object',
        properties: {
            owner: {
                type: 'string',
                minLength: 1,
                format: 'address'
            },
            type: {
                minLength: 1
            },
            timestamp: {
                type: 'integer',
                minimum: 0
            }
        },
        required: ['owner']
    },
    addAttribute: {
        id: 'attributes.addAttribute',
        type: 'object',
        properties: {
            value:{
                minLength: 1
            },
            owner: {
                type: 'string',
                minLength: 1,
                format: 'address'
            },
            type: {
                type: 'string',
                minLength: 1
            },
            timestamp: {
                type: 'integer',
                minimum: 0
            },
            active: {
                type: 'integer'
            }
        },
        required: ['owner','type','value','timestamp','secret']
    },
    updateAttribute: {
        id: 'attributes.updateAttribute',
        type: 'object',
        properties: {
            value:{
                minLength: 1
            },
            owner: {
                type: 'string',
                minLength: 1,
                format: 'address'
            },
            type: {
                minLength: 1
            },
            timestamp: {
                type: 'integer',
                minimum: 0
            },
            active: {
                type: 'integer'
            }
        },
        required: ['owner','type','value','secret']
    }
};
