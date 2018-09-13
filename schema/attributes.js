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
            secret: {
                type: 'string',
                minLength: 1,
                maxLength: 100
            },
            publicKey: {
                type: 'string',
                format: 'publicKey'
            },
            secondSecret: {
                type: 'string',
                minLength: 1,
                maxLength: 100
            },
            asset:{
                type: 'object',
                minLength: 1
            }
        },
        required: ['asset','secret','publicKey']
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
        required: ['owner','type','value']
    },

    requestAttributeValidation: {
        id: 'attributes.requestAttributeValidation',
        type: 'object',
        properties: {
            secret: {
                type: 'string',
                minLength: 1,
                maxLength: 100
            },
            publicKey: {
                type: 'string',
                format: 'publicKey'
            },
            secondSecret: {
                type: 'string',
                minLength: 1,
                maxLength: 100
            },
            asset:{
                type: 'object',
                minLength: 1
            }
        },
        required: ['asset','secret','publicKey']
    },

    validateAttribute: {
        id: 'attributes.validateAttribute',
        type: 'object',
        properties: {
            secret: {
                type: 'string',
                minLength: 1,
                maxLength: 100
            },
            publicKey: {
                type: 'string',
                format: 'publicKey'
            },
            secondSecret: {
                type: 'string',
                minLength: 1,
                maxLength: 100
            },
            asset:{
                type: 'object',
                minLength: 1
            }
        },
        required: ['asset','secret','publicKey']
    },
    getRequestAttributeValidation: {
        id: 'attributes.getRequestAttributeValidation',
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                minimum: 0
            },
            validator: {
                type: 'string',
                minLength: 1
            },
            attribute_id: {
                type: 'integer',
                minimum: 0
            }
        }
    },
    getIncompleteAttributeValidationRequests: {
        id: 'attributes.getIncompleteAttributeValidationRequests',
        type: 'object',
        properties: {
            validator: {
                type: 'string',
                minLength: 1
            },
            type: {
                type: 'string',
                minLength: 1
            },
            owner: {
                type: 'string',
                minLength: 1
            },
        }
    },
    getCompletedAttributeValidationRequests: {
        id: 'attributes.getCompletedAttributeValidationRequests',
        type: 'object',
        properties: {
            validator: {
                type: 'string',
                minLength: 1
            },
            type: {
                type: 'string',
                minLength: 1
            },
            owner: {
                type: 'string',
                minLength: 1
            },
        }
    },

    getAttributeValidations: {
        id: 'attributes.getAttributeValidations',
        type: 'object',
        properties: {
            type: {
                minLength: 1
            },
            owner: {
                type: 'string'
            },
            validator: {
                type: 'string'
            }
        }
    },
};
