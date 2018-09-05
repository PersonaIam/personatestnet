'use strict';

let Router = require('../helpers/router.js');
let OrderBy = require('../helpers/orderBy.js');
let schema = require('../schema/attributes.js');
let slots = require('../helpers/slots.js');
let sql = require('../sql/attributes.js');
let transactionTypes = require('../helpers/transactionTypes.js');

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
};

Attributes.prototype.verify = function (req, cb) {
    // dummy verification
    return cb(null,'');
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
        'post /': 'addAttribute',
        'post /requestvalidation': 'requestAttributeValidation',
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


// add attribute

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


// update attribute

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
        reqGetAttributeType.body.name = req.body.asset.attribute[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb('attribute type does not exist');
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.type = data.attribute_type.name;
            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || data.attributes) {
                    return cb('attribute already exists');
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
                                    type: transactionTypes.CREATE_ATTRIBUTE,
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
            reqGetAttributesByFilter.body.type = data.attribute_type.name;
        __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
            if (err || !data.attributes) {
                return cb('Attribute does not exist. Cannot create validation request');
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
