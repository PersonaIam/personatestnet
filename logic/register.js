'use strict';

var constants = require('../helpers/constants.js');

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
	trs.asset.code = data.code;

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
		buf = trs.asset.name ? new Buffer(trs.asset.name, 'utf8') : null;
	} catch (e) {
		throw e;
	}

	return buf;
};

//
//__API__ `apply`

//
Register.prototype.apply = function (trs, block, sender, cb) {
	
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
	id: 'contract',
	type: 'object',
	properties: {
		name: {
			type: 'string',
			format: 'hex'
		}
	},
	required: ['name']
};

//
//__API__ `objectNormalize`

//
Register.prototype.objectNormalize = function (trs) {
	var report = library.schema.validate(trs.asset, Contract.prototype.schema);

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

	if (!raw.name) {
		return null;
	} else {
		var name = raw.name;

		return {name: name};
	}
};

Register.prototype.dbTable = 'name';

Register.prototype.dbFields = [
	'name',
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
			name: trs.asset.name,
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


