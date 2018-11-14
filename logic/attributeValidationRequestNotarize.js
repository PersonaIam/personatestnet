'use strict';

var constants = require('../helpers/constants.js');
var messages = require('../helpers/messages.js');
let sql = require('../sql/attributes.js');

// Private fields
var modules, library, db;

// Constructor
function AttributeValidationRequestNotarize() {

}

// Public methods
//
//__API__ `bind`

//
AttributeValidationRequestNotarize.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeValidationRequestNotarize.prototype.create = function (data, trs) {

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
AttributeValidationRequestNotarize.prototype.calculateFee = function (trs) {
    return constants.fees.attributevalidationrequestnotarize;
};

//
//__API__ `verify`

//
AttributeValidationRequestNotarize.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.validation) {
        return cb('Invalid transaction asset. Validation is missing');
    }

    if (!trs.asset.validation[0].owner) {
        return cb('Attribute owner is undefined');
    }

    if (!trs.asset.validation[0].type) {
        return cb('Attribute type is undefined');
    }

    if (!trs.asset.validation[0].validator) {
        return cb('Validator is undefined');
    }

    if (!trs.asset.validation[0].validationType) {
        return cb('Validation type is undefined');
    }

    // if (trs.senderId !== trs.asset.validation[0].validator) {
    //     return cb(messages.SENDER_IS_NOT_VALIDATOR_ERROR);
    // }
    return cb(null, trs);

};

//
//__API__ `process`

//
AttributeValidationRequestNotarize.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeValidationRequestNotarize.prototype.getBytes = function (trs) {
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


AttributeValidationRequestNotarize.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeValidationRequestNotarize.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeValidationRequestNotarize.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeValidationRequestNotarize.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeValidationRequestNotarize.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.validation[0], AttributeValidationRequestNotarize.prototype.schema);

    if (!report) {
        throw 'Failed to validate notarize attribute validation request schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeValidationRequestNotarize.prototype.schema = {
    id: 'AttributeValidationRequestNotarize',
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
//
//__API__ `dbRead`

//
AttributeValidationRequestNotarize.prototype.dbRead = function (raw) {
    return {};
};

AttributeValidationRequestNotarize.prototype.dbTable = 'attribute_validation_request_actions';

AttributeValidationRequestNotarize.prototype.dbFields = [
    'attribute_validation_request_id',
    'timestamp',
    'action'
];

//
//__API__ `dbSave`

//
AttributeValidationRequestNotarize.prototype.dbSave = function (trs) {

    let params = {};
    params.id = trs.asset.attributeValidationRequestId;
    params.action = constants.validationRequestAction.NOTARIZE;
    params.status = constants.validationRequestStatus.COMPLETED;
    params.validationType = trs.asset.validation[0].validationType;

    library.db.query(sql.AttributeValidationRequestsSql.updateValidationRequestWithType, params).then(function (err) {
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
AttributeValidationRequestNotarize.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeValidationRequestNotarize;
