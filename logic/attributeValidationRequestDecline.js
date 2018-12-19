'use strict';

var constants = require('../helpers/constants.js');
var messages = require('../helpers/messages.js');
let sql = require('../sql/business/attributes.js');

// Private fields
var modules, library, db;

// Constructor
function AttributeValidationRequestDecline() {

}

// Public methods
//
//__API__ `bind`

//
AttributeValidationRequestDecline.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeValidationRequestDecline.prototype.create = function (data, trs) {

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
AttributeValidationRequestDecline.prototype.calculateFee = function (trs) {
    return constants.fees.attributevalidationrequestdecline;
};

//
//__API__ `verify`

//
AttributeValidationRequestDecline.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.validation) {
        return cb('Invalid transaction asset. Validation is missing');
    }

    if (!trs.asset.validation[0].owner) {
        return cb('Validation attribute owner is undefined');
    }

    if (!trs.asset.validation[0].type) {
        return cb('Validation attribute type is undefined');
    }

    if (!trs.asset.validation[0].validator) {
        return cb('Validation attribute validator is undefined');
    }

    if (!trs.asset.validation[0].reason) {
        return cb('Decline reason is undefined');
    }

    // if (trs.sender.address !== trs.asset.validation[0].validator) {
    //     return cb(messages.SENDER_IS_NOT_VALIDATOR_ERROR);
    // }

    return cb(null, trs);

};

//
//__API__ `process`

//
AttributeValidationRequestDecline.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeValidationRequestDecline.prototype.getBytes = function (trs) {
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


AttributeValidationRequestDecline.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeValidationRequestDecline.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeValidationRequestDecline.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeValidationRequestDecline.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeValidationRequestDecline.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.validation[0], AttributeValidationRequestDecline.prototype.schema);

    if (!report) {
        throw 'Failed to validate decline attribute validation request schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeValidationRequestDecline.prototype.schema = {
    id: 'AttributeValidationRequestDecline',
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
AttributeValidationRequestDecline.prototype.dbRead = function (raw) {
    return {};
};

AttributeValidationRequestDecline.prototype.dbTable = 'attribute_validation_request_actions';

AttributeValidationRequestDecline.prototype.dbFields = [
    'attribute_validation_request_id',
    'timestamp',
    'action'
];

//
//__API__ `dbSave`

//
AttributeValidationRequestDecline.prototype.dbSave = function (trs) {

    let params = {};
    params.id = trs.asset.attributeValidationRequestId;
    params.action = constants.validationRequestActions.DECLINE;
    params.status = constants.validationRequestStatus.DECLINED;
    params.reason = trs.asset.validation[0].reason;

    library.db.query(sql.AttributeValidationRequestsSql.updateValidationRequestWithReason, params).then(function (err) {
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
AttributeValidationRequestDecline.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeValidationRequestDecline;
