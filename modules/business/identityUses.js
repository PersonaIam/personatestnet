'use strict';

let Router = require('../../helpers/router.js');
let OrderBy = require('../../helpers/orderBy.js');
let schema = require('../../schema/business/attributes.js');
let slots = require('../../helpers/slots.js');
let moment = require('moment');
let sql = require('../../sql/business/attributes.js');
let transactionTypes = require('../../helpers/transactionTypes.js');
let messages = require('../../helpers/messages.js');
let constants = require('../../helpers/constants.js');
let _ = require('lodash');
let attributes = require('./attributes.js');
let services = require('./services.js');
let async = require('async')

// Private fields
let modules, library, self, __private = {}, shared = {};

__private.assetTypes = {};

// Constructor
function IdentityUses(cb, scope) {
    library = scope;
    self = this;

    let IdentityUseRequest = require('../../logic/identityUseRequest.js');
    __private.assetTypes[transactionTypes.REQUEST_IDENTITY_USE] = library.logic.transaction.attachAssetType(
        transactionTypes.REQUEST_IDENTITY_USE, new IdentityUseRequest()
    );

    let IdentityUseApprove = require('../../logic/identityUseApprove.js');
    __private.assetTypes[transactionTypes.APPROVE_IDENTITY_USE_REQUEST] = library.logic.transaction.attachAssetType(
        transactionTypes.APPROVE_IDENTITY_USE_REQUEST, new IdentityUseApprove()
    );

    let IdentityUseDecline = require('../../logic/identityUseDecline.js');
    __private.assetTypes[transactionTypes.DECLINE_IDENTITY_USE_REQUEST] = library.logic.transaction.attachAssetType(
        transactionTypes.DECLINE_IDENTITY_USE_REQUEST, new IdentityUseDecline()
    );

    let IdentityUseCancel = require('../../logic/identityUseCancel.js');
    __private.assetTypes[transactionTypes.CANCEL_IDENTITY_USE_REQUEST] = library.logic.transaction.attachAssetType(
        transactionTypes.CANCEL_IDENTITY_USE_REQUEST, new IdentityUseCancel()
    );

    let IdentityUseEnd = require('../../logic/identityUseEnd.js');
    __private.assetTypes[transactionTypes.END_IDENTITY_USE_REQUEST] = library.logic.transaction.attachAssetType(
        transactionTypes.END_IDENTITY_USE_REQUEST, new IdentityUseEnd()
    );

    return cb(null, self);
}

//
//__EVENT__ `onAttachPublicApi`

//
IdentityUses.prototype.onAttachPublicApi = function () {
    __private.attachApi();
};

// Events
//
//__EVENT__ `onBind`

//
IdentityUses.prototype.onBind = function (scope) {
    modules = scope;

    __private.assetTypes[transactionTypes.REQUEST_IDENTITY_USE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.APPROVE_IDENTITY_USE_REQUEST].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.DECLINE_IDENTITY_USE_REQUEST].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.END_IDENTITY_USE_REQUEST].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.CANCEL_IDENTITY_USE_REQUEST].bind({
        modules: modules, library: library
    });
};

// Private methods
__private.attachApi = function () {
    let router = new Router();

    router.use(function (req, res, next) {
        if (modules) {
            return next();
        }
        res.status(500).send({success: false, error: messages.BLOCKCHAIN_LOADING});
    });

    router.map(shared, {

        'get /': 'getIdentityUseRequests',
        'post /': 'requestIdentityUse',

        'post /approve': 'approveIdentityUseRequest',
        'post /decline': 'declineIdentityUseRequest',
        'post /end': 'endIdentityUseRequest',
        'post /cancel': 'cancelIdentityUseRequest',

    });

    router.use(function (req, res, next) {
        res.status(500).send({success: false, error: messages.API_ENDPOINT_NOT_FOUND});
    });

    library.network.app.use('/api/identity-use', router);
    library.network.app.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }
        library.logger.error(' API error ' + req.url, err);
        res.status(500).send({success: false, error: 'API error: ' + err.message});
    });
};

__private.getIdentityUseRequestsByFilter = function (filter, cb) {
    if (!filter.serviceProvider && !filter.serviceId && !(filter.serviceName && filter.serviceProvider) && !filter.attributeId && !filter.owner) {
        return cb(messages.INCORRECT_IDENTITY_USE_PARAMETERS);
    }
    let query, params;

    if (filter.serviceId && filter.owner) {
        query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceAndOwner;
        params = {service_id: filter.serviceId, owner : filter.owner}
    } else {
        if (filter.serviceId) {
            query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceId;
            params = {service_id: filter.serviceId}
        } else {
            if (filter.owner) {
                query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByOwner;
                params = {owner: filter.owner}
            }
            if (filter.serviceName && filter.serviceProvider) {
                query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceNameAndProvider;
                params = {service_name: filter.serviceName, service_provider: filter.serviceProvider}
            }
            if (!filter.serviceName && filter.serviceProvider) {
                query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceProvider;
                params = {service_provider: filter.serviceProvider}
            }
        }
    }

    library.db.query(query, params).then(function (identityUseRequests) {

        if (identityUseRequests && identityUseRequests.length > 0) {
            if (filter.status) {
                identityUseRequests = identityUseRequests.filter(identityUseRequest => identityUseRequest.status === filter.status)
            }
            return cb(null, {identityUseRequests: identityUseRequests, count: identityUseRequests.length});
        } else {
            return cb(null, {identityUseRequests: [], count: 0});
        }
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

shared.requestIdentityUse = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.identityuse) {
            return cb('Identity use information is not provided');
        }

        if (req.body.asset.identityuse.length === 0 || !req.body.asset.identityuse[0].attributes) {
            return cb('Identity use attributes are not provided');
        }
        if (!library.logic.transaction.validateAddress(req.body.asset.identityuse[0].owner)) {
            return cb(messages.INVALID_OWNER_ADDRESS);
        }

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb(messages.INVALID_PASSPHRASE);
            }
        }
        modules.accounts.setAccountAndGet({publicKey: req.body.publicKey}, function (err, account) {
            if (!account || account.address !== req.body.asset.identityuse[0].owner) {
                return cb(messages.IDENTITY_USE_REQUEST_SENDER_IS_NOT_OWNER_ERROR)
            }
            services.getServicesByFilter(
                {
                    name: req.body.asset.identityuse[0].serviceName,
                    provider: req.body.asset.identityuse[0].serviceProvider
                }, function (err, serviceResult) {
                    if (serviceResult.services[0].status === constants.serviceStatus.INACTIVE) {
                        return cb(messages.IDENTITY_USE_REQUEST_FOR_INACTIVE_SERVICE)
                    }
                    let serviceAttributes = JSON.parse(serviceResult.services[0].attribute_types);
                    let reqGetAttributesByFilter = req;
                    reqGetAttributesByFilter.body.owner = req.body.asset.identityuse[0].owner;
                    reqGetAttributesByFilter.body.validationsRequired = serviceResult.services[0].validations_required;

                    attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, ownerAttributes) {
                        if (err) {
                            return cb(err);
                        }
                        let ownerAttributesActiveAndNotExpired = ownerAttributes.attributes.filter(attribute =>

                            attribute.active && (!attribute.expire_timestamp || attribute.expire_timestamp > slots.getTime()));

                        let ownerAttributesActiveAndNotExpiredTypes = ownerAttributesActiveAndNotExpired.map(attribute => attribute.type);

                        let ownerAttributeTypes = ownerAttributes.attributes.map(attribute => attribute.type);

                        let identityRequestAttributes = req.body.asset.identityuse[0].attributes;
                        let identityRequestAttributesTypes = identityRequestAttributes.map(attribute => attribute.type)

                        if (_.intersection(ownerAttributeTypes, serviceAttributes).length !== serviceAttributes.length) {
                            return cb(messages.REQUIRED_SERVICE_ATTRIBUTES_ARE_MISSING);
                        }

                        if (_.intersection(ownerAttributesActiveAndNotExpiredTypes, serviceAttributes).length !== serviceAttributes.length) {
                            return cb(messages.REQUIRED_SERVICE_ATTRIBUTES_ARE_MISSING_EXPIRED_OR_INACTIVE);
                        }

                        if (_.intersection(identityRequestAttributesTypes, serviceAttributes).length !== serviceAttributes.length) {
                            return cb(messages.REQUIRED_SERVICE_ATTRIBUTES_VALUES_ARE_MISSING);
                        }

                        req.body.serviceId = serviceResult.services[0].id;
                        req.body.owner = req.body.asset.identityuse[0].owner;

                        __private.getIdentityUseRequestsByFilter(req.body, function (err, data) {
                            if (err) {
                                return cb(err);
                            }
                            let identityUseRequests = data.identityUseRequests;

                            // Filter out canceled, ended and declined identity use requests, creating a new request should be allowed in these cases
                            let statusesToFilterOut = [];
                            statusesToFilterOut.push(constants.identityUseRequestStatus.ENDED);
                            statusesToFilterOut.push(constants.identityUseRequestStatus.DECLINED);
                            statusesToFilterOut.push(constants.identityUseRequestStatus.CANCELED);
                            if (identityUseRequests && identityUseRequests.length > 0) {
                                identityUseRequests = identityUseRequests.filter(identityUseRequest => statusesToFilterOut.indexOf(identityUseRequest.status) === -1)
                            }
                            if (identityUseRequests && identityUseRequests.length > 0 && identityUseRequests[0].status === constants.identityUseRequestStatus.PENDING_APPROVAL) {
                                return cb(messages.PENDING_APPROVAL_IDENTITY_USE_REQUEST_ALREADY_EXISTS);
                            }

                            if (identityUseRequests && identityUseRequests.length > 0 && identityUseRequests[0].status === constants.identityUseRequestStatus.ACTIVE) {
                                return cb(messages.ACTIVE_IDENTITY_USE_REQUEST_ALREADY_EXISTS);
                            }

                            req.body.asset.identityuse[0].serviceId = serviceResult.services[0].id;
                            attributes.listAttributeTypes({}, function (err, attributeTypes) {
                                let x = attributeTypes.attribute_types;
                                let attributeFileTypesNames = x.filter(i => i.data_type === 'file').map(o => o.name);

                                const fileAttributes = identityRequestAttributes.filter(attribute => attributeFileTypesNames.includes(attribute.type));

                                async.eachSeries(fileAttributes, function (fileAttribute, eachCb) {
                                    attributes.addAttributeToIpfs({
                                            attributeDataType: 'file', attributeDataName: fileAttribute.type,
                                            value: fileAttribute.value, publicKey: req.body.publicKey
                                        },
                                        function (err, hash) {
                                            if (err) {
                                                return cb('Not all attributes were uploaded to IPFS')
                                            }
                                            req.body.asset.identityuse[0].attributes.map(attribute => { if (attribute.type === fileAttribute.type) {
                                                attribute.value = hash;
                                            }});
                                            return eachCb();
                                        })
                                },function(err) {

                                    attributes.buildTransaction({
                                            req: req,
                                            keypair: keypair,
                                            transactionType: transactionTypes.REQUEST_IDENTITY_USE
                                        },
                                        function (err, resultData) {
                                            if (err) {
                                                return cb(err);
                                            }
                                            return cb(null, resultData);
                                        });
                                });
                            });
                        });
                    })
                });
        });
    });
};

shared.getIdentityUseRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getIdentityUseRequest, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getIdentityUseRequestsByFilter(req.body, function (err, res) {
            if (err) {
                return cb(err);
            }

            if (req.body.serviceId && req.body.owner) { // only get validation requests if there is a single IdentityUseRequest to retrieve
                library.db.query(sql.IdentityUseRequestsSql.getAnsweredValidationRequestsForIdentityUseRequest,
                    {service_id: req.body.serviceId, owner: req.body.owner}).then(function (validationRequests) {
                    if (err) {
                        return cb(err);
                    }

                    let attributeTypes = res.identityUseRequests[0].attribute_types;
                    validationRequests = validationRequests.filter(validationRequest => attributeTypes.includes(validationRequest.type));
                    let resultData = {identity_use_requests: res.identityUseRequests, validation_requests_count: validationRequests.length, validation_requests : validationRequests};
                    return cb(null, resultData);
                });
            } else {
                let resultData = {identity_use_requests: res.identityUseRequests, count: res.count};
                return cb(null, resultData);
            }
        });
    });
};

__private.identityUseAnswer = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.identityuse) {
            return cb('Identity use is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.identityuse[0].owner)) {
            return cb(messages.INVALID_OWNER_ADDRESS);
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.identityuse[0].serviceProvider)) {
            return cb('Service provider address is incorrect');
        }

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb(messages.INVALID_PASSPHRASE);
            }
        }

                let reqGetServicesByFilter = req;

                reqGetServicesByFilter.body.name = req.body.asset.identityuse[0].serviceName;
                reqGetServicesByFilter.body.provider = req.body.asset.identityuse[0].serviceProvider;

                services.getServicesByFilter(reqGetServicesByFilter.body, function (err, data) {
                    if (!data.services || data.services.length === 0) {
                        return cb(messages.SERVICE_NOT_FOUND);
                    }

                    if (data.services[0].status === constants.serviceStatus.INACTIVE) {
                        return cb (messages.IDENTITY_USE_REQUEST_ACTION_FOR_INACTIVE_SERVICE)
                    }

                    req.body.serviceId = data.services[0].id;
                    req.body.owner = req.body.asset.identityuse[0].owner;

                    __private.getIdentityUseRequestsByFilter(req.body, function (err, data) {
                        if (err || !data.identityUseRequests || data.identityUseRequests.length === 0) {
                            return cb(messages.IDENTITY_USE_REQUEST_MISSING_FOR_ACTION);
                        }

                        // Filter out canceled, completed, rejected and declined validation requests, no answer can be performed on these types of requests
                        let statusesToFilterOut = [];
                        statusesToFilterOut.push(constants.identityUseRequestStatus.DECLINED);
                        statusesToFilterOut.push(constants.identityUseRequestStatus.ENDED);
                        statusesToFilterOut.push(constants.identityUseRequestStatus.CANCELED);
                        if (data.identityUseRequests && data.identityUseRequests.length > 0) {
                            data.identityUseRequests = data.identityUseRequests.filter(identityUseRequest => statusesToFilterOut.indexOf(identityUseRequest.status) === -1)
                        }
                        if (data.identityUseRequests && data.identityUseRequests.length === 0) {
                            return cb(messages.IDENTITY_USE_REQUEST_MISSING_IN_STATUS_FOR_ACTION);
                        }

                        let paramsCheckAnswer = {};
                        paramsCheckAnswer.answer = req.body.asset.identityuse[0].answer;
                        paramsCheckAnswer.status = data.identityUseRequests[0].status;
                        req.body.asset.identityUseRequestId = data.identityUseRequests[0].id; // this is required inside the logic

                        __private.checkIdentityUseAnswer(paramsCheckAnswer, function (err, response) {
                            if (err) {
                                return cb(err)
                            }

                            if (!response) {
                                return cb(messages.UNKNOWN_IDENTITY_USE_REQUEST_ANSWER)
                            }
                            let transactionType = response.transactionType;

                            modules.accounts.setAccountAndGet({publicKey: req.body.publicKey}, function (err, account) {
                                __private.checkIdentityUseAnswerSender(
                                    {
                                        account: account,
                                        answer: paramsCheckAnswer.answer,
                                        owner: req.body.owner,
                                        provider: req.body.provider
                                    },
                                    function (err, response) {
                                        if (err) {
                                            return cb(err);
                                        }

                                        attributes.buildTransaction({
                                                req: req,
                                                keypair: keypair,
                                                transactionType: transactionType
                                            },
                                            function (err, resultData) {
                                                if (err) {
                                                    return cb(err);
                                                }
                                                return cb(null, resultData);
                                            });
                                    });
                            });
                        });
                    });
                });
            });
};

__private.checkIdentityUseAnswer = function(params, cb) {

    if (params.answer === constants.identityUseRequestActions.APPROVE) {
        if (params.status !== constants.identityUseRequestStatus.PENDING_APPROVAL) {
            return cb(messages.IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
        }

        return cb(null, {transactionType : transactionTypes.APPROVE_IDENTITY_USE_REQUEST});
    }
    if (params.answer === constants.identityUseRequestActions.DECLINE) {
        if (params.status !== constants.identityUseRequestStatus.PENDING_APPROVAL) {
            return cb(messages.IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
        }

        return cb(null, {transactionType : transactionTypes.DECLINE_IDENTITY_USE_REQUEST});
    }

    if (params.answer === constants.identityUseRequestActions.END) {
        if (params.status !== constants.identityUseRequestStatus.ACTIVE) {
            return cb(messages.IDENTITY_USE_REQUEST_NOT_ACTIVE);
        }
        return cb(null, {transactionType : transactionTypes.END_IDENTITY_USE_REQUEST});
    }

    if (params.answer === constants.identityUseRequestActions.CANCEL) {
        if (params.status !== constants.identityUseRequestStatus.PENDING_APPROVAL) {
            return cb(messages.IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
        }
        return cb(null, {transactionType : transactionTypes.CANCEL_IDENTITY_USE_REQUEST});
    }


    return cb(null, null);
};

__private.checkIdentityUseAnswerSender = function (params, cb) {

    // only providers can answer with an identityUseRequestProviderAction
    if (params.answer in constants.identityUseRequestProviderActions){
        if (!params.account || params.account.address !== params.provider) {
            return cb(messages.IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_PROVIDER_ERROR)
        }
    }

    // only owners can answer with an identityUseRequestOwnerAction
    if (params.answer in constants.identityUseRequestOwnerActions){
        if (!params.account || params.account.address !== params.owner) {
            return cb(messages.IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR)
        }
    }

    return cb(null, null);
}

shared.approveIdentityUseRequest = function (req, cb) {

    req.body.asset.identityuse[0].answer = constants.identityUseRequestActions.APPROVE;
    __private.identityUseAnswer(req, function (err, res) {
        if (err) {
            return cb(err)
        }

        return cb(null, res);
    });
};

shared.declineIdentityUseRequest = function (req, cb) {

    if (!req.body.asset.identityuse[0].reason) {
        return cb(messages.DECLINE_IDENTITY_USE_REQUEST_NO_REASON)
    }

    if (req.body.asset.identityuse[0].reason.length > 1024) {
        return cb(messages.REASON_TOO_BIG_DECLINE)
    }

    req.body.asset.identityuse[0].answer = constants.identityUseRequestActions.DECLINE;
    __private.identityUseAnswer(req, function (err, res) {
        if (err) {
            return cb(err)
        }

        return cb(null, res);
    });
};

shared.endIdentityUseRequest = function (req, cb) {

    if (!req.body.asset.identityuse[0].reason) {
        return cb(messages.END_IDENTITY_USE_REQUEST_NO_REASON)
    }

    if (req.body.asset.identityuse[0].reason.length > 1024) {
        return cb(messages.REASON_TOO_BIG_END)
    }

    req.body.asset.identityuse[0].answer = constants.identityUseRequestActions.END;
    __private.identityUseAnswer(req, function (err, res) {
        if (err) {
            return cb(err)
        }

        return cb(null, res);
    });
};

shared.cancelIdentityUseRequest = function (req, cb) {

    req.body.asset.identityuse[0].answer = constants.identityUseRequestActions.CANCEL;
    __private.identityUseAnswer(req, function (err, res) {
        if (err) {
            return cb(err)
        }

        return cb(null, res);
    });
};

// Export
module.exports = IdentityUses;
