'use strict';

module.exports = {
    getFileFromIpfs: {
        id: 'ipfs.getFileFromIpfs',
        type: 'object',
        properties: {
            hash: {
                type: 'string',
                minLength: 1
            },
        },
        required: ['hash'],
    },
};
