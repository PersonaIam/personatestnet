'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/attributes.js');

// Private fields
var modules, library;

// Constructor
function AttributeConsume() {
}

// Public methods
//
//__API__ `bind`

//
AttributeConsume.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeConsume.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = data.amount;
    trs.asset.share = {
        type: data.type,
        owner: data.owner,
        publicKey: data.sender.publicKey,
        applicant : data.applicant,
        value : data.value
    };

    return trs;
};

//
//__API__ `calculateFee`

//
AttributeConsume.prototype.calculateFee = function (trs) {
    return constants.fees.attributeconsume;
};

//
//__API__ `verify`

//
AttributeConsume.prototype.verify = function (trs, sender, cb) {

    if (trs.amount === 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.recipientId === constants.REWARD_FAUCET) {
        return cb('Invalid transaction recipient');
    }

    if (!trs.asset || !trs.asset.attribute) {
        return cb('Invalid transaction asset. Attribute is missing');
    }

    if (!trs.asset.attribute[0].owner) {
        return cb('Attribute owner is undefined');
    }

    if (!trs.asset.attribute[0].type) {
        return cb('Attribute type is undefined');
    }

    return cb(null, trs);

};

//
//__API__ `process`

//
AttributeConsume.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeConsume.prototype.getBytes = function (trs) {
    if (!trs.asset.attribute) {
        return null;
    }

    var buf;

    try {
        buf = new Buffer(trs.asset.attribute, 'utf8');
    } catch (e) {
        throw e;
    }

    return buf;
};

//
//__API__ `apply`


AttributeConsume.prototype.apply = function (trs, block, sender, cb) {

   return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeConsume.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeConsume.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeConsume.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeConsume.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.attribute[0], AttributeConsume.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute share schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeConsume.prototype.schema = {
    id: 'AttributeShare',
    type: 'object',
    properties: {
        owner: {
            type: 'string',
            format: 'address'
        },
        type: {
            type: 'string',
        }

    },
    required: ['owner', 'type']
};

//
//
//__API__ `dbRead`

//
AttributeConsume.prototype.dbRead = function (raw) {
    return {};
};

AttributeConsume.prototype.dbTable = 'attribute_consumptions';

AttributeConsume.prototype.dbFields = [
    'attribute_id',
    'timestamp',
    'amount'
];

//
//__API__ `dbSave`

//
AttributeConsume.prototype.dbSave = function (trs) {

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            attribute_id: trs.asset.attribute_id,
            timestamp: trs.timestamp,
            amount : trs.amount
        }
    };
};

//
//__API__ `ready`

//
AttributeConsume.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeConsume;
