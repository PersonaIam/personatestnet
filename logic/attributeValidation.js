'use strict';

var constants = require('../helpers/constants.js');

// Private fields
var modules, library;

// Constructor
function AttributeValidation() {
}

// Public methods
//
//__API__ `bind`

//
AttributeValidation.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeValidation.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.validation = {
        attribute_validation_request_id: data.attributeValidationRequestId,
        chunk: data.chunk,
        timestamp: data.timestamp,
        expireTimestamp : data.expireTimestamp
    };

    return trs;
};

//
//__API__ `calculateFee`

//
AttributeValidation.prototype.calculateFee = function (trs) {
    return constants.fees.attributevalidation;
};

//
//__API__ `verify`

//
AttributeValidation.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.validation) {
        return cb('Invalid transaction asset. validation is missing');
    }

    if (!trs.asset.validation[0].owner) {
        return cb('Attribute owner is undefined');
    }

    if (!trs.asset.validation[0].type) {
        return cb('Attribute type is undefined');
    }

    if (!trs.asset.validation[0].validator) {
        return cb('Attribute validator is undefined');
    }

    return cb(null, trs);

};

//
//__API__ `process`

//
AttributeValidation.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeValidation.prototype.getBytes = function (trs) {
    if (!trs.asset.validation) {
        return null;
    }

    var buf;

    try {
        buf = new Buffer(trs.asset.validation, 'utf8');
    } catch (e) {
        throw e;
    }

    return buf;
};

//
//__API__ `apply`


AttributeValidation.prototype.apply = function (trs, block, sender, cb) {

    modules.accounts.mergeAccountAndGet({
        address: trs.recipientId,
        balance: trs.amount,
        u_balance: trs.amount,
        blockId: block.id,
        round: modules.rounds.getRoundFromHeight(block.height)
    }, cb);
};

//
//__API__ `applyUnconfirmed`
//

AttributeValidation.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeValidation.prototype.undo = function (trs, block, sender, cb) {
};

//
//__API__ `undoUnconfirmed`

//
AttributeValidation.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeValidation.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.validation[0], AttributeValidation.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute validation schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeValidation.prototype.schema = {
    id: 'AttributeValidation',
    type: 'object',
    properties: {
        owner: {
            type: 'string',
            format: 'address'
        },
        type: {
            type: 'string',
        },
        validator: {
            type: 'string',
            format: 'address'
        }
    },
    required: ['owner', 'type', 'validator']
};

//
//__API__ `objectNormalize`

//
AttributeValidation.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.validation[0], AttributeValidation.prototype.schema);

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
AttributeValidation.prototype.dbRead = function (raw) {
    return {};
};

AttributeValidation.prototype.dbTable = 'attribute_validations';

AttributeValidation.prototype.dbFields = [
    'attribute_validation_request_id',
    'chunk',
    'timestamp',
    'expireTimestamp'
];

//
//__API__ `dbSave`

//
AttributeValidation.prototype.dbSave = function (trs) {
    return {
        table: this.dbTable,
        fields: this.dbFields,

        values: {
            attribute_validation_request_id: trs.asset.attributeValidationRequestId,
            chunk: 7,
            timestamp: trs.timestamp,
            expireTimestamp: trs.timestamp + 10000
        }
    };
};

//
//__API__ `ready`

//
AttributeValidation.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeValidation;
