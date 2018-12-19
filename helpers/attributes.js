'use strict';
var TRANSACTION_TYPES = require('./transactionTypes');
var IPFS_ATTRIBUTE_TYPES = [
    'file',
    'ipfs',
];

/**
 * Check if a certain attribute value needs to be saved on IPFS
 * @param {string} the attribute type
 * @returns {boolean}
 */
function isIPFSUploadRequired(attributeType) {
    return IPFS_ATTRIBUTE_TYPES.indexOf(attributeType) !== -1;
}

/**
 * Check if a certain transactions has IPFS attributes
 * @param {object} the transaction
 * @returns {boolean}
 */
function isIPFSTransaction(transaction) {
    return (
        transaction.type === TRANSACTION_TYPES.CREATE_ATTRIBUTE &&
        transaction.asset &&
        transaction.asset.attribute &&
        transaction.asset.attribute[0] &&
        isIPFSUploadRequired(transaction.asset.attribute[0].attributeDataType)
    )
}

module.exports = {
    isIPFSUploadRequired: isIPFSUploadRequired,
    isIPFSTransaction: isIPFSTransaction,
};
