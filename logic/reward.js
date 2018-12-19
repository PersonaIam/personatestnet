'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/business/attributes.js');

// Private fields
var modules, library;

// Constructor
function Reward() {
}

// Public methods
//
//__API__ `bind`

//
Reward.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
Reward.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = data.amount;
    return trs;
};

//
//__API__ `calculateFee`

//
Reward.prototype.calculateFee = function (trs) {
    return constants.fees.reward;
};

//
//__API__ `verify`

//
Reward.prototype.verify = function (trs, sender, cb) {

    if (trs.amount === 0) {
        return cb('Invalid transaction amount');
    }

    if (trs.senderPublicKey !== constants.REWARD_FAUCET_KEY) {
        return cb('Invalid senderPublicKey');
    }

    return cb(null, trs);

};

//
//__API__ `process`

//
Reward.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
Reward.prototype.getBytes = function (trs) {

    if (!trs) {
        return null;
    }

    var buf;

    try {
        buf = new Buffer(trs.senderPublicKey, 'utf8');
    } catch (e) {
        throw e;
    }

    return buf;
};

//
//__API__ `apply`


Reward.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
Reward.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
Reward.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
Reward.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

Reward.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs, Reward.prototype.schema);

    if (!report) {
        throw 'Failed to validate schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


Reward.prototype.schema = {
    id: 'Reward',
    type: 'object',
    properties: {

    }
};

//
//
//__API__ `dbRead`

//
Reward.prototype.dbRead = function (raw) {
    return {};
};

Reward.prototype.dbTable = 'rewards';

Reward.prototype.dbFields = [
    'recipient',
    'amount',
    'timestamp'
];

//
//__API__ `dbSave`
//
Reward.prototype.dbSave = function (trs) {

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            timestamp: trs.timestamp,
            amount: trs.amount,
            recipient : trs.recipientId
        }
    };
};

//
//__API__ `ready`

//
Reward.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = Reward;
