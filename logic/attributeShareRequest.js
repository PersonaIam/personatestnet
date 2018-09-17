'use strict';

var constants = require('../helpers/constants.js');

// Private fields
var modules, library;

// Constructor
function AttributeShareRequest() {
}

// Public methods
//
//__API__ `bind`

//
AttributeShareRequest.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeShareRequest.prototype.create = function (data, trs) {
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
AttributeShareRequest.prototype.calculateFee = function (trs) {
    return constants.fees.attributesharerequest;
};

//
//__API__ `verify`

//
AttributeShareRequest.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.share) {
        return cb('Invalid transaction asset. attributeShareRequest is missing');
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
AttributeShareRequest.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeShareRequest.prototype.getBytes = function (trs) {
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


AttributeShareRequest.prototype.apply = function (trs, block, sender, cb) {

    modules.accounts.mergeAccountAndGet({
        address: trs.recipientId,
        balance: trs.amount,
        u_balance: trs.amount,
        blockId: block.id,
        round: modules.rounds.getRoundFromHeight(block.height)
    }, cb);
};

//
//__API__ `undo`

//
AttributeShareRequest.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeShareRequest.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeShareRequest.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeShareRequest.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.share[0], AttributeShareRequest.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute share schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeShareRequest.prototype.schema = {
    id: 'AttributeShareRequest',
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
        }
    },
    required: ['owner', 'type', 'applicant']
};

//
//
//__API__ `dbRead`

//
AttributeShareRequest.prototype.dbRead = function (raw) {
    return {};
};

AttributeShareRequest.prototype.dbTable = 'attribute_share_requests';

AttributeShareRequest.prototype.dbFields = [
    'attribute_id',
    'applicant',
    'timestamp'
];

//
//__API__ `dbSave`

//
AttributeShareRequest.prototype.dbSave = function (trs) {
    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            attribute_id: trs.asset.share[0].attribute_id,
            applicant: trs.asset.share[0].applicant,
            timestamp: trs.timestamp
        }
    };
};

//
//__API__ `ready`

//
AttributeShareRequest.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeShareRequest;
