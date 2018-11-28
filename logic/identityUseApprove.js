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
    trs.asset.share = {
        type: data.type,
        owner: data.owner,
        publicKey: data.sender.publicKey,
        applicant : data.applicant
    };

    return trs;
};

//
//__API__ `calculateFee`

//
IdentityUseApprove.prototype.calculateFee = function (trs) {
    return constants.fees.attributeshareapproval;
};

//
//__API__ `verify`

//
IdentityUseApprove.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.share) {
        return cb('Invalid transaction asset. share is missing');
    }

    if (!trs.asset.share[0].owner) {
        return cb('Share attribute owner is undefined');
    }

    if (!trs.asset.share[0].type) {
        return cb('Share attribute type is undefined');
    }

    if (!trs.asset.share[0].applicant) {
        return cb('Share attribute applicant is undefined');
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
    if (!trs.asset.share) {
        return null;
    }

    var buf;

    try {
        buf = new Buffer(trs.asset.share, 'utf8');
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
    var report = library.schema.validate(trs.asset.share[0], IdentityUseApprove.prototype.schema);

    if (!report) {
        throw 'Failed to approve attribute share schema: ' + this.scope.schema.getLastErrors().map(function (err) {
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
        type: {
            type: 'string',
        },
        applicant: {
            type: 'string',
            format: 'address'
        },
        action: {
            type : 'boolean'
        }
    },
    required: ['owner', 'type', 'applicant']
};

//
//
//__API__ `dbRead`

//
IdentityUseApprove.prototype.dbRead = function (raw) {
    return {};
};

IdentityUseApprove.prototype.dbTable = 'attribute_share_request_approvals';

IdentityUseApprove.prototype.dbFields = [
    'attribute_share_request_id',
    'timestamp',
    'status'
];

//
//__API__ `dbSave`

//
IdentityUseApprove.prototype.dbSave = function (trs) {

    let params = {};
    params.id = trs.asset.attributeShareRequestId;
    params.status = constants.shareStatus.APPROVED;

    library.db.query(sql.AttributeShareRequestsSql.updateShareRequest, params).then(function (err) {
    });

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            attribute_share_request_id: trs.asset.attributeShareRequestId,
            timestamp: trs.timestamp,
            status : params.status
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
