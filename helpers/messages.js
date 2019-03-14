'use strict';

module.exports = {
    API_ENDPOINT_NOT_FOUND : 'API endpoint not found',
    BLOCKCHAIN_LOADING: 'Blockchain is loading',
    INVALID_PASSPHRASE : 'Invalid passphrase',

    ACCOUNT_NOT_FOUND : 'Account not found',
    SENDER_IS_NOT_OWNER : 'Sender is not the attribute owner',
    ATTRIBUTE_NOT_FOUND : 'Attribute not found',
    MORE_THAN_ONE_ATTRIBUTE_EXISTS : 'More than one attribute exists for this owner and type. Please provide the attributeId instead of the type',
    ATTRIBUTE_NOT_FOUND_FOR_UPDATE : 'Attribute not found for update',
    EXPIRED_ATTRIBUTE : 'Attribute is expired',
    INACTIVE_ATTRIBUTE : 'Attribute is inactive',
    REJECTED_ATTRIBUTE : 'Attribute is rejected due to unsuccessful notarizations. Please update the attribute value and resume the notarization process',
    ATTRIBUTE_TYPE_NOT_FOUND : 'Attribute type not found',
    NOTHING_TO_UPDATE : 'Nothing to update',
    EXPIRE_TIMESTAMP_REQUIRED : 'Expire timestamp is required for this attribute type',
    EXPIRE_TIMESTAMP_IN_THE_PAST : 'Expire timestamp must be a timestamp in the future',
    ATTRIBUTE_WITH_NO_ASSOCIATIONS_CANNOT_BE_VALIDATED : 'Attribute has no associations and therefore cannot be validated',

    PENDING_APPROVAL_VALIDATION_REQUEST_ALREADY_EXISTS : 'Validator already has a pending approval validation request for the given attribute',
    IN_PROGRESS_VALIDATION_REQUEST_ALREADY_EXISTS : 'Validator already has an in progress validation request for the given attribute',
    COMPLETED_VALIDATION_REQUEST_ALREADY_EXISTS : 'Validator already has a completed validation request for the given attribute',
    VALIDATION_REQUEST_MISSING_FOR_ACTION : 'There is no validation request for this action',
    VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION : 'There is no validation request that is pending approval or in progress for this attribute',

    ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS: 'The specified attribute validation request must be in progress for the action to take place',
    ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL : 'The specified attribute validation request must be pending approval for the action to take place',

    ASSOCIATIONS_NOT_SUPPORTED_FOR_NON_FILE_TYPES : 'Associations are not supported for non-file attribute types',
    ATTRIBUTE_ASSOCIATION_BASE_ATTRIBUTE_NOT_A_FILE : 'Incorrect association provided : The base attribute must be of data type file',
    ATTRIBUTE_ASSOCIATION_DOES_NOT_EXIST_FOR_CURRENT_OWNER : 'Incorrect association provided : one or more of the attributes to be associated does not exist or does not belong to the current owner',
    INCORRECT_VALIDATION_REQUEST_PARAMETERS : 'Either the attribute id, the validation request validator or the attribute owner must be provided',
    INCORRECT_IDENTITY_USE_PARAMETERS : 'If the serviceName parameter is specified, the serviceProvider parameter must also be specified',
    INCORRECT_CREDIBILITY_PARAMETERS : 'Either the owner or the attributeId parameters must be provided',
    INCORRECT_MONTHS_VALUE : 'The "months" query parameter must be a positive integer',
    INCORRECT_VALIDATION_TYPE : 'Incorrect validation type',

    //TODO : add tests or remove (applies to all items in the section below)
    IPFS_UPLOAD_FAIL : 'Failed to upload to IPFS',
    ATTRIBUTE_TYPES_LIST_FAIL :'Failed to list attribute types',
    ATTRIBUTE_TYPE_CREATE_FAIL : 'Failed to create attribute type',
    ATTRIBUTE_GET_FAIL : 'Failed to get attribute',
    ATTRIBUTE_VALIDATION_REQUESTS_FAIL : 'Failed to get attribute validation requests',
    SERVICES_LIST_FAIL :'Failed to list services',

    OWNER_IS_VALIDATOR_ERROR : 'Owner cannot be the validator of his own attribute',
    VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR : 'Only the validator is allowed to perform this action on a validation request',
    VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR : 'Only the owner is allowed to perform this action on a validation request',

    //TODO : add tests ( all 3 below )
    NO_CONSUMPTIONS_FOR_REWARD_ROUND : 'The reward was round not generated because there were no attribute consumptions since the last completed reward round',
    REWARD_ROUND_TOO_SOON : 'Not enough time has passed since the last reward round was executed',
    REWARD_ROUND_WITH_NO_UPDATE : 'Nothing to update, last reward round was completed',

    MISSING_VALIDATION_TYPE : 'Validation type is missing',
    MISSING_SERVICE_DESCRIPTION : 'Service description is not provided. Nothing to create',
    MISSING_ATTRIBUTE_TYPES : 'Service attribute types are not provided. Nothing to create',
    MISSING_NUMBER_OF_VALIDATIONS_REQUIRED : 'Service attribute validations required number is not provided. Nothing to create',
    MISSING_OWNER_ADDRESS : 'Missing required property: owner',
    MISSING_MONTHS : 'Missing required property: months',

    // reasons
    REASON_TOO_BIG_DECLINE : 'The reason for declining a request is limited to 1024 characters',
    REASON_TOO_BIG_REJECT : 'The reason for rejecting a request is limited to 1024 characters',
    REASON_TOO_BIG_END : 'The reason for ending a request is limited to 1024 characters',
    REJECT_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON : 'A reason must be specified when rejecting a validation request',
    DECLINE_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON : 'A reason must be specified when declining a validation request',
    END_IDENTITY_USE_REQUEST_NO_REASON : 'A reason must be specified when ending an identity use request',

    SERVICE_ALREADY_EXISTS : 'A service with this name already exists for this provider',
    SERVICE_IS_ALREADY_INACTIVE : 'The service is already inactive',
    SERVICE_IS_ALREADY_ACTIVE : 'The service is already active',

    PENDING_APPROVAL_IDENTITY_USE_REQUEST_ALREADY_EXISTS : 'A pending approval identity use request already exists',
    ACTIVE_IDENTITY_USE_REQUEST_ALREADY_EXISTS : 'An active identity use request already exists',
    IDENTITY_USE_REQUEST_MISSING_IN_STATUS_FOR_ACTION : 'There is no identity use request that is pending approval or active for this attribute',
    IDENTITY_USE_REQUEST_MISSING_FOR_ACTION : 'There is no identity use request for this action',
    IDENTITY_USE_REQUEST_NOT_ACTIVE: 'The specified identity use request must be active for the action to take place',
    IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL : 'The specified identity use request must be in pending approval status for the action to take place',
    IDENTITY_USE_REQUEST_ALREADY_EXISTS : 'The given attribute already has an identity use request for the given service',
    IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_PROVIDER_ERROR : 'Only the service provider is allowed to perform this action on an identity use request',
    IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR : 'Only the owner is allowed to perform this action on an identity use request',
    IDENTITY_USE_REQUEST_SENDER_IS_NOT_OWNER_ERROR : 'Only the owner is allowed to create an identity use request',
    IDENTITY_USE_REQUEST_FOR_INACTIVE_SERVICE : 'An identity use request cannot be created for an inactive service',
    IDENTITY_USE_REQUEST_ACTION_FOR_INACTIVE_SERVICE : 'No action can be performed on an identity use request which belongs to an inactive service',
    DECLINE_IDENTITY_USE_REQUEST_NO_REASON : 'A reason must be specified when declining an identity use request',
    IDENTITY_USE_REQUEST_REJECTED_REASON : 'One of the attributes that is part of this identity use was rejected',
    IDENTITY_USE_REQUEST_REJECTED_NO_ACTION : 'No action can be performed on a rejected identity use request',

    REQUIRED_SERVICE_ATTRIBUTES_ARE_MISSING : 'Cannot create identity use request : missing required service attributes',
    REQUIRED_SERVICE_ATTRIBUTES_ARE_MISSING_EXPIRED_OR_INACTIVE : 'Cannot create identity use request : some attributes are expired or are missing required validations',
    REQUIRED_SERVICE_ATTRIBUTES_VALUES_ARE_MISSING : 'Cannot create identity use request : some required attribute values are not provided in the request',

    SERVICE_DESCRIPTION_TOO_LONG : 'The service description is limited to 2048 characters',
    SERVICE_NOT_FOUND :'No service was found for the given parameters',
    SERVICE_ACTION_SENDER_IS_NOT_PROVIDER_ERROR : 'Only the service provider is allowed to perform actions on his own service',

    INVALID_OWNER_ADDRESS : 'Owner address is invalid',
    INVALID_VALIDATOR_ADDRESS : 'Validator address is invalid',
    EMPTY_ASSOCIATIONS_ARRAY : 'If associations are specified, they must be provided',

    // INTERNAL - not exposed in the API
    UNKNOWN_VALIDATION_REQUEST_ANSWER : 'Unknown validation request answer',
    UNKNOWN_IDENTITY_USE_REQUEST_ANSWER : 'Unknown identity use request answer'
};

