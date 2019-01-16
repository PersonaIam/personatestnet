'use strict';

var constants = require('../helpers/constants.js');
var messages = require('../helpers/messages.js');
let sql = require('../sql/business/attributes.js');

// Private fields
var modules, library, db;

// Constructor
function AttributeValidationRequestCancel() {

}

// Public methods
//
//__API__ `bind`

//
AttributeValidationRequestCancel.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeValidationRequestCancel.prototype.create = function (data, trs) {

    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.validation = {
        attributeId : data.attributeId,
        publicKey: data.sender.publicKey,
        validator : data.validator
    };

    return trs;
};

//
//__API__ `calculateFee`

//
AttributeValidationRequestCancel.prototype.calculateFee = function (trs) {
    return constants.fees.attributevalidationrequestcancel;
};

//
//__API__ `verify`

//
AttributeValidationRequestCancel.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.validation) {
        return cb('Invalid transaction asset. Validation is missing');
    }

    if (!trs.asset.validation[0].owner) {
        return cb('Validation attribute owner is undefined');
    }

    if (!trs.asset.validation[0].type && !trs.asset.validation[0].attributeId) {
        return cb('Either the attribute type or the attributeId must be provided');
    }

    if (!trs.asset.validation[0].validator) {
        return cb('Validation attribute validator is undefined');
    }

    // if (trs.senderId !== trs.asset.validation[0].validator) {
    //     return cb(messages.SENDER_IS_NOT_OWNER_ERROR);
    // }
    return cb(null, trs);

};

//
//__API__ `process`

//
AttributeValidationRequestCancel.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeValidationRequestCancel.prototype.getBytes = function (trs) {
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


AttributeValidationRequestCancel.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeValidationRequestCancel.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeValidationRequestCancel.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeValidationRequestCancel.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeValidationRequestCancel.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.validation[0], AttributeValidationRequestCancel.prototype.schema);

    if (!report) {
        throw 'Failed to validate cancel attribute validation request schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeValidationRequestCancel.prototype.schema = {
    id: 'AttributeValidationRequestCancel',
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
        },
        attributeId: {
            type: 'integer',
        }
    },
    required: ['owner', 'validator']
};

//
//
//__API__ `dbRead`

//
AttributeValidationRequestCancel.prototype.dbRead = function (raw) {
    return {};
};

AttributeValidationRequestCancel.prototype.dbTable = 'attribute_validation_request_actions';

AttributeValidationRequestCancel.prototype.dbFields = [
    'attribute_validation_request_id',
    'timestamp',
    'action'
];

//
//__API__ `dbSave`

//
AttributeValidationRequestCancel.prototype.dbSave = function (trs) {

    let params = {};
    params.id = trs.asset.attributeValidationRequestId;
    params.action = constants.validationRequestActions.CANCEL;
    params.status = constants.validationRequestStatus.CANCELED;

    library.db.query(sql.AttributeValidationRequestsSql.updateValidationRequest, params).then(function (err) {
    });

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            attribute_validation_request_id: trs.asset.attributeValidationRequestId,
            timestamp: trs.timestamp,
            action : params.action
        }
    };
};

//
//__API__ `ready`

//
AttributeValidationRequestCancel.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeValidationRequestCancel;
