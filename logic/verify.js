'use strict';

var constants = require('../helpers/constants.js');

// Private fields
var self, modules, library;

// Constructor
function Verify () {
	self = this;
}


// Public methods
//
//__API__ `bind`

//
Verify.prototype.bind = function (scope) {
	modules = scope.modules;
	library = scope.library;
};

//
//__API__ `create`

//
Verify.prototype.create = function (data, trs) {
    trs.asset.dataId = data.dataId
    trs.asset.owner = data.owner;
    trs.asset.verifier= data.verifier;
    trs.asset.signature = data.signature;

	return trs;
};

//
//__API__ `calculateFee`

//
Verify.prototype.calculateFee = function (trs) {
	return constants.fees.Verify;
};

//
//__API__ `verify`

//
Verify.prototype.verify = function (trs, sender, cb) {

	// var isAddress = /^[1-9A-Za-z]{1,35}$/g;
	// if (!trs.recipientId || !isAddress.test(trs.recipientId)) {
	// 	return cb('Invalid recipient');
	// }

	// if(trs.recipientId != this.generateAddress(trs))
	// {
	// 	return cb('Invalid contract address');
	// }

	return cb(null, trs);
};

//
//__API__ `process`

//
Verify.prototype.process = function (trs, sender, cb) {

	// trs.recipientId = self.generateAddress(trs)

	return cb(null, trs);
};

//
//__API__ `getBytes`

//
Verify.prototype.getBytes = function (trs) {
	var buf;

	try {     
        var dataIdBuff = Buffer.from(trs.asset.dataId, "utf8");
        var ownerBuff = Buffer.from(trs.asset.owner, "utf8");
        var verifierBuff = Buffer.from(trs.asset.verifier, "utf8");
        var signatureBuff = Buffer.from(trs.asset.signature, "utf8");

        buf = Buffer.concat([dataIdBuff, ownerBuff, verifierBuff, signatureBuff], dataIdBuff.length + ownerBuff.length + verifierBuff.length + signatureBuff.length);
	} catch (e) {
		throw e;
	}

	return buf;
};

//
//__API__ `apply`

//
Verify.prototype.apply = function (trs, block, sender, cb) {
	return cb();
};


//
//__API__ `undo`

//
Verify.prototype.undo = function (trs, block, sender, cb) {
	return cb();
};

//
//__API__ `applyUnconfirmed`

//
Verify.prototype.applyUnconfirmed = function (trs, sender, cb) {

	// should check address that comtract is not already deployed

	return cb();
};

//
//__API__ `undoUnconfirmed`

//
Verify.prototype.undoUnconfirmed = function (trs, sender, cb) {
	return cb();
};

// asset schema
Verify.prototype.schema = {
	id: 'Verify',
	type: 'object',
	properties: {
        dataId: {
			type: 'string',
            format: 'address'
		},
        owner: {
            type: 'string',
            format: 'address'
        },
        verifier: {
            type: 'string'
        },
        signature: {
            type: 'string',
			format: 'signature'
        }
	},
	required: ['dataId', 'owner', 'verifier', 'signature']
};

//
//__API__ `objectNormalize`

//
Verify.prototype.objectNormalize = function (trs) {
	var report = library.schema.validate(trs.asset, Verify.prototype.schema);

	if (!report) {
		throw 'Failed to validate vote schema: ' + this.scope.schema.getLastErrors().map(function (err) {
			return err.message;
		}).join(', ');
	}

	return trs;
};

//
//__API__ `dbRead`

//
Verify.prototype.dbRead = function (raw) {

    if (!raw.dataId) {
        return null;
    } else {
        return {
            dataId: raw.dataId,
            owner: raw.owner,
            verifier: raw.verifier,
            signature: raw.signature,
            transactionId: raw.transactionId
        };
    }
};

Verify.prototype.dbTable = 'verifications';

Verify.prototype.dbFields = [
	'dataId',
    'owner',
    'verifier',
    'signature',
    'transactionId'
];

//
//__API__ `dbSave`

//
Verify.prototype.dbSave = function (trs) {
	return {
		table: this.dbTable,
		fields: this.dbFields,
		values: {
			dataId: trs.asset.dataId,
            owner: trs.senderPublicKey,
            verifier: trs.senderPublicKey,
            signature: trs.asset.signature,
            transactionId: trs.id
		}
	};
};

//
//__API__ `ready`

//
Verify.prototype.ready = function (trs, sender) {
	if (Array.isArray(sender.multisignatures) && sender.multisignatures.length) {
		if (!Array.isArray(trs.signatures)) {
			return false;
		}
		return trs.signatures.length >= sender.multimin;
	} else {
		return true;
	}
};


// Export
module.exports = Verify;
