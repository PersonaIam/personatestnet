'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/attributes.js');

// Private fields
var modules, library;

// Constructor
function UpdateRewardRound() {
}

// Public methods
//
//__API__ `bind`

//
UpdateRewardRound.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
UpdateRewardRound.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = data.amount;
    return trs;
};

//
//__API__ `calculateFee`

//
UpdateRewardRound.prototype.calculateFee = function (trs) {
    return constants.fees.updaterewardround;
};

//
//__API__ `verify`

//
UpdateRewardRound.prototype.verify = function (trs, sender, cb) {

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
UpdateRewardRound.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
UpdateRewardRound.prototype.getBytes = function (trs) {

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


UpdateRewardRound.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
UpdateRewardRound.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
UpdateRewardRound.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
UpdateRewardRound.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

UpdateRewardRound.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs, UpdateRewardRound.prototype.schema);

    if (!report) {
        throw 'Failed to validate schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


UpdateRewardRound.prototype.schema = {
    id: 'Reward',
    type: 'object',
    properties: {

    }
};

//
//
//__API__ `dbRead`

//
UpdateRewardRound.prototype.dbRead = function (raw) {
    return {};
};

UpdateRewardRound.prototype.dbTable = 'reward_rounds';

UpdateRewardRound.prototype.dbFields = [
    'timestamp',
    'status'
];

//
//__API__ `dbSave`
//
UpdateRewardRound.prototype.dbSave = function (trs) {

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            timestamp: trs.timestamp,
            status: 'COMPLETE'
        }
    };
};

//
//__API__ `ready`

//
UpdateRewardRound.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = UpdateRewardRound;
