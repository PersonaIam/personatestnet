'use strict';

let Router = require('../helpers/router.js');
let OrderBy = require('../helpers/orderBy.js');
let schema = require('../schema/attributes.js');
let slots = require('../helpers/slots.js');
let sql = require('../sql/attributes.js');
let attributedHelper = require('../helpers/attributes.js');
let transactionTypes = require('../helpers/transactionTypes.js');
let async = require('async');

// Private fields
let modules, library, self, __private = {}, shared = {};

__private.assetTypes = {};

// Constructor
function Attributes(cb, scope) {
    library = scope;
    self = this;

    let Attribute = require('../logic/attribute.js');
    __private.assetTypes[transactionTypes.CREATE_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.CREATE_ATTRIBUTE, new Attribute()
    );

    let AttributeValidationRequest = require('../logic/attributeValidationRequest.js');
    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_VALIDATION] = library.logic.transaction.attachAssetType(
        transactionTypes.REQUEST_ATTRIBUTE_VALIDATION, new AttributeValidationRequest()
    );

    let AttributeValidation = require('../logic/attributeValidation.js');
    __private.assetTypes[transactionTypes.ATTRIBUTE_VALIDATION] = library.logic.transaction.attachAssetType(
        transactionTypes.ATTRIBUTE_VALIDATION, new AttributeValidation()
    );

    let AttributeShareRequest = require('../logic/attributeShareRequest.js');
    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_SHARE] = library.logic.transaction.attachAssetType(
        transactionTypes.REQUEST_ATTRIBUTE_SHARE, new AttributeShareRequest()
    );

    return cb(null, self);
}

//
//__EVENT__ `onAttachPublicApi`

//
Attributes.prototype.onAttachPublicApi = function () {
    __private.attachApi();
};

// Events
//
//__EVENT__ `onBind`

//
Attributes.prototype.onBind = function (scope) {
    modules = scope;

    __private.assetTypes[transactionTypes.CREATE_ATTRIBUTE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_VALIDATION].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.ATTRIBUTE_VALIDATION].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_SHARE].bind({
        modules: modules, library: library
    });
};

Attributes.prototype.verify = function (req, cb) {
    // dummy verification
    return cb(null, '');
};


// Private methods
__private.attachApi = function () {
    let router = new Router();

    router.use(function (req, res, next) {
        if (modules) {
            return next();
        }
        res.status(500).send({success: false, error: 'Blockchain is loading'});
    });

    router.map(shared, {
        'get /list': 'listAttributes',
        'get /types/list': 'listAttributeTypes',
        'get /types': 'getAttributeType',
        'get /': 'getAttribute',
        'get /validationrequest': 'getRequestAttributeValidation',
        'get /validationrequest/completed': 'getCompletedAttributeValidationRequests',
        'get /validationrequest/incomplete': 'getIncompleteAttributeValidationRequests',
        'get /sharerequest': 'getRequestAttributeShare',
        'get /validation': 'getAttributeValidations',
        'post /': 'addAttribute',
        'post /validationrequest': 'requestAttributeValidation',
        'post /sharerequest': 'requestAttributeShare',
        'post /validation': 'validateAttribute',
    });

    router.use(function (req, res, next) {
        res.status(500).send({success: false, error: 'API endpoint not found'});
    });

    library.network.app.use('/api/attributes', router);
    library.network.app.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }
        library.logger.error(' API error ' + req.url, err);
        res.status(500).send({success: false, error: 'API error: ' + err.message});
    });
};


__private.getAttributesByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.type) {
        where.push('"type" = ${type}');
        params.type = filter.type;
    }

    if (filter.owner) {
        where.push('"owner" = ${owner}');
        params.owner = filter.owner;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributesSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'owner', 'type'].indexOf(sortField) > -1) {
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


    library.db.query(sql.AttributesSql.getAttributesFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributes = [];

        for (let i = 0; i < rows.length; i++) {
            attributes.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributes = attributes;
        }
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('Attributes#list error');
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
                if (['id','attribute_id', 'validator'].indexOf(sortField) > -1) {
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
        return cb('attributeValidationRequests#list error');
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
                if (['id','attribute_id', 'applicant'].indexOf(sortField) > -1) {
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
        return cb('attributeShareRequests#list error');
    });
};

__private.listAttributeTypes = function (filter, cb) {

    library.db.query(sql.AttributeTypesSql.getAttributeTypesList({}), {}).then(function (rows) {
        let count = rows.length ? rows.length : 0;
        let attribute_types = [];

        for (let i = 0; i < rows.length; i++) {
            attribute_types.push(rows[i]);
        }
        let data = {
            attribute_types: attribute_types,
            count: count
        };

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('Attribute types#list error');
    })
};

__private.getAttributeType = function (filter, cb) {

    library.db.query(sql.AttributeTypesSql.getAttributeTypeByName, {name: filter.name}).then(function (rows) {
        let data = {};
        if (rows.length > 0) {
            data = {
                attribute_type: rows[0]
            };
        } else {
            return cb('Attribute type does not exist')
        }

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('Attribute types#list error');
    })
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
        return cb('Attribute validation request# error');
    })
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
        return cb('Attribute share request# error');
    })
};

__private.getCompletedAttributeValidationRequests = function (filter, cb) {

    let param = {validator: '', type : '', owner: ''};
    if (filter.validator) {
        param.validator = filter.validator;
    } else {
        param.type = filter.type;
        param.owner = filter.owner;
    }

    library.db.query(sql.AttributeValidationRequestsSql.getCompletedAttributeValidationRequests,
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
        return cb('Attribute validation request# error');
    })
};

__private.getIncompleteAttributeValidationRequests = function (filter, cb) {

    let param = {validator: '', type : '', owner: ''};
    if (filter.validator) {
        param.validator = filter.validator;
    } else {
        param.type = filter.type;
        param.owner = filter.owner;
    }

    library.db.query(sql.AttributeValidationRequestsSql.getIncompleteAttributeValidationRequests,
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
        return cb('Attribute validation request# error ' + err);
    })
};

__private.getAttributeValidationsForRequests = function (filter, cb) {

    library.db.query(sql.AttributeValidationsSql.getAttributeValidationForRequest,
        {requestIds: filter.requestIds}).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data = rows;
            return cb(null, data);
        }

        return cb(null, null);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('Attribute validation request# error');
    })
};

__private.createAttributeType = function (filter, cb) {
    let params = {};
    params.name = filter.name;
    params.data_type = filter.data_type;
    params.validation = filter.validation;
    params.options = filter.options;

    library.db.query(sql.AttributeTypesSql.insert, params).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data = {
                attribute_type: rows[0]
            };
        }

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('Attribute types#list error');
    })
};

__private.addAttribute = function (filter, cb) {

    let params = {};
    params.type = filter.type;
    params.owner = filter.owner;
    params.timestamp = filter.timestamp;
    params.value = filter.value;
    if (filter.active) {
        params.active = filter.active;
    } else {
        params.active = 0;
    }

    library.db.query(sql.AttributesSql.insert, params).then(function (rows, err) {

        if (err) {
            return cb(err);
        }

        return cb(null, {attribute: rows[0]});
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.updateAttribute = function (filter, cb) {

    let params = {};
    params.type = filter.type;
    params.owner = filter.owner;
    params.value = filter.value;
    if (filter.active) {
        params.active = filter.active;
    } else {
        params.active = 1;
    }

    if (filter.timestamp) {
        params.timestamp = filter.timestamp;
    } else {
        params.timestamp = slots.getTime();
    }

    library.db.query(sql.AttributesSql.update, params).then(function (rows, err) {

        if (err) {
            return cb(err);
        }

        return cb(null, {attribute: rows[0]});
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

/**
 * Add attribute data to IPFS
 *
 * In order to keep IPFS documents alive, only seeded peers will upload to IPFS. Uploading a file on the IPFS network,
 * creates a local copy of the file on the machine that initiates the upload request.
 *
 * Our upload mechanism is defined as:
 * 1. Find a random seed that is able to upload to IPFS
 * 2. Send the file associated with the attribute to this random seed
 *
 * */
__private.addAttributeToIpfs = function (files, cb) {
    modules.peers.getRandomSeed(function (error, res) {
        if (error) return cb('Error occured while getting random seed');

        const {peer} = res;

        modules.transport.requestFromPeer(
            peer,
            {
                url: '/api/ipfs',
                method: 'POST',
                data: { files }
            },
            function(error, response) {
                if (error) return cb(error);

                if (response.body && response.body.success) {
                    const { hash, path } = response.body;

                    return cb(null, { hash, path });
                }
                else {
                    return cb('Failed to upload to IPFS');
                }
            },
        );
    });
};

// Public methods
//
//__API__ `listAttributes`

shared.listAttributes = function (req, cb) {
    library.schema.validate(req.body, schema.listAttributes, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getAttributesByFilter(req.body, function (err, data) {
            if (err) {
                return cb('Failed to list attributes : ' + err);
            }

            return cb(null, {attributes: data.attributes, count: data.count});
        });
    });
};

//
//__API__ `listAttributeTypes`

shared.listAttributeTypes = function (req, cb) {
    library.schema.validate(req.body, schema.listAttributeTypes, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.listAttributeTypes({}, function (err, data) {
            if (err) {
                return cb('Failed to list attribute types : ' + err);
            }

            return cb(null, {attribute_types: data.attribute_types, count: data.count});
        });
    });
};

//
//__API__ `createAttributeType`

shared.createAttributeType = function (req, cb) {
    library.schema.validate(req.body, schema.createAttributeType, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.createAttributeType(req.body, function (err, data) {
            if (err) {
                return cb('Failed to create attribute type : ' + err);
            }
            return cb(null, {attribute_type: data.attribute_type});
        });
    });
};

//
//__API__ `getAttributeType`

shared.getAttributeType = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeType, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getAttributeType(req.body, function (err, data) {
            if (err) {
                return cb('Failed to get attribute type : ' + err);
            }

            return cb(null, {attribute_type: data.attribute_type});
        });
    });
};

//
//__API__ `getAttribute`

shared.getAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.getAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }
        __private.getAttributesByFilter(req.body, function (err, data) {
                if (err) {
                    return cb('Failed to get attribute : ' + err);
                }

                if (data.count === 0) {
                    return cb('No attributes were found');
                }

                let resultData = {attributes: data.attributes};
                if (data.count > 1) {
                    resultData.count = data.count;
                }
                return cb(null, resultData);
            });
        });
};

//
//__API__ `addAttribute`
//

shared.addAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.addAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }
        if (!req.body.asset || !req.body.asset.attribute) {
            return cb('Attribute is not provided. Nothing to create');
        }

        let keypair;

        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb('Invalid passphrase');
            }
        }

        let reqGetAttributeType = req;

        const publicKey = req.body.publicKey;

        reqGetAttributeType.body.name = req.body.asset.attribute[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb('attribute type does not exist');
            }
            const attributeDataType = data.attribute_type.data_type;
            const attributeDataName = data.attribute_type.name;
            const owner = req.body.asset.attribute[0].owner;

            let reqGetAttributesByFilter = req;

            reqGetAttributesByFilter.body.type = attributeDataName;
            reqGetAttributesByFilter.body.owner = owner;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || data.attributes) {
                    return cb('attribute already exists');
                }

                modules.accounts.getAccount({publicKey}, function (err, requester) {
                    if (err) {
                        return cb(err);
                    }

                    if (!requester) {
                        return cb('Requester not found');
                    }

                    if (req.body.multisigAccountPublicKey && req.body.multisigAccountPublicKey !== keypair.publicKey.toString('hex')) {
                        // TODO
                    } else {
                        modules.accounts.setAccountAndGet({publicKey}, function (err, account) {
                            if (err) {
                                return cb(err);
                            }

                            if (!account || !account.publicKey) {
                                return cb('Account not found');
                            }

                            if (account.secondSignature && !req.body.secondSecret) {
                                return cb('Missing second passphrase');
                            }

                            var secondKeypair = null;

                            if (account.secondSignature) {
                                secondKeypair = library.crypto.makeKeypair(req.body.secondSecret);
                            }

                            /**
                             * Check if the desired attribute needs to be uploaded to IPFS; if so, add it to the
                             * IPFS network, and on the IPFS pin queue. Once the newly created transaction is forged,
                             * we'll need to remove the associated element from the IPFS pin queue
                             * */
                            async.auto({
                                isIPFSUploadRequired: function (callback) {
                                    const result = attributedHelper.isIPFSUploadRequired(attributeDataType);

                                    callback(null, result);
                                },
                                uploadToIpfs: ['isIPFSUploadRequired', function (results, callback) {
                                    const isIPFSUploadRequired = results.isIPFSUploadRequired;

                                    if (isIPFSUploadRequired) {
                                        const files = {
                                            path: `${attributeDataName}-${publicKey}`,
                                            content: req.body.asset.attribute[0].value,
                                        };

                                        __private.addAttributeToIpfs(files, function(err, res) {
                                            if (err) return callback(error, null);

                                            const { hash } = res;

                                            // Adjust the transaction asset body to contain the IPFS hash
                                            req.body.asset.attribute[0].value = hash;
                                            req.body.asset.attribute[0].owner = account.address;
                                            req.body.asset.attribute[0].attributeDataType = attributeDataType;

                                            return callback(null, {hash});
                                        });
                                    }
                                    else {
                                        callback(null, 'No Upload Required');
                                    }
                                }],
                            }, function (err) {
                                if (err) {
                                    return cb(err)

                                }

                                let transaction;

                                try {
                                    transaction = library.logic.transaction.create({
                                        type: transactionTypes.CREATE_ATTRIBUTE,
                                        amount: 0,
                                        requester: requester,
                                        sender: account,
                                        asset: req.body.asset,
                                        keypair: keypair,
                                        secondKeypair: secondKeypair,
                                        signature: req.body.signature
                                    });

                                    transaction.id = library.logic.transaction.getId(transaction);
                                } catch (e) {
                                    return cb(e.toString());
                                }

                                library.bus.message("transactionsReceived", [transaction], "api", function (err, transactions) {
                                    if (err) {
                                        return cb(err, transaction);
                                    }
                                    return cb(null, {transactionId: transactions[0].id});
                                });
                            });
                        });
                    }
                });
            });
        });
    });
};

//
//__API__ `requestAttributeValidation`
//

shared.requestAttributeValidation = function (req, cb) {
    library.schema.validate(req.body, schema.requestAttributeValidation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.validation) {
            return cb('Validation is not provided. Nothing to do');
        }

        if (req.body.asset.validation[0].owner === req.body.asset.validation[0].validator ) {
            return cb('Owner cannot be the validator of his own attribute');
        }

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb('Invalid passphrase');
            }
        }

        let reqGetAttributeType = req;
        reqGetAttributeType.body.name = req.body.asset.validation[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb('Attribute type does not exist');
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.validation[0].owner;
            reqGetAttributesByFilter.body.type = data.attribute_type.name;

        __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
            if (err || !data.attributes) {
                return cb('Attribute does not exist. Cannot create validation request');
            }
            req.body.asset.validation[0].attribute_id = data.attributes[0].id;
            req.body.validator = req.body.asset.validation[0].validator;
            req.body.attribute_id = data.attributes[0].id;

            __private.getAttributeValidationRequests(req.body, function (err, attributeValidationRequests) {

                if (err || attributeValidationRequests) {
                    return cb('Validator already has an active Validation Request for the given attribute');
                }

                modules.accounts.getAccount({publicKey: req.body.publicKey}, function (err, requester) {
                    if (err) {
                        return cb(err);
                    }

                    if (!requester) {
                        return cb('Requester not found');
                    }

                    if (req.body.multisigAccountPublicKey && req.body.multisigAccountPublicKey !== keypair.publicKey.toString('hex')) {
                        // TODO
                    } else {
                        modules.accounts.setAccountAndGet({publicKey: req.body.publicKey}, function (err, account) {
                            if (err) {
                                return cb(err);
                            }

                            if (!account || !account.publicKey) {
                                return cb('Account not found');
                            }

                            if (account.secondSignature && !req.body.secondSecret) {
                                return cb('Missing second passphrase');
                            }

                            var secondKeypair = null;

                            if (account.secondSignature) {
                                secondKeypair = library.crypto.makeKeypair(req.body.secondSecret);
                            }

                            var transaction;

                            try {
                                transaction = library.logic.transaction.create({
                                    type: transactionTypes.REQUEST_ATTRIBUTE_VALIDATION,
                                    amount: 0,
                                    requester: requester,
                                    sender: account,
                                    asset : req.body.asset,
                                    keypair: keypair,
                                    secondKeypair: secondKeypair,
                                    signature: req.body.signature
                                });
                                transaction.id = library.logic.transaction.getId(transaction);
                                if (req.body.asset) {
                                    transaction.asset = req.body.asset;
                                }

                            } catch (e) {
                                return cb(e.toString());
                            }

                            library.bus.message("transactionsReceived", [transaction], "api", function (err, transactions) {
                                if (err) {
                                    return cb(err, transaction);
                                }
                                return cb(null, {transactionId: transactions[0].id});
                            });

                        });
                    }
                });

            });
            });
            });
        });
};

//
//__API__ `requestAttributeShare`
//

shared.requestAttributeShare = function (req, cb) {
    library.schema.validate(req.body, schema.requestAttributeShare, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.share) {
            return cb('Share information is not provided. Nothing to do');
        }

        if (req.body.asset.share[0].owner === req.body.asset.share[0].applicant ) {
            return cb('Owner cannot be the applicant of his own attribute');
        }

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb('Invalid passphrase');
            }
        }

        let reqGetAttributeType = req;
        reqGetAttributeType.body.name = req.body.asset.share[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb('Attribute type does not exist');
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.share[0].owner;
            reqGetAttributesByFilter.body.type = data.attribute_type.name;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb('Attribute does not exist. Cannot create share request');
                }
                req.body.asset.share[0].attribute_id = data.attributes[0].id;
                req.body.applicant = req.body.asset.share[0].applicant;
                req.body.attribute_id = data.attributes[0].id;

                __private.getAttributeShareRequests(req.body, function (err, attributeShareRequests) {

                    if (err || attributeShareRequests) {
                        return cb('Applicant already has an active share request for the given attribute');
                    }

                    modules.accounts.getAccount({publicKey: req.body.publicKey}, function (err, requester) {
                        if (err) {
                            return cb(err);
                        }

                        if (!requester) {
                            return cb('Requester not found');
                        }

                        if (req.body.multisigAccountPublicKey && req.body.multisigAccountPublicKey !== keypair.publicKey.toString('hex')) {
                            // TODO
                        } else {
                            modules.accounts.setAccountAndGet({publicKey: req.body.publicKey}, function (err, account) {
                                if (err) {
                                    return cb(err);
                                }

                                if (!account || !account.publicKey) {
                                    return cb('Account not found');
                                }

                                if (account.secondSignature && !req.body.secondSecret) {
                                    return cb('Missing second passphrase');
                                }

                                var secondKeypair = null;

                                if (account.secondSignature) {
                                    secondKeypair = library.crypto.makeKeypair(req.body.secondSecret);
                                }

                                var transaction;

                                try {
                                    transaction = library.logic.transaction.create({
                                        type: transactionTypes.REQUEST_ATTRIBUTE_SHARE,
                                        amount: 0,
                                        requester: requester,
                                        sender: account,
                                        asset : req.body.asset,
                                        keypair: keypair,
                                        secondKeypair: secondKeypair,
                                        signature: req.body.signature
                                    });
                                    transaction.id = library.logic.transaction.getId(transaction);
                                    if (req.body.asset) {
                                        transaction.asset = req.body.asset;
                                    }
                                } catch (e) {
                                    return cb(e.toString());
                                }

                                library.bus.message("transactionsReceived", [transaction], "api", function (err, transactions) {
                                    if (err) {
                                        return cb(err, transaction);
                                    }
                                    return cb(null, {transactionId: transactions[0].id});
                                });

                            });
                        }
                    });

                });
            });
        });
    });
};

//
//__API__ `validateAttribute`
//

shared.validateAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.validateAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.validation) {
            return cb('Validation is not provided. Nothing to do');
        }

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb('Invalid passphrase');
            }
        }

        let reqGetAttributeType = req;
        reqGetAttributeType.body.name = req.body.asset.validation[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb('Attribute type does not exist');
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.validation[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.validation[0].type;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb('Attribute does not exist. Cannot create validation request');
                }
                req.body.attribute_id = data.attributes[0].id;
                req.body.validator = req.body.asset.validation[0].validator;

                __private.getAttributeValidationRequests(req.body, function (err, attributeValidationRequests) {

                    if (err || !attributeValidationRequests) {
                        return cb('Validator does not have any validation request to complete for this attribute');
                    }

                    req.body.asset.attributeValidationRequestId = attributeValidationRequests[0].id;
                    modules.accounts.getAccount({publicKey: req.body.publicKey}, function (err, requester) {
                        if (err) {
                            return cb(err);
                        }

                        if (!requester) {
                            return cb('Requester not found');
                        }

                        if (req.body.multisigAccountPublicKey && req.body.multisigAccountPublicKey !== keypair.publicKey.toString('hex')) {
                            // TODO
                        } else {
                            modules.accounts.setAccountAndGet({publicKey: req.body.publicKey}, function (err, account) {
                                if (err) {
                                    return cb(err);
                                }

                                if (!account || !account.publicKey) {
                                    return cb('Account not found');
                                }

                                if (account.secondSignature && !req.body.secondSecret) {
                                    return cb('Missing second passphrase');
                                }

                                var secondKeypair = null;

                                if (account.secondSignature) {
                                    secondKeypair = library.crypto.makeKeypair(req.body.secondSecret);
                                }

                                var transaction;

                                try {
                                    transaction = library.logic.transaction.create({
                                        type: transactionTypes.ATTRIBUTE_VALIDATION,
                                        amount: 0,
                                        requester: requester,
                                        sender: account,
                                        asset : req.body.asset,
                                        keypair: keypair,
                                        secondKeypair: secondKeypair,
                                        signature: req.body.signature
                                    });
                                    transaction.id = library.logic.transaction.getId(transaction);
                                    if (req.body.asset) {
                                        transaction.asset = req.body.asset;
                                    }

                                } catch (e) {
                                    return cb(e.toString());
                                }

                                library.bus.message("transactionsReceived", [transaction], "api", function (err, transactions) {
                                    if (err) {
                                        return cb(err, transaction);
                                    }
                                    return cb(null, {transactionId: transactions[0].id});
                                });

                            });
                        }
                    });

                });
            });
        });
    });
};

//
//__API__ `getRequestAttributeValidation`
//
shared.getRequestAttributeValidation = function (req, cb) {
    library.schema.validate(req.body, schema.getRequestAttributeValidation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getAttributeValidationRequestsByFilter(req.body, function (err, res) {
            if (err) {
                return cb('Failed to get attribute validation requests : ' + err);
            }

            if (res.count === 0) {
                return cb('No attribute validation requests were found for the given parameters');
            }

            let resultData = {attribute_validation_requests: res.attributeValidationRequests};

            return cb(null, resultData);
        });
    });
};


//
//__API__ `getRequestAttributeValidation`
//
shared.getRequestAttributeShare = function (req, cb) {
    library.schema.validate(req.body, schema.getRequestAttributeShare, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getAttributeShareRequestsByFilter(req.body, function (err, res) {
            if (err) {
                return cb('Failed to get attribute share requests : ' + err);
            }

            if (res.count === 0) {
                return cb('No attribute share requests were found for the given parameters');
            }

            let resultData = {attribute_share_requests: res.attributeShareRequests};

            return cb(null, resultData);
        });
    });
};

//
//__API__ `getCompletedAttributeValidationRequests`
//

shared.getCompletedAttributeValidationRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getCompletedAttributeValidationRequests, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb('Either the validator or the attribute (type and owner information) must be provided : ' + err);
        }

            __private.getCompletedAttributeValidationRequests(req.body, function (err, res) {
                if (err) {
                    return cb('Failed to get attribute validation requests : ' + err);
                }

                if (res.count === 0) {
                    return cb('No attribute validation requests were found for the given parameters');
                }

                let resultData = {attribute_validation_requests: res.attributeValidationRequests};

                return cb(null, resultData);
            });

    });
};

//
//__API__ `getIncompleteAttributeValidationRequests`
//
shared.getIncompleteAttributeValidationRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getIncompleteAttributeValidationRequests, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb('Either the validator or the attribute (type and owner information) must be provided : ' + err);
        }

        __private.getIncompleteAttributeValidationRequests(req.body, function (err, res) {
            if (err) {
                return cb('Failed to get attribute validation requests : ' + err);
            }

            if (res.count === 0) {
                return cb('No attribute validation requests were found for the given parameters');
            }

            let resultData = {attribute_validation_requests: res.attributeValidationRequests};

            return cb(null, resultData);
        });
    });
};

//
//__API__ `getAttributeValidationsForRequest`
//

shared.getAttributeValidations = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeValidations, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getAttributesByFilter(req.body, function (err, res1) {

            if (res1 && res1.attributes && req.body.type && req.body.owner) {
                req.body.attribute_id = res1.attributes[0].id;
            }

            if (!req.body.attribute_id && !req.body.validator) {
                return cb('No attribute validations or requests exist for the given parameters - validator was not provided or attribute does not exist');
            }

            __private.getAttributeValidationRequestsByFilter(req.body, function (err, res) {

                if (!res.attributeValidationRequests || res.attributeValidationRequests.length === 0) {
                    return cb('No attribute validations or requests exist for the given parameters');
                }

                let ids = [];
                res.attributeValidationRequests.forEach(i => ids.push(i.id));
                req.body.requestIds = ids;

                __private.getAttributeValidationsForRequests(req.body, function (err, res) {
                    if (!res) {
                        return cb('No attribute validations were found for the given parameters');
                    }

                    let resultData = {attribute_validations: res};

                    return cb(null, resultData);
                });
            });
        });
    });
};

//
//__API__ `updateAttribute`
//
shared.updateAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.updateAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getAttributesByFilter(req.body, function (err, data) {
            if (err || !data.attributes) {
                return cb('attribute doesn\'t exist. nothing to update');
            }

            __private.updateAttribute(req.body, function (err, data) {
                if (err) {
                    return cb('Failed to update attribute : ' + err);
                }
                //data = req.body;
                return cb(null, data);
            });
        });
    });
};

// Export
module.exports = Attributes;
