'use strict';

module.exports = {
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
        required: ['name', 'data_type']
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
                type: 'string',
                minLength: 1
            },
            timestamp: {
                type: 'integer',
                minimum: 0
            }
        },
        required: ['owner']
    },

    attributeOperation: {
        id: 'attributes.attributeOperation',
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
            asset: {
                type: 'object',
                minLength: 1
            }
        },
        required: ['asset', 'secret', 'publicKey']
    },

    consumeAttribute: {
        id: 'attributes.consumeAttribute',
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
            asset: {
                type: 'object',
                minLength: 1
            },
            amount: {
                type: 'integer',
                minimum: 1
            },
        },
        required: ['asset', 'secret', 'publicKey', 'amount']
    },

    getAttributeValidationRequests: {
        id: 'attributes.getAttributeValidationRequests',
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                minimum: 0
            },
            validator: {
                type: 'string',
                minLength: 1,
                format: 'address'
            },
            attributeId: {
                type: 'integer',
                minimum: 1,
            },
        }
    },

    getAttributeValidations: {
        id: 'attributes.getAttributeValidations',
        type: 'object',
        properties: {
            type: {
                type: 'string',
                minLength: 1
            },
            owner: {
                type: 'string',
                format: 'address'
            },
            validator: {
                type: 'string',
                format: 'address'
            }
        }
    },
    getAttributeValidationScore: {
        id: 'attributes.getAttributeValidationScore',
        type: 'object',
        properties: {
            owner: {
                type: 'string',
                format: 'address'
            }
        },
        required: ['owner']
    },

    getIdentityUseRequest: {
        id: 'attributes.getIdentityUseRequest',
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                minimum: 0
            },
            serviceId: {
                type: 'integer',
            },
            serviceName: {
                type: 'string',
            },
            serviceProvider: {
                type: 'string',
                format: 'address'
            },
            type: {
                type: 'string',
                minLength: 1
            },
            owner: {
                type: 'string',
                format: 'address'
            },
        }
    },

    getAttributeConsumption: {
        id: 'attributes.getAttributeConsumption',
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                minimum: 0
            },
            type: {
                type: 'string',
                minLength: 1,
            },
            owner: {
                type: 'string',
                minLength: 1,
                format: 'address'
            },
            before: {
                type: 'integer',
                minimum: 0
            },
            after: {
                type: 'integer',
                minimum: 0
            }
        },
        required: ['type', 'owner']
    },

    runRewardRound: {
        id: 'attributes.runRewardRound',
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
            }
        },
        required: ['secret', 'publicKey']
    },

    updateRewardRound: {
        id: 'attributes.updateRewardRound',
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
            }
        },
        required: ['secret', 'publicKey']
    },

    getLastRewardRound: {
        id: 'attributes.getLastRewardRound',
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
            }
        },
        required: ['secret', 'publicKey']
    },

    getAttributeAssociations: {
        id: 'attributes.getAttributeAssociations',
        type: 'object',
        properties: {
            attributeId: {
                type: 'integer',
                minimum: 1
            }
        },
        required: ['attributeId']
    }

};
