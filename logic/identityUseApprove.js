'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/business/attributes.js');

// Private fields
var modules, library, db;

// Constructor
function IdentityUseApprove() {

}

// Public methods
//
//__API__ `bind`

//
IdentityUseApprove.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
IdentityUseApprove.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.identityuse = {
        owner: data.owner,
        publicKey: data.sender.publicKey,
        provider : data.serviceProvider
    };

    return trs;
};

//
//__API__ `calculateFee`

//
IdentityUseApprove.prototype.calculateFee = function (trs) {
    return constants.fees.identityuserequestapprove;
};

//
//__API__ `verify`

//
IdentityUseApprove.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.identityuse) {
        return cb('Invalid transaction asset. share is missing');
    }

    if (!trs.asset.identityuse[0].owner) {
        return cb('Identity use attribute owner is undefined');
    }

    if (!trs.asset.identityuse[0].serviceName) {
        return cb('Identity use service name is undefined');
    }

    if (!trs.asset.identityuse[0].serviceProvider) {
        return cb('Identity use service provider is undefined');
    }

    return cb(null, trs);

};

//
//__API__ `process`

//
IdentityUseApprove.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
IdentityUseApprove.prototype.getBytes = function (trs) {
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


IdentityUseApprove.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
IdentityUseApprove.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
IdentityUseApprove.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
IdentityUseApprove.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

IdentityUseApprove.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.identityuse[0], IdentityUseApprove.prototype.schema);

    if (!report) {
        throw 'Failed to validate identity use approve schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


IdentityUseApprove.prototype.schema = {
    id: 'IdentityUseApprove',
    type: 'object',
    properties: {
        owner: {
            type: 'string',
            format: 'address'
        },
        serviceName: {
            type: 'string'
        },
        serviceProvider: {
            type : 'string',
            format: 'address'
        }
    },
    required: ['owner', 'serviceName', 'serviceProvider']
};

//
//
//__API__ `dbRead`

//
IdentityUseApprove.prototype.dbRead = function (raw) {
    return {};
};

IdentityUseApprove.prototype.dbTable = 'identity_use_request_actions';

IdentityUseApprove.prototype.dbFields = [
    'identity_use_request_id',
    'timestamp',
    'action'
];

//
//__API__ `dbSave`

//
IdentityUseApprove.prototype.dbSave = function (trs) {

    let params = {};
    params.id = trs.asset.identityUseRequestId;
    params.status = constants.identityUseRequestStatus.ACTIVE;
    params.action = constants.identityUseRequestActions.APPROVE;

    library.db.query(sql.IdentityUseRequestsSql.updateIdentityUseRequest, params).then(function (err) {
    });

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            identity_use_request_id: trs.asset.identityUseRequestId,
            timestamp: trs.timestamp,
            action : params.action
        }
    };
};

//
//__API__ `ready`

//
IdentityUseApprove.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = IdentityUseApprove;
