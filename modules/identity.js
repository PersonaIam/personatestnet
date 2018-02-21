'use strict';

var _ = require('lodash');
var async = require('async');
var BlockReward = require('../logic/blockReward.js');
var ByteBuffer = require('bytebuffer');
var constants = require('../helpers/constants.js');
var crypto = require('crypto');
var Inserts = require('../helpers/inserts.js');
var ip = require('ip');
var OrderBy = require('../helpers/orderBy.js');
var Router = require('../helpers/router.js');
var schema = require('../schema/identity.js');
var slots = require('../helpers/slots.js');
var sql = require('../sql/identity.js');
var Register = require('../logic/register.js');
var Verify = require('../logic/verify.js');
var transactionTypes = require('../helpers/transactionTypes.js');

// Private fields
var modules, library, self, __private = {}, shared = {};

__private.assetTypes = {};

function Identity(cb, scope) {
    library = scope;
    self = this;

    // register identity
    __private.assetTypes[transactionTypes.REGISTER] = library.logic.transaction.attachAssetType(
        transactionTypes.REGISTER, new Register()
    );

    // verify identity
    __private.assetTypes[transactionTypes.VERIFY] = library.logic.transaction.attachAssetType(
        transactionTypes.VERIFY, new Verify()
    );

    return cb(null, self);
}

__private.attachApi = function () {
	var router = new Router();

	router.use(function (req, res, next) {
		if (modules) { return next(); }
		res.status(500).send({success: false, error: 'Blockchain is loading'});
    });

    router.map(shared, {
        'get /get': 'getIdForAddress',
        'get /verifications': 'getVerifications'
    });

    library.network.app.use('/api/identity', router);
	library.network.app.use(function (err, req, res, next) {
		if (!err) { return next(); }
		library.logger.error('API error ' + req.url, err);
		res.status(500).send({success: false, error: 'API error: ' + err.message});
	});
}

Identity.prototype.onAttachPublicApi = function () {
    __private.attachApi();
}

// Events
//
//__EVENT__ `onBind`

//
Identity.prototype.onBind = function (scope) {
	modules = scope;

	__private.assetTypes[transactionTypes.REGISTER].bind({
		modules: modules, library: library
	});

	__private.assetTypes[transactionTypes.VERIFY].bind({
		modules: modules, library: library
	});
};

Identity.prototype.getIdForAddress = function (address, cb) {
    library.db.any(sql.getIdFragments, { address: address }).then(function (rows) {
        return cb(null, {fragments: rows});
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('Failed to get identity for address: ' + address);
    });
};

Identity.prototype.isVerified = function(data, verifier, cb) {
    library.db.any(sql.getVerificationFrom, { data: data, verifier: verifier }).then(function (row) {
        return cb(null, {verifications: row});
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('Failed to get verification for: ' + data);
    });
};

shared.getIdForAddress = function (req, cb) {

    library.schema.validate(req.body, schema.getFragments, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        modules.identity.getIdForAddress(req.body.address, cb);
    });
};

shared.getVerifications = function(req, cb) {
    library.schema.validate(req.body, schema.getVerifications, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        library.db.many(sql.getVerifications, { id: req.body.id }).then(function (rows) {
            
            var res = {
                verifications: []
            };

            if(rows.length == 0)
                return cb(null, res);

            res.owner = rows[0].owner;

            rows.forEach(function(elem) {
                res.verifications.push({
                    verifier: elem.verifier,
                    signature: elem.signature.toString('hex')
                });
            });

            return cb(null, res);
            
        }).catch(function (err) {
            library.logger.error("stack", err.stack);
            return cb('Failed to get verifications for id: ' + id);
        });
    });
};

// Export
module.exports = Identity;
