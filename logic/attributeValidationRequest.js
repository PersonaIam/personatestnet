'use strict';

var constants = require('../helpers/constants.js');

// Private fields
var modules, library;

// Constructor
function AttributeValidationRequest() {
}

// Public methods
//
//__API__ `bind`

//
AttributeValidationRequest.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeValidationRequest.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.validation = {
        type: data.type,
        owner: data.owner,
        publicKey: data.sender.publicKey,
        validator : data.validator
    };

    return trs;
};

//
//__API__ `calculateFee`

//
AttributeValidationRequest.prototype.calculateFee = function (trs) {
    return constants.fees.attributevalidationrequest;
};

//
//__API__ `verify`

//
AttributeValidationRequest.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.validation) {
        return cb('Invalid transaction asset. attributeValidationRequest is missing');
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
AttributeValidationRequest.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeValidationRequest.prototype.getBytes = function (trs) {
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


AttributeValidationRequest.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeValidationRequest.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeValidationRequest.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeValidationRequest.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeValidationRequest.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.validation[0], AttributeValidationRequest.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute validation schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeValidationRequest.prototype.schema = {
    id: 'AttributeValidationRequest',
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
AttributeValidationRequest.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.validation[0], AttributeValidationRequest.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute validation request schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};

//
//__API__ `dbRead`

//
AttributeValidationRequest.prototype.dbRead = function (raw) {
    return {};
};

AttributeValidationRequest.prototype.dbTable = 'attribute_validation_requests';

AttributeValidationRequest.prototype.dbFields = [
    'attribute_id',
    'validator',
    'timestamp'
];

//
//__API__ `dbSave`

//
AttributeValidationRequest.prototype.dbSave = function (trs) {
    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            attribute_id: trs.asset.validation[0].attribute_id,
            validator: trs.asset.validation[0].validator,
            timestamp: trs.timestamp
        }
    };
};

//
//__API__ `ready`

//
AttributeValidationRequest.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeValidationRequest;
