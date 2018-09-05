'use strict';

var constants = require('../helpers/constants.js');

// Private fields
var modules, library;

// Constructor
function Attribute() {
}

// Public methods
//
//__API__ `bind`

//
Attribute.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
Attribute.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.attribute = {
        type: data.type,
        value: data.value,
        owner: data.owner,
        publicKey: data.sender.publicKey
    };

    return trs;
};

//
//__API__ `calculateFee`

//
Attribute.prototype.calculateFee = function (trs) {
    return constants.fees.createattribute;
};

//
//__API__ `verify`

//
Attribute.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.attribute) {
        return cb('Invalid transaction asset. Attribute is missing');
    }

    if (!trs.asset.attribute[0].owner) {
        return cb('Attribute owner is undefined');
    }

    modules.attributes.verify({
        owner: trs.asset.attribute.owner,
        type: trs.asset.attribute.type
    }, function (err, attribute) {
        if (err) {
            return cb(err);
        }

        if (attribute) {
            return cb('Attribute already exists');
        }
        return cb(null, trs);
    });
};

//
//__API__ `process`

//
Attribute.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
Attribute.prototype.getBytes = function (trs) {
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


Attribute.prototype.apply = function (trs, block, sender, cb) {

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
Attribute.prototype.undo = function (trs, block, sender, cb) {

};

Attribute.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `applyUnconfirmed`

//
Attribute.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
Attribute.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

Attribute.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.attribute[0], Attribute.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


Attribute.prototype.schema = {
    id: 'Attribute',
    type: 'object',
    properties: {
        owner: {
            type: 'string',
            format : 'address'
        },
        type: {
            type: 'string',
        },
        value: {
            type: 'string',
        }
    },
    required: ['owner', 'type', 'value']
};

//
//__API__ `objectNormalize`

//
Attribute.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.attribute[0], Attribute.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};

//
//__API__ `dbRead`

//
Attribute.prototype.dbRead = function (raw) {
    return {};
};

Attribute.prototype.dbTable = 'attributes';

Attribute.prototype.dbFields = [
    'owner',
    'type',
    'value',
    'timestamp',
    'active'
];

//
//__API__ `dbSave`

//
Attribute.prototype.dbSave = function (trs) {
    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            owner: trs.asset.attribute[0].owner,
            type: trs.asset.attribute[0].type,
            value: trs.asset.attribute[0].value,
            timestamp: 1, // TODO temporary
            active: 0
        }
    };
};

//
//__API__ `ready`

//
Attribute.prototype.ready = function (trs, sender) {
   return true;
};

// Export
module.exports = Attribute;
