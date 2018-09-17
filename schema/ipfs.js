'use strict';

module.exports = {
    addFilesToIpfs: {
        id: 'ipfs.addFilesToIpfs',
        type: 'object',
        properties: {
            files: {
                type: 'object'
            },
        },
        required: ['files'],
    },
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
