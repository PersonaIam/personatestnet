'use strict';

let Router = require('../helpers/router.js');
let OrderBy = require('../helpers/orderBy.js');
let schema = require('../schema/attributes.js');
let slots = require('../helpers/slots.js');
let moment = require('moment');
let sql = require('../sql/attributes.js');
let transactionTypes = require('../helpers/transactionTypes.js');
let messages = require('../helpers/messages.js');
let constants = require('../helpers/constants.js');
let _ = require('lodash');
let attributes = require('../modules/attributes.js');

// Private fields
let modules, library, self, __private = {}, shared = {};

__private.assetTypes = {};

// Constructor
function AttributeValidations(cb, scope) {
    library = scope;
    self = this;

    let AttributeValidationRequest = require('../logic/attributeValidationRequest.js');
    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_VALIDATION] = library.logic.transaction.attachAssetType(
        transactionTypes.REQUEST_ATTRIBUTE_VALIDATION, new AttributeValidationRequest()
    );

    let AttributeValidation = require('../logic/attributeValidation.js');
    __private.assetTypes[transactionTypes.VALIDATE_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.VALIDATE_ATTRIBUTE, new AttributeValidation()
    );

    return cb(null, self);
}

//
//__EVENT__ `onAttachPublicApi`

//
AttributeValidations.prototype.onAttachPublicApi = function () {
    __private.attachApi();
};

// Events
//
//__EVENT__ `onBind`

//
AttributeValidations.prototype.onBind = function (scope) {
    modules = scope;

    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_VALIDATION].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.VALIDATE_ATTRIBUTE].bind({
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
        'post /validationrequest': 'requestAttributeValidation',
        'get /validationrequest': 'getAttributeValidationRequests',
        'get /validationrequest/completed': 'getCompletedAttributeValidationRequests',
        'get /validationrequest/incomplete': 'getIncompleteAttributeValidationRequests',
        'post /validation': 'validateAttribute',
        'get /validation': 'getAttributeValidations',
        'get /validationscore': 'getAttributeValidationScore',
    });

    router.use(function (req, res, next) {
        res.status(500).send({success: false, error: messages.API_ENDPOINT_NOT_FOUND});
    });

    library.network.app.use('/api/attribute-validations', router);
    library.network.app.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }
        library.logger.error(' API error ' + req.url, err);
        res.status(500).send({success: false, error: 'API error: ' + err.message});
    });
};

__private.getAttributeValidationRequestsByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.validator) {
        where.push('"validator" = ${validator}');
        params.validator = filter.validator;
    }

    if (filter.attribute_id) {
        where.push('"attribute_id" = ${attribute_id}');
        params.attribute_id = filter.attribute_id;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributeValidationRequestsSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'attribute_id', 'validator'].indexOf(sortField) > -1) {
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


    library.db.query(sql.AttributeValidationRequestsSql.getAttributeValidationRequestsFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributeValidationRequests = [];

        for (let i = 0; i < rows.length; i++) {
            attributeValidationRequests.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeValidationRequests = attributeValidationRequests;
        }
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    });
};

__private.getAttributeValidationRequests = function (filter, cb) {

    library.db.query(sql.AttributeValidationRequestsSql.getAttributeValidationsRequestsForAttributeAndValidator,
        {attribute_id: filter.attribute_id, validator: filter.validator}).then(function (rows) {

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

__private.getAttributeValidationScore = function (filter, cb) {

    library.db.query(sql.AttributeValidationsSql.getAttributeValidationsForAttribute,
        {attribute_id: filter.attribute_id}).then(function (rows) {

        let attributeValidationScore = {};
        let score = 0;
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                score += rows[i].chunk;
            }

        }
        attributeValidationScore.score = score;
        return cb(null, attributeValidationScore);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getAttributeValidationRequestsByQuery = function (filter, cb) {

    let param = {validator: '', type: '', owner: ''};
    if (filter.validator) {
        param.validator = filter.validator;
    } else {
        param.type = filter.type;
        param.owner = filter.owner;
    }

    library.db.query(filter.query,
        param).then(function (rows) {
        let attributeValidationRequests = [];
        for (let i = 0; i < rows.length; i++) {
            attributeValidationRequests.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeValidationRequests = attributeValidationRequests;
        }
        data.count = count;
        return cb(null, data);

    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getAttributeValidationsForRequests = function (filter, cb) {

    library.db.query(sql.AttributeValidationsSql.getAttributeValidationForRequest,
        {requestIds: filter.requestIds}).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data.count = rows.length;
            data.attribute_validations = rows;
            return cb(null, data);
        }

        return cb(null, null);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

shared.requestAttributeValidation = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.validation) {
            return cb('Validation is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.validation[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.validation[0].validator)) {
            return cb('Validator address is incorrect');
        }

        if (req.body.asset.validation[0].owner === req.body.asset.validation[0].validator) {
            return cb(messages.OWNER_IS_VALIDATOR_ERROR);
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
        reqGetAttributeType.body.name = req.body.asset.validation[0].type;
        attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.validation[0].owner;
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

                req.body.asset.validation[0].attribute_id = data.attributes[0].id;
                req.body.validator = req.body.asset.validation[0].validator;
                req.body.attribute_id = data.attributes[0].id;

                __private.getAttributeValidationRequests(req.body, function (err, attributeValidationRequests) {

                    if (err) {
                        return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
                    }

                    if (attributeValidationRequests) {
                        return cb(messages.VALIDATOR_ALREADY_HAS_VALIDATION_REQUEST);
                    }
                    attributes.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.REQUEST_ATTRIBUTE_VALIDATION
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

shared.validateAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.validation) {
            return cb('Validation is not provided.');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.validation[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.validation[0].validator)) {
            return cb('Validator address is incorrect');
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
        reqGetAttributeType.body.name = req.body.asset.validation[0].type;
        attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.validation[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.validation[0].type;

            attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb('Cannot create validation request : ' + messages.ATTRIBUTE_NOT_FOUND);
                }
                req.body.attribute_id = data.attributes[0].id;
                req.body.validator = req.body.asset.validation[0].validator;

                if (data.attributes[0].expire_timestamp && data.attributes[0].expire_timestamp < slots.getTime()) {
                    return cb(messages.EXPIRED_ATTRIBUTE);
                }

                __private.getAttributeValidationRequests(req.body, function (err, attributeValidationRequests) {

                    if (err || !attributeValidationRequests) {
                        return cb(messages.VALIDATOR_HAS_NO_VALIDATION_REQUEST);
                    }
                    req.body.asset.attributeValidationRequestId = attributeValidationRequests[0].id;

                    let ids = [];
                    attributeValidationRequests.forEach(i => ids.push(i.id));
                    req.body.requestIds = ids;

                    __private.getAttributeValidationsForRequests(req.body, function (err, attributeValidations) {

                        if (err || attributeValidations) {
                            return cb(messages.ATTRIBUTE_VALIDATION_ALREADY_MADE);
                        }
                        req.body.asset.validation[0].expire_timestamp = slots.getTime(moment(slots.getRealTime(req.body.asset.validation[0].timestamp)).add(1,'year'));

                        attributes.buildTransaction({
                                req: req,
                                keypair: keypair,
                                transactionType: transactionTypes.VALIDATE_ATTRIBUTE
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
};

shared.getCompletedAttributeValidationRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getCompletedAttributeValidationRequests, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
        }

        req.body.query = sql.AttributeValidationRequestsSql.getCompletedAttributeValidationRequests;

        __private.getAttributeValidationRequestsByQuery(req.body, function (err, res) {
            if (err) {
                return cb(messages.ATTRIBUTE_VALIDATION_REQUESTS_FAIL);
            }

            if (res.count === 0) {
                return cb(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
            }

            let resultData = {attribute_validation_requests: res.attributeValidationRequests, count: res.count};

            return cb(null, resultData);
        });

    });
};

shared.getIncompleteAttributeValidationRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getIncompleteAttributeValidationRequests, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
        }

        req.body.query = sql.AttributeValidationRequestsSql.getIncompleteAttributeValidationRequests;

        __private.getAttributeValidationRequestsByQuery(req.body, function (err, res) {
            if (err) {
                return cb(messages.ATTRIBUTE_VALIDATION_REQUESTS_FAIL);
            }

            if (res.count === 0) {
                return cb(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
            }

            let resultData = {attribute_validation_requests: res.attributeValidationRequests, count: res.count};

            return cb(null, resultData);
        });
    });
};

shared.getAttributeValidationRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeValidationRequests, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
        }

        req.body.query = sql.AttributeValidationRequestsSql.getAttributeValidationRequests;

        __private.getAttributeValidationRequestsByQuery(req.body, function (err, res) {
            if (err) {
                return cb(messages.ATTRIBUTE_VALIDATION_REQUESTS_FAIL);
            }

            if (res.count === 0) {
                return cb(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
            }

            let resultData = {attribute_validation_requests: res.attributeValidationRequests, count: res.count};

            return cb(null, resultData);
        });
    });
};

shared.getAttributeValidations = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeValidations, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
        }

        attributes.getAttributesByFilter(req.body, function (err, res1) {

            if (req.body.type && req.body.owner && res1 && (!res1.attributes || res1.attributes.length === 0)) {
                return cb(messages.ATTRIBUTE_NOT_FOUND)
            }

            if (res1 && res1.attributes && req.body.type && req.body.owner) {
                req.body.attribute_id = res1.attributes[0].id;
            }

            __private.getAttributeValidationRequestsByFilter(req.body, function (err, res) {

                if (!res.attributeValidationRequests || res.attributeValidationRequests.length === 0) {
                    return cb(messages.NO_ATTRIBUTE_VALIDATIONS_OR_REQUESTS);
                }

                let ids = [];
                res.attributeValidationRequests.forEach(i => ids.push(i.id));
                req.body.requestIds = ids;

                __private.getAttributeValidationsForRequests(req.body, function (err, res) {
                    if (!res) {
                        return cb(messages.NO_ATTRIBUTE_VALIDATIONS);
                    }

                    let resultData = {attribute_validations: res.attribute_validations, count: res.count};

                    return cb(null, resultData);
                });
            });
        });
    });
};

shared.getAttributeValidationScore = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeValidationScore, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        attributes.getAttributesByFilter(req.body, function (err, result) {

            if (!result || result.attributes.length === 0) {
                return cb(messages.ATTRIBUTE_NOT_FOUND);
            }

            req.body.attribute_id = result.attributes[0].id;

            __private.getAttributeValidationScore(req.body, function (err, res) {
                if (!res) {
                    return cb(messages.NO_ATTRIBUTE_VALIDATIONS)
                }

                return cb(null, {attribute_validation_score: res.score});
            });
        });
    });
};


AttributeValidations.prototype.getAttributeValidationScore = function (filter, cb) {
    return __private.getAttributeValidationScore(filter, cb);
};

// Export
module.exports = AttributeValidations;
