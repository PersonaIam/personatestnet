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
    __private.assetTypes[transactionTypes.APPROVE_IDENTITY_USE] = library.logic.transaction.attachAssetType(
        transactionTypes.APPROVE_IDENTITY_USE, new IdentityUseApprove()
    );

    let IdentityUseDecline = require('../../logic/identityUseDecline.js');
    __private.assetTypes[transactionTypes.DECLINE_IDENTITY_USE] = library.logic.transaction.attachAssetType(
        transactionTypes.DECLINE_IDENTITY_USE, new IdentityUseDecline()
    );

    let IdentityUseCancel = require('../../logic/identityUseCancel.js');
    __private.assetTypes[transactionTypes.CANCEL_IDENTITY_USE] = library.logic.transaction.attachAssetType(
        transactionTypes.CANCEL_IDENTITY_USE, new IdentityUseCancel()
    );

    let IdentityUseEnd = require('../../logic/identityUseEnd.js');
    __private.assetTypes[transactionTypes.END_IDENTITY_USE] = library.logic.transaction.attachAssetType(
        transactionTypes.END_IDENTITY_USE, new IdentityUseEnd()
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

    __private.assetTypes[transactionTypes.END_IDENTITY_USE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.APPROVE_IDENTITY_USE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.DECLINE_IDENTITY_USE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.CANCEL_IDENTITY_USE].bind({
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

        'post /approve': 'approveIdentityUse',
        'post /decline': 'declineIdentityUse',
        'post /end': 'endIdentityUse',
        'post /cancel': 'cancelIdentityUse',

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
    if (filter.serviceId) {
        query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceId;
        params = {service_id: filter.serviceId}
    } else {
        if (filter.serviceName && filter.serviceProvider) {
            query = sql.IdentityUseRequestsSql.getIdentityUseRequestsByServiceNameAndProvider;
            params = {service_name: filter.serviceName, service_provider: filter.serviceProvider}
        }
    }

    library.db.query(query, params).then(function (identityUseRequests) {

        console.log(JSON.stringify(identityUseRequests))

        if (identityUseRequests.length > 0) {
            if (filter.status) {
                identityUseRequests = identityUseRequests.filter(identityUseRequest => identityUseRequest.status === filter.status)
            }
            return cb(null, {identityUseRequests : identityUseRequests, count : identityUseRequests.length});
        }

        return cb(null, {identityUseRequests : [], count : 0});
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


// Export
module.exports = IdentityUses;
