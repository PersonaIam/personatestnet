'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/attributes.js');

// Private fields
var modules, library;

// Constructor
function AttributeUpdate() {
}

// Public methods
//
//__API__ `bind`

//
AttributeUpdate.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeUpdate.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
    trs.asset.attribute = {
        attributeId: data.attributeId,
        owner: data.owner,
        value: data.value,
        expire_timestamp: data.expire_timestamp,
        publicKey: data.sender.publicKey
    };
    return trs;
};

//
//__API__ `calculateFee`

//
AttributeUpdate.prototype.calculateFee = function (trs) {
    return constants.fees.updateattribute;
};

//
//__API__ `verify`

//
AttributeUpdate.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.attribute) {
        return cb('Invalid transaction asset. Attribute is missing');
    }

    if (!trs.asset.attribute[0].attributeId) {
        return cb('Attribute id is undefined');
    }

    return cb(null, trs);
};

//
//__API__ `process`

//
AttributeUpdate.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeUpdate.prototype.getBytes = function (trs) {
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


AttributeUpdate.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeUpdate.prototype.undo = function (trs, block, sender, cb) {

};

AttributeUpdate.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `applyUnconfirmed`

//
AttributeUpdate.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeUpdate.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeUpdate.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.attribute[0], AttributeUpdate.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeUpdate.prototype.schema = {
    id: 'AttributeUpdate',
    type: 'object',
    properties: {
        attributeId : {
            type: 'integer',
            minimum : 1
        },
        value: {
            type: 'string',
            minLength : 1
        }
    },
    required: ['attributeId', 'value']
};

//
//__API__ `objectNormalize`

//
AttributeUpdate.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.attribute[0], AttributeUpdate.prototype.schema);

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
AttributeUpdate.prototype.dbRead = function (raw) {
    return {};
};
AttributeUpdate.prototype.dbTable = 'attribute_updates';

AttributeUpdate.prototype.dbFields = [
    'attribute_id',
    'timestamp',
];

//
//__API__ `dbSave`
//
AttributeUpdate.prototype.dbSave = function (trs) {

    let params = {
        value : trs.asset.attribute[0].value,
        timestamp : trs.timestamp,
        expire_timestamp : trs.asset.attribute[0].expire_timestamp,
        associations : trs.asset.attribute[0].associations,
        id:trs.asset.attribute[0].attributeId
    };

    library.db.query(sql.AttributesSql.updateAttribute, params).then(function (err) {
    });

    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            attribute_id : trs.asset.attribute[0].attributeId,
            timestamp: trs.timestamp
        }
    };
};

//
//__API__ `ready`

//
AttributeUpdate.prototype.ready = function (trs, sender) {
   return true;
};

// Export
module.exports = AttributeUpdate;
