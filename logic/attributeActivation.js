'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/attributes.js');
let messages = require('../helpers/messages.js');

// Private fields
var modules, library;

// Constructor
function AttributeActivation() {
}

// Public methods
//
//__API__ `bind`

//
AttributeActivation.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeActivation.prototype.create = function (data, trs) {
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
AttributeActivation.prototype.calculateFee = function (trs) {
    return constants.fees.attributeactivation;
};

//
//__API__ `verify`
//
AttributeActivation.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
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

    if (trs.asset.attribute[0].owner !== trs.senderId) {
        return cb('An attribute activation transaction can only be performed by the owner');
    }

    modules.attributes.getAttributeValidationScore({owner : trs.asset.attribute[0].owner, type : trs.asset.attribute[0].type },
        function (err, res) {
            if (res.attribute_validation_score < constants.VALIDATIONS_REQUIRED) {
                return cb (messages.VALIDATION_SCORE_IS_TOO_LOW);
            }
            return cb(null, trs);
        });

};

//
//__API__ `process`

//
AttributeActivation.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeActivation.prototype.getBytes = function (trs) {
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


AttributeActivation.prototype.apply = function (trs, block, sender, cb) {

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
AttributeActivation.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeActivation.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeActivation.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeActivation.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.attribute[0], AttributeActivation.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute activation schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeActivation.prototype.schema = {
    id: 'AttributeActivation',
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
AttributeActivation.prototype.dbRead = function (raw) {
    return {};
};

AttributeActivation.prototype.dbTable = 'attribute_activations';

AttributeActivation.prototype.dbFields = [
    'attribute_id',
    'timestamp'
];
//
//__API__ `dbSave`

//
AttributeActivation.prototype.dbSave = function (trs) {

    let params = {};
    params.id = trs.asset.attribute_id;

    library.db.query(sql.AttributesSql.activateAttribute, params).then(function (err) {
    });

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            attribute_id: trs.asset.attribute_id,
            timestamp: trs.timestamp
        }
    };
};

//
//__API__ `ready`

//
AttributeActivation.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeActivation;
