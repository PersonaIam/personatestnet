'use strict';

module.exports = {

    serviceOperation: {
        id: 'attributes.serviceOperation',
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
                minLength: 1
            }
        },
        required: ['asset', 'secret', 'publicKey']
    },

    listServices : {
        id: 'attributes.listServices',
        type: 'object',
        properties: {
            owner: {
                type: 'string',
                minLength: 1,
                format: 'address'
            }
        }
    },

    getService : {
        id: 'attributes.getService',
        type: 'object',
        properties: {
            owner: {
                type: 'string',
                minLength: 1,
                format: 'address'
            },
            status: {
                type: 'string'
            },
            name: {
                type: 'string'
            }
        }
    },

    getServiceAttributeTypes : {
        id: 'attributes.getServiceAttributeTypes',
        type: 'object',
        properties: {
            provider: {
                type: 'string',
                minLength: 1,
                format: 'address'
            },
            name: {
                type: 'string'
            }
        },
        required: ['provider', 'name']
    }

};
