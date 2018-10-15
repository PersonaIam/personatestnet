'use strict';

module.exports = {
    API_ENDPOINT_NOT_FOUND : 'API endpoint not found',
    BLOCKCHAIN_LOADING: 'Blockchain is loading',

    ATTRIBUTE_ALREADY_EXISTS : 'Attribute already exists',
    ACCOUNT_NOT_FOUND : 'Account not found',
    ATTRIBUTE_NOT_FOUND : 'Attribute not found',
    EXPIRED_ATTRIBUTE : 'Attribute is expired',
    INACTIVE_ATTRIBUTE : 'Attribute is inactive',
    ATTRIBUTE_TYPE_NOT_FOUND : 'Attribute type not found',
    ATTRIBUTE_VALIDATION_REQUESTS_NOT_FOUND : 'Attribute validation requests not found',
    ATTRIBUTE_SHARES_NOT_FOUND : 'Attribute shares not found',
    ATTRIBUTE_SHARE_REQUESTS_NOT_FOUND : 'Attribute share requests not found',

    VALIDATOR_ALREADY_HAS_VALIDATION_REQUEST : 'Validator already has an active validation request for the given attribute',
    VALIDATOR_HAS_NO_VALIDATION_REQUEST : 'Validator does not have any validation request to complete for this attribute',
    NO_ATTRIBUTE_VALIDATIONS_OR_REQUESTS : 'No attribute validation requests exists for the given parameters',
    NO_ATTRIBUTE_VALIDATIONS : 'No attribute validations were found for the given parameters',
    NO_ATTRIBUTE_VALIDATION_REQUESTS : 'No attribute validation requests were found for the given parameters',
    ATTRIBUTE_VALIDATION_ALREADY_MADE : 'Attribute validation already made',

    INCORRECT_VALIDATION_PARAMETERS : 'Either the validator or the attribute (type and owner information) must be provided',
    INCORRECT_SHARE_PARAMETERS : 'Either the applicant or the attribute (type and owner information) must be provided',

    ATTRIBUTE_SHARE_REQUEST_ALREADY_EXISTS : 'Applicant already has a share request for the given attribute',
    ATTRIBUTE_SHARE_WITH_NO_SHARE_REQUEST : 'Applicant does not have a share request for this attribute',
    ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST : 'Applicant does not have an approved share request for this attribute',
    ATTRIBUTE_APPROVAL_SHARE_WITH_NO_SHARE_REQUEST : 'There is no share request for this approval',
    ATTRIBUTE_APPROVAL_SHARE_ALREADY_APPROVED: 'Attribute share request is already approved',
    ATTRIBUTE_APPROVAL_SHARE_ALREADY_COMPLETED: 'Attribute share request is already completed',
    ATTRIBUTE_APPROVAL_SHARE_ALREADY_UNAPPROVED: 'Attribute share request is already unapproved',

    IPFS_UPLOAD_FAIL : 'Failed to upload to IPFS',
    ATTRIBUTES_LIST_FAIL : 'Failed to list attributes',
    ATTRIBUTE_TYPES_LIST_FAIL :'Failed to list attribute types',
    ATTRIBUTE_TYPE_CREATE_FAIL : 'Failed to create attribute type',
    ATTRIBUTE_GET_FAIL : 'Failed to get attribute',
    ATTRIBUTE_VALIDATION_REQUESTS_FAIL : 'Failed to get attribute validation requests',

    INVALID_PASSPHRASE : 'Invalid passphrase',

    OWNER_IS_APPLICANT_ERROR : 'Owner cannot be the applicant of his own attribute',
    OWNER_IS_VALIDATOR_ERROR : 'Owner cannot be the validator of his own attribute',

    NO_CONSUMPTIONS_FOR_REWARD_ROUND : 'The reward was round not generated because there were no attribute consumptions since the last completed reward round',
    REWARD_ROUND_TOO_SOON : 'Not enough time has passed since the last reward round was executed',
    REWARD_ROUND_WITH_NO_UPDATE : 'Nothing to update, last reward round was completed'
};

