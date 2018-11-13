'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/attributes.js');

// Private fields
var modules, library, db;

// Constructor
function AttributeShareApprove() {

}

// Public methods
//
//__API__ `bind`

//
AttributeShareApprove.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeShareApprove.prototype.create = function (data, trs) {
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
AttributeShareApprove.prototype.calculateFee = function (trs) {
    return constants.fees.attributeshareapproval;
};

//
//__API__ `verify`

//
AttributeShareApprove.prototype.verify = function (trs, sender, cb) {

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
AttributeShareApprove.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeShareApprove.prototype.getBytes = function (trs) {
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


AttributeShareApprove.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeShareApprove.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeShareApprove.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeShareApprove.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeShareApprove.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.share[0], AttributeShareApprove.prototype.schema);

    if (!report) {
        throw 'Failed to approve attribute share schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeShareApprove.prototype.schema = {
    id: 'AttributeShareApprove',
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
AttributeShareApprove.prototype.dbRead = function (raw) {
    return {};
};

AttributeShareApprove.prototype.dbTable = 'attribute_share_request_approvals';

AttributeShareApprove.prototype.dbFields = [
    'attribute_share_request_id',
    'timestamp',
    'status'
];

//
//__API__ `dbSave`

//
AttributeShareApprove.prototype.dbSave = function (trs) {

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
AttributeShareApprove.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeShareApprove;
