'use strict';

module.exports = {
    API_ENDPOINT_NOT_FOUND : 'API endpoint not found',
    BLOCKCHAIN_LOADING: 'Blockchain is loading',

    ATTRIBUTE_ALREADY_EXISTS : 'Attribute already exists',
    ACCOUNT_NOT_FOUND : 'Account not found',
    SENDER_IS_NOT_OWNER : 'Sender is not the attribute owner',
    ATTRIBUTE_NOT_FOUND : 'Attribute not found',
    DOCUMENT_NOT_FOUND : 'Document not found',
    ATTRIBUTE_NOT_FOUND_FOR_UPDATE : 'Attribute not found for update',
    EXPIRED_ATTRIBUTE : 'Attribute is expired',
    INACTIVE_ATTRIBUTE : 'Attribute is inactive',
    ATTRIBUTE_TYPE_NOT_FOUND : 'Attribute type not found',
    NOTHING_TO_UPDATE : 'Nothing to update',
    EXPIRE_TIMESTAMP_REQUIRED : 'Expire timestamp is required for this attribute type',
    EXPIRE_TIMESTAMP_IN_THE_PAST : 'Expire timestamp must be a timestamp in the future',
    ATTRIBUTE_VALIDATION_REQUESTS_NOT_FOUND : 'Attribute validation requests not found',
    ATTRIBUTE_SHARES_NOT_FOUND : 'Attribute shares not found',
    ATTRIBUTE_SHARE_REQUESTS_NOT_FOUND : 'Attribute share requests not found',
    ATTRIBUTE_WITH_NO_ASSOCIATIONS_CANNOT_BE_VALIDATED : 'Attribute has no associations and therefore cannot be validated',

    VALIDATOR_ALREADY_HAS_PENDING_APPROVAL_VALIDATION_REQUEST_FOR_ATTRIBUTE : 'Validator already has a pending approval validation request for the given attribute',
    VALIDATOR_HAS_NO_VALIDATION_REQUEST : 'Validator does not have any validation request to complete for this attribute',
    NO_ATTRIBUTE_VALIDATION_REQUESTS : 'No attribute validation requests were found for the given parameters',
    NO_ATTRIBUTE_VALIDATIONS : 'No attribute validations were found for the given parameters',
    ATTRIBUTE_VALIDATION_ALREADY_MADE : 'Attribute validation already made',
    VALIDATION_REQUEST_MISSING_FOR_ACTION : 'There is no validation request for this action',
    ATTRIBUTE_VALIDATION_WITH_NO_APPROVED_VALIDATION_REQUEST : 'Validator does not have an approved validation request for this attribute',

    ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS: 'The specified attribute validation request must be in progress for the action to take place',
    ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL : 'The specified attribute validation request must be pending approval for the action to take place',
    UNKNOWN_VALIDATION_REQUEST_ANSWER : 'Unknown validation request answer',

    ATTRIBUTE_ASSOCIATION_BASE_ATTRIBUTE_NOT_A_FILE : 'Incorrect association provided : The base attribute must be of data type file',
    ATTRIBUTE_ASSOCIATION_DIFFERENT_OWNERS : 'Incorrect association provided : one of the attributes to be associated does not belong to the current owner',
    INCORRECT_VALIDATION_PARAMETERS : 'Either the attribute id, the validation request validator or the attribute owner must be provided',
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
    VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR : 'Only the validator is allowed to perform this action on a validation request',
    VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR : 'Only the owner is allowed to perform this action on a validation request',

    NO_CONSUMPTIONS_FOR_REWARD_ROUND : 'The reward was round not generated because there were no attribute consumptions since the last completed reward round',
    REWARD_ROUND_TOO_SOON : 'Not enough time has passed since the last reward round was executed',
    REWARD_ROUND_WITH_NO_UPDATE : 'Nothing to update, last reward round was completed',

    NO_ASSOCIATIONS_FOR_NON_FILE_TYPE : 'Associations are not supported for non-file attribute types',
    MISSING_VALIDATION_TYPE : 'Validation type is missing',
    INCORRECT_VALIDATION_TYPE : 'Incorrect validation type',
    REASON_TOO_BIG_DECLINE : 'The reason for declining a validation request is limited to 1024 characters',
    REASON_TOO_BIG_REJECT : 'The reason for rejecting a validation request is limited to 1024 characters',
    REJECT_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON : 'A reason must be specified when rejecting a validation request',
    DECLINE_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON : 'A reason must be specified when declining a validation request',
};

