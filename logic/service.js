'use strict';

var constants = require('../helpers/constants.js');
var bignum = require('../helpers/bignum.js');
let _ = require('lodash')
let sql = require('../sql/business/services.js');

// Private fields
var modules, library;

// Constructor
function Service() {
}

// Public methods
//
//__API__ `bind`

//
Service.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
Service.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.service = {
        name: data.name,
        description: data.description,
        provider: data.provider,
        validations: data.validations
    };

    return trs;
};

//
//__API__ `calculateFee`

//
Service.prototype.calculateFee = function (trs) {
    return constants.fees.createservice;
};

//
//__API__ `verify`

//
Service.prototype.verify = function (trs, sender, cb) {

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

    if (!trs.asset.service.description) {
        return cb('Service description is undefined');
    }

    if (!trs.asset.service.attributeTypes) {
        return cb('Attribute Types are undefined');
    }

    return cb(null, trs);
};


//
//__API__ `getBytes`

//
Service.prototype.getBytes = function (trs) {
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


Service.prototype.apply = function (trs, block, sender, cb) {
  return cb(null, trs);

  };

//
//__API__ `undo`

//
Service.prototype.undo = function (trs, block, sender, cb) {

};

Service.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `applyUnconfirmed`

//
Service.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
Service.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

Service.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.service, Service.prototype.schema);

    if (!report) {
        throw 'Failed to validate service schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};

Service.prototype.schema = {
    id: 'Service',
    type: 'object',
    properties: {
        provider: {
            type: 'string',
            format : 'address'
        },
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        attributeTypes : {
            type : 'array'
        },
        validations: {
            type: 'integer',
            minimum: 1
        }

    },
    required: ['provider', 'name', 'description', 'attributeTypes']
};

//
//__API__ `objectNormalize`

//
Service.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.service, Service.prototype.schema);

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
Service.prototype.dbRead = function (raw) {
    return {};
};

Service.prototype.dbTable = 'services';

Service.prototype.dbFields = [
    'provider',
    'name',
    'description',
    'status',
    'timestamp',
    'attribute_types',
    'validations_required'
];

//
//__API__ `dbSave`

//
Service.prototype.dbSave = function (trs) {
    let params = {};
    params.service_name = trs.asset.service.name;
    params.service_provider = trs.asset.service.provider;
    params.attribute_types = trs.asset.service.attributeTypes;

    let values = {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            provider: trs.asset.service.provider,
            name: trs.asset.service.name,
            description : trs.asset.service.description,
            status: constants.serviceStatus.ACTIVE,
            timestamp: trs.timestamp,
            attribute_types: JSON.stringify(trs.asset.service.attributeTypes),
            validations_required: trs.asset.service.validations_required
        }
    };
    return values;
};

//
//__API__ `ready`

//
Service.prototype.ready = function (trs, sender) {
   return true;
};

// Export
module.exports = Service;
