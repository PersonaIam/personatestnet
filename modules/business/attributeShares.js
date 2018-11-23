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

// Private fields
let modules, library, self, __private = {}, shared = {};

__private.assetTypes = {};

// Constructor
function AttributeShares(cb, scope) {
    library = scope;
    self = this;

    let AttributeShareRequest = require('../../logic/attributeShareRequest.js');
    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_SHARE] = library.logic.transaction.attachAssetType(
        transactionTypes.REQUEST_ATTRIBUTE_SHARE, new AttributeShareRequest()
    );

    let AttributeShare = require('../../logic/attributeShare.js');
    __private.assetTypes[transactionTypes.SHARE_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.SHARE_ATTRIBUTE, new AttributeShare()
    );

    let AttributeShareApprove = require('../../logic/attributeShareApprove.js');
    __private.assetTypes[transactionTypes.APPROVE_ATTRIBUTE_SHARE] = library.logic.transaction.attachAssetType(
        transactionTypes.APPROVE_ATTRIBUTE_SHARE, new AttributeShareApprove()
    );

    return cb(null, self);
}

//
//__EVENT__ `onAttachPublicApi`

//
AttributeShares.prototype.onAttachPublicApi = function () {
    __private.attachApi();
};

// Events
//
//__EVENT__ `onBind`

//
AttributeShares.prototype.onBind = function (scope) {
    modules = scope;

    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_SHARE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.SHARE_ATTRIBUTE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.APPROVE_ATTRIBUTE_SHARE].bind({
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

        'post /sharerequest': 'requestAttributeShare',
        'get /sharerequest': 'getRequestAttributeShare',

        'post /approvesharerequest': 'approveShareRequest',

        'get /share': 'getAttributeShare',
        'post /share': 'shareAttribute',

    });

    router.use(function (req, res, next) {
        res.status(500).send({success: false, error: messages.API_ENDPOINT_NOT_FOUND});
    });

    library.network.app.use('/api/attribute-shares', router);
    library.network.app.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }
        library.logger.error(' API error ' + req.url, err);
        res.status(500).send({success: false, error: 'API error: ' + err.message});
    });
};

__private.getAttributeShareRequestsByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.applicant) {
        where.push('"applicant" = ${applicant}');
        params.applicant = filter.applicant;
    }

    if (filter.attribute_id) {
        where.push('"attribute_id" = ${attribute_id}');
        params.attribute_id = filter.attribute_id;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributeShareRequestsSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'attribute_id', 'applicant'].indexOf(sortField) > -1) {
                    return sortField;
                } else {
                    return sortField;
                }
            }
        }
    );

    if (orderBy.error) {
        return cb(orderBy.error);
    }

    library.db.query(sql.AttributeShareRequestsSql.getAttributeShareRequestsFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributeShareRequests = [];

        for (let i = 0; i < rows.length; i++) {
            attributeShareRequests.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeShareRequests = attributeShareRequests;
        }
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    });
};

__private.getAttributeSharesByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.applicant) {
        where.push('"applicant" = ${applicant}');
        params.applicant = filter.applicant;
    }

    if (filter.attribute_id) {
        where.push('"attribute_id" = ${attribute_id}');
        params.attribute_id = filter.attribute_id;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributeSharesSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'attribute_id', 'applicant'].indexOf(sortField) > -1) {
                    return sortField;
                } else {
                    return sortField;
                }
            }
        }
    );

    if (orderBy.error) {
        return cb(orderBy.error);
    }

    library.db.query(sql.AttributeSharesSql.getAttributeSharesFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributeShares = [];

        for (let i = 0; i < rows.length; i++) {
            attributeShares.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeShares = attributeShares;
        }
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    });
};

__private.getAttributeShareRequests = function (filter, cb) {

    library.db.query(sql.AttributeShareRequestsSql.getAttributeShareRequestsForAttributeAndApplicant,
        {attribute_id: filter.attribute_id, applicant: filter.applicant}).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data = rows;
            return cb(null, data);
        }

        return cb(null, null);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

shared.requestAttributeShare = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.share) {
            return cb('Share information is not provided');
        }
        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].applicant)) {
            return cb('Applicant address is incorrect');
        }


        if (req.body.asset.share[0].owner === req.body.asset.share[0].applicant) {
            return cb(messages.OWNER_IS_APPLICANT_ERROR);
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
        reqGetAttributeType.body.name = req.body.asset.share[0].type;
        attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.share[0].owner;
            reqGetAttributesByFilter.body.type = data.attribute_type.name;

            attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err) {
                    return cb(err);
                }
                if (!data.attributes || data.attributes.length === 0) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }

                if (data.attributes[0].expire_timestamp && data.attributes[0].expire_timestamp < slots.getTime()) {
                    return cb(messages.EXPIRED_ATTRIBUTE);
                }

                if (!data.attributes[0].active) {
                    return cb(messages.INACTIVE_ATTRIBUTE);
                }

                req.body.asset.share[0].attribute_id = data.attributes[0].id;
                req.body.applicant = req.body.asset.share[0].applicant;
                req.body.attribute_id = data.attributes[0].id;

                __private.getAttributeShareRequests(req.body, function (err, attributeShareRequests) {

                    if (err || attributeShareRequests) {
                        return cb(messages.ATTRIBUTE_SHARE_REQUEST_ALREADY_EXISTS);
                    }

                    attributes.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.REQUEST_ATTRIBUTE_SHARE
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

shared.approveShareRequest = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.share) {
            return cb('Share is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].applicant)) {
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
        reqGetAttributeType.body.name = req.body.asset.share[0].type;
        attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.share[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.share[0].type;

            attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb('Cannot approve share attribute request : ' + messages.ATTRIBUTE_NOT_FOUND);
                }

                if (data.attributes[0].expire_timestamp && data.attributes[0].expire_timestamp < slots.getTime()) {
                    return cb(messages.EXPIRED_ATTRIBUTE);
                }
                if (!data.attributes[0].active) {
                    return cb(messages.INACTIVE_ATTRIBUTE);
                }

                req.body.attribute_id = data.attributes[0].id;
                req.body.applicant = req.body.asset.share[0].applicant;

                __private.getAttributeShareRequests(req.body, function (err, attributeShareRequests) {

                    if (err || !attributeShareRequests) {
                        return cb(messages.ATTRIBUTE_APPROVAL_SHARE_WITH_NO_SHARE_REQUEST);
                    }

                    // if (req.body.asset.share[0].action && attributeShareRequests[0].status === constants.shareStatus.APPROVED) {
                    //     return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_APPROVED);
                    // }
                    //
                    // if (req.body.asset.share[0].action && attributeShareRequests[0].status === constants.shareStatus.COMPLETED) {
                    //     return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_COMPLETED);
                    // }
                    //
                    // if (!req.body.asset.share[0].action && attributeShareRequests[0].status === constants.shareStatus.UNAPPROVED) {
                    //     return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_UNAPPROVED);
                    // }

                    req.body.asset.attributeShareRequestId = attributeShareRequests[0].id;

                    attributes.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.APPROVE_ATTRIBUTE_SHARE
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

shared.shareAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.share) {
            return cb('Share is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].applicant)) {
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
        reqGetAttributeType.body.name = req.body.asset.share[0].type;
        attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.share[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.share[0].type;

            attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }

                if (data.attributes[0].expire_timestamp && data.attributes[0].expire_timestamp < slots.getTime()) {
                    return cb(messages.EXPIRED_ATTRIBUTE);
                }
                if (!data.attributes[0].active) {
                    return cb(messages.INACTIVE_ATTRIBUTE);
                }

                req.body.attribute_id = data.attributes[0].id;
                req.body.applicant = req.body.asset.share[0].applicant;
                req.body.asset.attribute_id = data.attributes[0].id;

                __private.getAttributeShareRequests(req.body, function (err, attributeShareRequests) {

                    if (err || !attributeShareRequests) {
                        return cb(messages.ATTRIBUTE_SHARE_WITH_NO_SHARE_REQUEST);
                    }

                    if (attributeShareRequests[0].status === 0) {
                        return cb(messages.ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST);
                    }

                    if (attributeShareRequests[0].status === 2) {
                        return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_COMPLETED);
                    }

                    req.body.asset.attributeShareRequestId = attributeShareRequests[0].id;

                    attributes.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.SHARE_ATTRIBUTE
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

shared.getRequestAttributeShare = function (req, cb) {
    library.schema.validate(req.body, schema.getRequestAttributeShare, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.applicant || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_SHARE_PARAMETERS);
        }

        attributes.getAttributesByFilter(req.body, function (err, res1) {

            if (res1 && res1.attributes && req.body.type && req.body.owner) {
                req.body.attribute_id = res1.attributes[0].id;
            }

            if (res1 && !res1.attributes && req.body.type && req.body.owner) {
                return cb(messages.ATTRIBUTE_NOT_FOUND)
            }

            __private.getAttributeShareRequestsByFilter(req.body, function (err, res) {

                if (err || res.count === 0) {
                    return cb(messages.ATTRIBUTE_SHARE_REQUESTS_NOT_FOUND);
                }

                let resultData = {attribute_share_requests: res.attributeShareRequests, count: res.count};

                return cb(null, resultData);
            });
        });
    });
};

shared.getAttributeShare = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeShare, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.applicant || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_SHARE_PARAMETERS);
        }

        attributes.getAttributesByFilter(req.body, function (err, res1) {

            if (res1 && res1.attributes && req.body.type && req.body.owner) {
                req.body.attribute_id = res1.attributes[0].id;
            }

            if (res1 && !res1.attributes && req.body.type && req.body.owner) {
                return cb(messages.ATTRIBUTE_NOT_FOUND)
            }

            __private.getAttributeSharesByFilter(req.body, function (err, res) {
                if (err || res.count === 0) {
                    return cb(messages.ATTRIBUTE_SHARES_NOT_FOUND);
                }

                let resultData = {attribute_shares: res.attributeShares, count: res.count};

                return cb(null, resultData);
            });
        });
    });
};


// Export
module.exports = AttributeShares;
