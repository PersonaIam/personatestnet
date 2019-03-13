'use strict';

var constants = require('../helpers/constants.js');
var bignum = require('../helpers/bignum.js');
let _ = require('lodash')
let sql = require('../sql/business/services.js');

// Private fields
var modules, library;

// Constructor
function ServiceActivate() {
}

// Public methods
//
//__API__ `bind`

//
ServiceActivate.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
ServiceActivate.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.service = {
        name: data.name,
        provider: data.provider
    };

    return trs;
};

//
//__API__ `calculateFee`

//
ServiceActivate.prototype.calculateFee = function (trs) {
    return constants.fees.activateservice;
};

//
//__API__ `verify`

//
ServiceActivate.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.service) {
        return cb('Invalid transaction asset. Service is missing');
    }

    if (!trs.asset.service.provider) {
        return cb('Service provider is undefined');
    }

    if (!trs.asset.service.name) {
        return cb('Service name is undefined');
    }

    return cb(null, trs);
};

//
//__API__ `process`

//
ServiceActivate.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
ServiceActivate.prototype.getBytes = function (trs) {
    if (!trs.asset.service) {
        return null;
    }
    var buf;
    try {
        buf = new Buffer(JSON.stringify(trs.asset.service), 'utf8');
    } catch (e) {
        throw e;
    }

    return buf;
};

//
//__API__ `apply`


ServiceActivate.prototype.apply = function (trs, block, sender, cb) {
  return cb(null, trs);

  };

//
//__API__ `undo`

//
ServiceActivate.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
ServiceActivate.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
ServiceActivate.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

ServiceActivate.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.service, ServiceActivate.prototype.schema);

    if (!report) {
        throw 'Failed to validate service schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};

ServiceActivate.prototype.schema = {
    id: 'ServiceActivate',
    type: 'object',
    properties: {
        provider: {
            type: 'string',
            format : 'address'
        },
        name: {
            type: 'string'
        },

    },
    required: ['provider', 'name']
};

//
//__API__ `objectNormalize`

//
ServiceActivate.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.service, ServiceActivate.prototype.schema);

    if (!report) {
        throw 'Failed to validate service schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};

//
//__API__ `dbRead`

//
ServiceActivate.prototype.dbRead = function (raw) {
    return {};
};

ServiceActivate.prototype.dbTable = 'services';

ServiceActivate.prototype.dbFields = [
    'provider',
    'name',
    'description',
    'status',
    'timestamp'
];

//
//__API__ `dbSave`

//
ServiceActivate.prototype.dbSave = function (trs) {
    let params = {};
    params.name = trs.asset.service.name;
    params.provider = trs.asset.service.provider;
    params.status = constants.serviceStatus.ACTIVE;

    library.db.query(sql.ServicesSql.updateServiceStatus, params).then(function (err) {
    });

    return {};
};

//
//__API__ `ready`

//
ServiceActivate.prototype.ready = function (trs, sender) {
   return true;
};

// Export
module.exports = ServiceActivate;
