'use strict';

var constants = require('../helpers/constants.js');
let sql = require('../sql/business/attributes.js');

// Private fields
var modules, library;

// Constructor
function AttributeShare() {
}

// Public methods
//
//__API__ `bind`

//
AttributeShare.prototype.bind = function (scope) {
    modules = scope.modules;
    library = scope.library;
};

//
//__API__ `create`

//
AttributeShare.prototype.create = function (data, trs) {
    trs.recipientId = null;
    trs.amount = 0;
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
AttributeShare.prototype.calculateFee = function (trs) {
    return constants.fees.attributeshare;
};

//
//__API__ `verify`

//
AttributeShare.prototype.verify = function (trs, sender, cb) {

    if (trs.amount !== 0) {
        return cb('Invalid transaction amount');
    }

    if (!trs.asset || !trs.asset.share) {
        return cb('Invalid transaction asset. attributeShare is missing');
    }

    if (!trs.asset.share[0].owner) {
        return cb('Share attribute owner is undefined');
    }

    if (!trs.asset.share[0].type) {
        return cb('Share attribute type is undefined');
    }

    if (!trs.asset.share[0].applicant) {
        return cb('Share attribute applicant is undefined');
    }

    if (!trs.asset.share[0].value) {
        return cb('Share attribute value is undefined');
    }


    return cb(null, trs);

};

//
//__API__ `process`

//
AttributeShare.prototype.process = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `getBytes`

//
AttributeShare.prototype.getBytes = function (trs) {
    if (!trs.asset.share) {
        return null;
    }

    var buf;

    try {
        buf = new Buffer(trs.asset.share, 'utf8');
    } catch (e) {
        throw e;
    }

    return buf;
};

//
//__API__ `apply`


AttributeShare.prototype.apply = function (trs, block, sender, cb) {

    return cb(null, trs);
};

//
//__API__ `undo`

//
AttributeShare.prototype.undo = function (trs, block, sender, cb) {

};

//
//__API__ `applyUnconfirmed`

//
AttributeShare.prototype.applyUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

//
//__API__ `undoUnconfirmed`

//
AttributeShare.prototype.undoUnconfirmed = function (trs, sender, cb) {
    return cb(null, trs);
};

AttributeShare.prototype.objectNormalize = function (trs) {
    var report = library.schema.validate(trs.asset.share[0], AttributeShare.prototype.schema);

    if (!report) {
        throw 'Failed to validate attribute share schema: ' + this.scope.schema.getLastErrors().map(function (err) {
            return err.message;
        }).join(', ');
    }

    return trs;
};


AttributeShare.prototype.schema = {
    id: 'AttributeShare',
    type: 'object',
    properties: {
        owner: {
            type: 'string',
            format: 'address'
        },
        type: {
            type: 'string',
        },
        applicant: {
            type: 'string',
            format: 'address'
        },
        value: {
            type: 'string'
        },

    },
    required: ['owner', 'type', 'applicant', 'value']
};

//
//
//__API__ `dbRead`

//
AttributeShare.prototype.dbRead = function (raw) {
    return {};
};

AttributeShare.prototype.dbTable = 'attribute_shares';

AttributeShare.prototype.dbFields = [
    'attribute_id',
    'applicant',
    'value',
    'timestamp'
];

//
//__API__ `dbSave`

//
AttributeShare.prototype.dbSave = function (trs) {

    var params = {};
    params.id = trs.asset.attributeShareRequestId;
    params.status = constants.shareStatus.COMPLETED;

    library.db.query(sql.AttributeShareRequestsSql.updateShareRequest, params).then(function (err) {
    });


    return {
        table: this.dbTable,
        fields: this.dbFields,
        values: {
            attribute_id: trs.asset.attribute_id,
            applicant: trs.asset.share[0].applicant,
            value: trs.asset.share[0].value,
            timestamp: trs.timestamp
        }
    };
};

//
//__API__ `ready`

//
AttributeShare.prototype.ready = function (trs, sender) {
    return true;
};

// Export
module.exports = AttributeShare;
