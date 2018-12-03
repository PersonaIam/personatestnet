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
    if (!filter.serviceId && !(filter.serviceName && filter.serviceProvider) && !filter.attributeId && !(filter.owner && filter.type)) {
        return cb(messages.INCORRECT_IDENTITY_USE_PARAMETERS);
    }
    let query, params;

    if (filter.serviceId && filter.attributeId) {
        query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceAndAttribute;
        params = {service_id: filter.serviceId, attribute_id : filter.attributeId}
    } else {
        if (filter.serviceId) {
            query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceId;
            params = {service_id: filter.serviceId}
        } else {
            if (filter.serviceName && filter.serviceProvider) {
                query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceNameAndProvider;
                params = {service_name: filter.serviceName, service_provider: filter.serviceProvider}
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
        if (!library.logic.transaction.validateAddress(req.body.asset.identityuse[0].owner)) {
            return cb('Owner address is incorrect');
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

        let reqGetAttributeType = req;
        reqGetAttributeType.body.name = req.body.asset.identityuse[0].type;
        attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.identityuse[0].owner;
            reqGetAttributesByFilter.body.type = data.attribute_type.name;

            attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, dataAttributes) {
                if (err) {
                    return cb(err);
                }
                if (!dataAttributes.attributes || dataAttributes.attributes.length === 0) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }

                if (dataAttributes.attributes[0].expire_timestamp && dataAttributes.attributes[0].expire_timestamp < slots.getTime()) {
                    return cb(messages.EXPIRED_ATTRIBUTE);
                }

                if (!dataAttributes.attributes[0].active) {
                    return cb(messages.INACTIVE_ATTRIBUTE);
                }

                services.getServicesByFilter(
                    {   name : req.body.asset.identityuse[0].serviceName,
                        provider :req.body.asset.identityuse[0].serviceProvider } , function (err, dataServices) {

                    req.body.serviceId = dataServices.services[0].id;
                    req.body.attributeId = dataAttributes.attributes[0].id;

                    __private.getIdentityUseRequestsByFilter(req.body, function (err, identityUseRequests) {
                        if (err) {
                            return cb(err);
                        }

                        if (identityUseRequests && identityUseRequests.length === 0) {
                            return cb(messages.IDENTITY_USE_ALREADY_EXISTS);
                        }

                        req.body.asset.identityuse[0].serviceId = dataServices.services[0].id;
                        req.body.asset.identityuse[0].attributeId = dataAttributes.attributes[0].id;

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
                })
            });
        });
    });
};

shared.approveShareRequest = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.identityuse) {
            return cb('identityuse is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.identityuse[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.identityuse[0].applicant)) {
            return cb('Applicant address is incorrect');
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

        let reqGetAttributeType = req;
        reqGetAttributeType.body.name = req.body.asset.identityuse[0].type;
        attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.identityuse[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.identityuse[0].type;

            attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb('Cannot approve identityuse attribute request : ' + messages.ATTRIBUTE_NOT_FOUND);
                }

                if (data.attributes[0].expire_timestamp && data.attributes[0].expire_timestamp < slots.getTime()) {
                    return cb(messages.EXPIRED_ATTRIBUTE);
                }
                if (!data.attributes[0].active) {
                    return cb(messages.INACTIVE_ATTRIBUTE);
                }

                req.body.attribute_id = data.attributes[0].id;
                req.body.service_id = req.body.asset.identityuse[0].service_id;

                __private.getIdentityUseRequestsByFilter(req.body, function (err, attributeShareRequests) {

                    if (err || !attributeShareRequests) {
                        return cb(messages.ATTRIBUTE_APPROVAL_SHARE_WITH_NO_SHARE_REQUEST);
                    }

                    // if (req.body.asset.identityuse[0].action && attributeShareRequests[0].status === constants.shareStatus.APPROVED) {
                    //     return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_APPROVED);
                    // }
                    //
                    // if (req.body.asset.identityuse[0].action && attributeShareRequests[0].status === constants.shareStatus.COMPLETED) {
                    //     return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_COMPLETED);
                    // }
                    //
                    // if (!req.body.asset.identityuse[0].action && attributeShareRequests[0].status === constants.shareStatus.UNAPPROVED) {
                    //     return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_UNAPPROVED);
                    // }

                    req.body.asset.attributeShareRequestId = attributeShareRequests[0].id;

                    attributes.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.APPROVE_IDENTITY_USE
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

            let resultData = {identity_use_requests: res.identityUseRequests, count: res.count};

            return cb(null, resultData);
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
            return cb('Owner address is incorrect');
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

        let reqGetAttributeType = req;
        reqGetAttributeType.body.name = req.body.asset.identityuse[0].type;
        attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.identityuse[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.identityuse[0].type;

            attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }

                if (data.attributes[0].expire_timestamp && data.attributes[0].expire_timestamp < slots.getTime()) {
                    return cb(messages.EXPIRED_ATTRIBUTE);
                }

                req.body.attributeId = data.attributes[0].id;
                let reqGetServicesByFilter = req;

                reqGetServicesByFilter.body.name = req.body.asset.identityuse[0].serviceName;
                reqGetServicesByFilter.body.provider = req.body.asset.identityuse[0].serviceProvider;

                services.getServicesByFilter(reqGetServicesByFilter.body, function (err, data) {
                    if (!data.services || data.services.length === 0) {
                        return cb(messages.SERVICE_NOT_FOUND);
                    }

                    req.body.serviceId = data.services[0].id;
                    console.log('zzz + ' + JSON.stringify(req.body))
                    __private.getIdentityUseRequestsByFilter(req.body, function (err, data) {
                        console.log(' --- ' + JSON.stringify(data))
                        if (err || !data.identityUseRequests) {
                            return cb(messages.IDENTITY_USE_REQUEST_MISSING_FOR_ACTION);
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
        });
    });
};

__private.checkIdentityUseAnswer = function(params, cb) {

    if (params.answer === constants.identityUseRequestActions.APPROVE) {
        if (params.status !== constants.identityUseRequestStatus.PENDING_APPROVAL) {
            return cb(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
        }

        return cb(null, {transactionType : transactionTypes.APPROVE_IDENTITY_USE_REQUEST});
    }
    if (params.answer === constants.identityUseRequestActions.DECLINE) {
        if (params.status !== constants.identityUseRequestStatus.PENDING_APPROVAL) {
            return cb(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
        }

        return cb(null, {transactionType : transactionTypes.DECLINE_IDENTITY_USE_REQUEST});
    }

    if (params.answer === constants.identityUseRequestActions.END) {
        if (params.status !== constants.identityUseRequestStatus.IN_PROGRESS) {
            return cb(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_IN_PROGRESS);
        }
        return cb(null, {transactionType : transactionTypes.END_IDENTITY_USE_REQUEST});
    }

    if (params.answer === constants.identityUseRequestStatus.CANCEL) {
        if (params.status !== constants.identityUseRequestStatus.PENDING_APPROVAL) {
            return cb(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
        }
        return cb(null, {transactionType : transactionTypes.CANCEL_IDENTITY_USE_REQUEST});
    }


    return cb(null, null);
};

__private.checkIdentityUseAnswerSender = function (params, cb) {

    console.log(JSON.stringify(params))

    // only providers can answer with an identityUseRequestProviderAction
    if (params.answer in constants.identityUseRequestProviderActions){
        if (!params.account || params.account.address !== params.provider) {
            return cb(messages.IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_PROVIDER_ERROR)
        }
    }

    // only owners can answer with an identityUseRequestOwnerAction
    if (params.answer in constants.identityUseRequestProviderActions){
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
