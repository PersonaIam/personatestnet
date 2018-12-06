'use strict';

var constants = require('../helpers/constants.js');

// Private fields
var modules, library;

// Constructor
function IdentityUseRequest() {
}

// Public methods
//
//__API__ `bind`

//
IdentityUseRequest.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
IdentityUseRequest.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.identityuse = {
        attributes : data.attributes,
        serviceId : data.serviceId,
        publicKey : data.sender.publicKey,
    };

    return trs;
};

//
//__API__ `calculateFee`

//
IdentityUseRequest.prototype.calculateFee = function (trs) {
    return constants.fees.identityuserequest;
};

//
//__API__ `verify`

//
IdentityUseRequest.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.identityuse) {
        return cb('Invalid transaction asset. identityuse is missing');
    }

    if (!trs.asset.identityuse[0].serviceId) {
        return cb('Invalid serviceId');
    }

    if (!trs.asset.identityuse[0].attributes) {
        return cb('Invalid attributes');
    }

    return cb(null, trs);

};

//
//__API__ `process`

//
IdentityUseRequest.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
IdentityUseRequest.prototype.getBytes = function (trs) {
    if (!trs.asset.identityuse) {
        return null;
    }

    var buf;

    try {
        buf = new Buffer(trs.asset.identityuse, 'utf8');
    } catch (e) {
        throw e;
    }

    return buf;
};

//
//__API__ `apply`


IdentityUseRequest.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
IdentityUseRequest.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
IdentityUseRequest.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
IdentityUseRequest.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

IdentityUseRequest.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.identityuse[0], IdentityUseRequest.prototype.schema);

    if (!report) {
        throw 'Failed to validate identity use schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};

IdentityUseRequest.prototype.schema = {
    id: 'IdentityUseRequest',
    type: 'object',
    properties: {
        owner: {
            type: 'string',
            format: 'address'
        },
        attributes: {
            type: 'array',
        },
        serviceProvider: {
            type: 'string',
            format: 'address'
        },
        serviceName: {
            type: 'string',
        }
    },
    required: ['owner', 'attributes', 'serviceProvider', 'serviceName']
};

//
//
//__API__ `dbRead`

//
IdentityUseRequest.prototype.dbRead = function (raw) {
    return {};
};

IdentityUseRequest.prototype.dbTable = 'identity_use_requests';

IdentityUseRequest.prototype.dbFields = [
    'service_id',
    'status',
    'owner',
    'timestamp',
    'attributes'
];

//
//__API__ `dbSave`

//
IdentityUseRequest.prototype.dbSave = function (trs) {
    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            service_id: trs.asset.identityuse[0].serviceId,
            owner: trs.asset.identityuse[0].owner,
            timestamp: trs.timestamp,
            attributes: JSON.stringify(trs.asset.identityuse[0].attributes),
            status: constants.identityUseRequestStatus.PENDING_APPROVAL
        }
    };
};

//
//__API__ `ready`

//
IdentityUseRequest.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = IdentityUseRequest;
