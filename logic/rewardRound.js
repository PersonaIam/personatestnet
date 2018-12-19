'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/business/attributes.js');

// Private fields
var modules, library;

// Constructor
function RewardRound() {
}

// Public methods
//
//__API__ `bind`

//
RewardRound.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
RewardRound.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = data.amount;
    return trs;
};

//
//__API__ `calculateFee`

//
RewardRound.prototype.calculateFee = function (trs) {
    return constants.fees.startrewardround;
};

//
//__API__ `verify`

//
RewardRound.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
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
RewardRound.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
RewardRound.prototype.getBytes = function (trs) {

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


RewardRound.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
RewardRound.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
RewardRound.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
RewardRound.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

RewardRound.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs, RewardRound.prototype.schema);

    if (!report) {
        throw 'Failed to validate schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


RewardRound.prototype.schema = {
    id: 'Reward',
    type: 'object',
    properties: {

    }
};

//
//
//__API__ `dbRead`

//
RewardRound.prototype.dbRead = function (raw) {
    return {};
};

RewardRound.prototype.dbTable = 'reward_rounds';

RewardRound.prototype.dbFields = [
    'timestamp',
    'status'
];

//
//__API__ `dbSave`
//
RewardRound.prototype.dbSave = function (trs) {

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            timestamp: trs.timestamp,
            status: 'INCOMPLETE'
        }
    };
};

//
//__API__ `ready`

//
RewardRound.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = RewardRound;
