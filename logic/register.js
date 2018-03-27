'use strict';

var constants = require('../helpers/constants.js');
var crypto = require("crypto");

// Private fields
var self, modules, library;

// Constructor
function Register () {
	self = this;
}


// Public methods
//
//__API__ `bind`

//
Register.prototype.bind = function (scope) {
	modules = scope.modules;
	library = scope.library;
};

//
//__API__ `create`

//
Register.prototype.create = function (data, trs) {
    trs.asset.id = data.id
    trs.asset.owner = data.owner;
    trs.asset.type= data.type;
	trs.asset.data = data.data;
	trs.asset.format = data.format;
	trs.asset.dataSig = data.dataSig;

	return trs;
};

//
//__API__ `calculateFee`

//
Register.prototype.calculateFee = function (trs) {
	return constants.fees.register;
};

//
//__API__ `verify`

//
Register.prototype.verify = function (trs, sender, cb) {

	if (trs.recipientId) {
		return cb('Invalid recipient');
	}

	if (trs.amount !== 0) {
		return cb('Invalid transaction amount');
	}

	if (!trs.asset || !trs.asset.id || trs.asset.type == null || !trs.asset.data || !trs.asset.format || !trs.asset.dataSig) {
		return cb('Invalid transaction asset');
	}

	// verifiy data length !!
	if(trs.asset.data.length > 100) {
		return cb('Data too long');
	}

	if(trs.asset.format.length > 36) {
		return cb('Data too long');
	}

	// verify id
	var data = {
		type: trs.asset.type,
		data: trs.asset.data,
		format: trs.asset.format,
		dataSig: trs.asset.dataSig
	};

	var hmac = crypto.createHmac('sha256', trs.senderPublicKey);
	hmac.update(JSON.stringify(data));
	var id = hmac.digest('hex');

	if (trs.asset.id !== id) {
		return cb('Invalid ID');
	}

	// no double entries
	modules.identity.getIdForAddress(trs.senderId, function(err, ids) {
		if(err) {
			return cb(err);
		}

		var found = ids.fragments.find(function(elem) {
			return elem.id == id;
		});

		if(found)
			return cb("Can`t add the same ID twice");

		return cb(null, trs);
	});
};

//
//__API__ `process`

//
Register.prototype.process = function (trs, sender, cb) {

	// trs.recipientId = self.generateAddress(trs)

	return cb(null, trs);
};

//
//__API__ `getBytes`

//
Register.prototype.getBytes = function (trs) {
	var buf;

	try {     
        var idBuff = Buffer.from(trs.asset.id, "hex");
        var typeBuff = Buffer.from([trs.asset.type]);
		var dataBuff = Buffer.from(trs.asset.data, "utf8");
		var formatBuff = Buffer.from(trs.asset.format, "utf8");
		var dataSigBuff = Buffer.from(trs.asset.dataSig, "hex");

        buf = Buffer.concat([idBuff, typeBuff, dataBuff,formatBuff, dataSigBuff], idBuff.length + typeBuff.length + dataBuff.length + formatBuff.length + dataSigBuff.length);
	} catch (e) {
		throw e;
	}

	return buf;
};

//
//__API__ `apply`

//
Register.prototype.apply = function (trs, block, sender, cb) {
	return cb();
};


//
//__API__ `undo`

//
Register.prototype.undo = function (trs, block, sender, cb) {
	return cb();
};

//
//__API__ `applyUnconfirmed`

//
Register.prototype.applyUnconfirmed = function (trs, sender, cb) {

	// should check address that comtract is not already deployed

	return cb();
};

//
//__API__ `undoUnconfirmed`

//
Register.prototype.undoUnconfirmed = function (trs, sender, cb) {
	return cb();
};

// asset schema
Register.prototype.schema = {
	id: 'Register',
	type: 'object',
	properties: {
        id: {
			type: 'string'
		},
        type :{
            type: 'integer'
        },
		data: {
			type: 'string'
		},
		format: {
			type: 'string'
		},
		dataSig: {
            type: 'string',
			format: 'signature'
        }
	},
	required: ['id', 'type', 'data', 'format', 'dataSig']
};

//
//__API__ `objectNormalize`

//
Register.prototype.objectNormalize = function (trs) {
	var report = library.schema.validate(trs.asset, Register.prototype.schema);

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
Register.prototype.dbRead = function (raw) {

	if (!raw.data) {
		return null;
	} else {
		return {
            id: raw.id,
            owner: raw.owner,
            type: raw.type,
			data: raw.data,
			format: raw.format,
			dataSig: raw.dataSig,
            transactionId: raw.transactionId
        };
	}
};

Register.prototype.dbTable = 'identity';

Register.prototype.dbFields = [
	'id',
    'owner',
    'type',
	'data',
	'format',
	'dataSig',
    'transactionId'
];

//
//__API__ `dbSave`

//
Register.prototype.dbSave = function (trs) {
	return {
		table: this.dbTable,
		fields: this.dbFields,
		values: {
            id: trs.asset.id,
            owner: trs.senderId,
            type: trs.asset.type,
			data: trs.asset.data,
			format: trs.asset.format,
			dataSig: trs.asset.dataSig,
			transactionId: trs.id
		}
	};
};

//
//__API__ `ready`

//
Register.prototype.ready = function (trs, sender) {
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
module.exports = Register;
