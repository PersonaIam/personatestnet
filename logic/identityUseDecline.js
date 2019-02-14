'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/business/attributes.js');

// Private fields
var modules, library, db;

// Constructor
function IdentityUseDecline() {

}

// Public methods
//
//__API__ `bind`

//
IdentityUseDecline.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
IdentityUseDecline.prototype.create = function (data, trs) {
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
IdentityUseDecline.prototype.calculateFee = function (trs) {
    return constants.fees.identityuserequestdecline;
};

//
//__API__ `verify`

//
IdentityUseDecline.prototype.verify = function (trs, sender, cb) {

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

    if (!trs.asset.identityuse[0].reason) {
        return cb('Identity use service provider is undefined');
    }

    return cb(null, trs);

};

//
//__API__ `process`

//
IdentityUseDecline.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
IdentityUseDecline.prototype.getBytes = function (trs) {
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


IdentityUseDecline.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
IdentityUseDecline.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
IdentityUseDecline.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
IdentityUseDecline.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

IdentityUseDecline.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.identityuse[0], IdentityUseDecline.prototype.schema);

    if (!report) {
        throw 'Failed to validate identity use decline schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


IdentityUseDecline.prototype.schema = {
    id: 'IdentityUseDecline',
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
IdentityUseDecline.prototype.dbRead = function (raw) {
    return {};
};

IdentityUseDecline.prototype.dbTable = 'identity_use_request_actions';

IdentityUseDecline.prototype.dbFields = [
    'identity_use_request_id',
    'timestamp',
    'action'
];

//
//__API__ `dbSave`

//
IdentityUseDecline.prototype.dbSave = function (trs) {

    let params = {};
    params.id = [trs.asset.identityUseRequestId];
    params.status = constants.identityUseRequestStatus.DECLINED;
    params.action = constants.identityUseRequestActions.DECLINE;
    params.reason = trs.asset.identityuse[0].reason;

    library.db.query(sql.IdentityUseRequestsSql.updateIdentityUseWithReason, params).then(function (err) {
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
IdentityUseDecline.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = IdentityUseDecline;
