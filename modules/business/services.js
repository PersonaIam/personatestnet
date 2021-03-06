'use strict';

let Router = require('../../helpers/router.js');
let OrderBy = require('../../helpers/orderBy.js');
let schema = require('../../schema/business/services.js');
let slots = require('../../helpers/slots.js');
let moment = require('moment');
let sql = require('../../sql/business/services.js');
let transactionTypes = require('../../helpers/transactionTypes.js');
let messages = require('../../helpers/messages.js');
let constants = require('../../helpers/constants.js');
let _ = require('lodash');
let attributes = require('./attributes.js');

// Private fields
let modules, library, self, __private = {}, shared = {};

__private.assetTypes = {};

// Constructor
function Services(cb, scope) {
    library = scope;
    self = this;

    let Service = require('../../logic/service.js');
    __private.assetTypes[transactionTypes.CREATE_SERVICE] = library.logic.transaction.attachAssetType(
        transactionTypes.CREATE_SERVICE, new Service()
    );

    let ServiceInactivate = require('../../logic/serviceInactivate.js');
    __private.assetTypes[transactionTypes.INACTIVATE_SERVICE] = library.logic.transaction.attachAssetType(
        transactionTypes.INACTIVATE_SERVICE, new ServiceInactivate()
    );

    let ServiceActivate = require('../../logic/serviceActivate.js');
    __private.assetTypes[transactionTypes.ACTIVATE_SERVICE] = library.logic.transaction.attachAssetType(
        transactionTypes.ACTIVATE_SERVICE, new ServiceActivate()
    );

    return cb(null, self);
}

//
//__EVENT__ `onAttachPublicApi`

//
Services.prototype.onAttachPublicApi = function () {
    __private.attachApi();
};

// Events
//
//__EVENT__ `onBind`

//
Services.prototype.onBind = function (scope) {
    modules = scope;

    __private.assetTypes[transactionTypes.CREATE_SERVICE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.INACTIVATE_SERVICE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.ACTIVATE_SERVICE].bind({
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
        'post /': 'addService',
        'get /list': 'listServices',
        'get /': 'getService',
        'get /attributetypes': 'getServiceAttributeTypes',
        'put /inactivate': 'inactivateService',
        'put /activate': 'activateService'
    });

    router.use(function (req, res, next) {
        res.status(500).send({success: false, error: messages.API_ENDPOINT_NOT_FOUND});
    });

    library.network.app.use('/api/services', router);
    library.network.app.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }
        library.logger.error(' API error ' + req.url, err);
        res.status(500).send({success: false, error: 'API error: ' + err.message});
    });
};


Services.getServicesByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.name) {
        where.push('"name" = ${name}');
        params.name = filter.name;
    }

    if (filter.provider) {
        where.push('"provider" = ${provider}');
        params.provider = filter.provider;
    }

    if (filter.status) {
        where.push('"status" = ${status}');
        params.status = filter.status;
    }

    if (_.isEmpty(params)) {
        return cb(null, {count: 0, services: []});
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.ServicesSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['timestamp'].indexOf(sortField) > -1) {
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

    library.db.query(sql.ServicesSql.getServicesFiltered({
        where: where,
    }), params).then(function (rows) {
        let services = [];

        for (let i = 0; i < rows.length; i++) {
            services.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        return cb(null, {count: count, services: services});

    }).catch(function (err) {
        return cb(err.message);
    });
};

__private.listServices = function (filter, cb) {

    library.db.query(sql.ServicesSql.getServicesForProvider, {provider: filter.provider}).then(function (rows) {
        let count = rows.length ? rows.length : 0;
        let services = [];

        for (let i = 0; i < rows.length; i++) {
            services.push(rows[i]);
        }
        let data = {
            services: services,
            count: count
        };

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

Services.getServiceAttributeTypes = function (filter, cb) {

    if (!(filter.name && filter.provider)) {
        return cb('The service (name and provider information) must be provided');
    }

    library.db.query(sql.ServicesSql.getServiceAttributeTypes, {
        name: filter.name,
        provider: filter.provider
    }).then(function (rows) {
        return cb(null, rows[0].attribute_types);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

shared.listServices = function (req, cb) {
    library.schema.validate(req.body, schema.listServices, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.listServices(req.body, function (err, data) {
            if (err) {
                return cb(messages.SERVICES_LIST_FAIL);
            }

            return cb(null, {services: data.services, count: data.count});
        });
    });
};

shared.getService = function (req, cb) {
    library.schema.validate(req.body, schema.getService, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        Services.getServicesByFilter(req.body, function (err, data) {
            if (!data || !data.services) {
                return cb(messages.SERVICE_NOT_FOUND)
            }

            return cb(null, {services: data.services, count: data.count});
        });
    });
};

shared.getServiceAttributeTypes = function (req, cb) {
    library.schema.validate(req.body, schema.getServiceAttributeTypes, function (err) {
        if (err) {
            return cb(err[0].message);
        }
        Services.getServicesByFilter(req.body, function (err, data) {
            if (!data || !data.services || data.services.length === 0) {
                return cb(messages.SERVICE_NOT_FOUND)
            }
            Services.getServiceAttributeTypes(req.body, function (err, data) {
                return cb(null, {service_attribute_types: data});
            });
        });
    });
};

__private.serviceAction = function (req, cb) {
    library.schema.validate(req.body, schema.serviceOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.service) {
            return cb('Service is not provided. Nothing to create');
        }
        if (!library.logic.transaction.validateAddress(req.body.asset.service.provider)) {
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
        modules.accounts.setAccountAndGet({publicKey: req.body.publicKey}, function (err, account) {
            // only providers can perform actions on their own services
            if (!account || account.address !== req.body.asset.service.provider) {
                return cb(messages.SERVICE_ACTION_SENDER_IS_NOT_PROVIDER_ERROR)
            }

            Services.getServicesByFilter({provider: req.body.asset.service.provider, name: req.body.asset.service.name},
                function (err, data) {
                    if (!data || !data.services) {
                        return cb(messages.SERVICE_NOT_FOUND)
                    }

                    if (data.services[0].status === constants.serviceStatus.INACTIVE && req.transactionType === transactionTypes.INACTIVATE_SERVICE) {
                        return cb(messages.SERVICE_IS_ALREADY_INACTIVE)
                    }

                    if (data.services[0].status === constants.serviceStatus.ACTIVE && req.transactionType === transactionTypes.ACTIVATE_SERVICE) {
                        return cb(messages.SERVICE_IS_ALREADY_ACTIVE)
                    }

                    attributes.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: req.transactionType
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
};

shared.inactivateService = function (req, cb) {

    req.transactionType = transactionTypes.INACTIVATE_SERVICE;
    __private.serviceAction(req, function (err, res) {
        if (err) {
            return cb(err)
        }
        return cb(null, res);
    });
}

shared.activateService = function (req, cb) {

    req.transactionType = transactionTypes.ACTIVATE_SERVICE;
    __private.serviceAction(req, function (err, res) {
        if (err) {
            return cb(err)
        }
        return cb(null, res);
    });
}

shared.addService = function (req, cb) {
    library.schema.validate(req.body, schema.serviceOperation, function (err) {
        if (err) {

            return cb(err[0].message);
        }
        if (!req.body.asset || !req.body.asset.service) {
            return cb('Service is not provided. Nothing to create');
        }
        if (!req.body.asset.service.description) {
            return cb(messages.MISSING_SERVICE_DESCRIPTION);
        }
        if (!req.body.asset.service.attributeTypes) {
            return cb(messages.MISSING_ATTRIBUTE_TYPES);
        }
        if (!req.body.asset.service.validations_required) {
            return cb(messages.MISSING_NUMBER_OF_VALIDATIONS_REQUIRED);
        }
        if (!library.logic.transaction.validateAddress(req.body.asset.service.provider)) {
            return cb('Service provider address is incorrect');
        }
        if (req.body.asset.service.description.length > 2048) {
            return cb(messages.SERVICE_DESCRIPTION_TOO_LONG)
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

        Services.getServicesByFilter({provider: req.body.asset.service.provider, name: req.body.asset.service.name},
            function (err, data) {
                if (data && data.services && data.services.length > 0) {
                    return cb(messages.SERVICE_ALREADY_EXISTS)
                }

                attributes.buildTransaction({
                        req: req,
                        keypair: keypair,
                        transactionType: transactionTypes.CREATE_SERVICE
                    },
                    function (err, resultData) {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null, resultData);
                    });
            });
    });
};

// Export
module.exports = Services;
