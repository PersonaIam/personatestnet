'use strict';

const schema = require('../schema/ipfs.js');
const slots = require('../helpers/slots.js');
const sql = require('../sql/ipfs.js');
const Router = require('../helpers/router.js');
const IPFS = require('ipfs');
const IPFSFactory = require('ipfsd-ctl');
const IPFS_FACTORY_OPTIONS = {
    type: 'js',
};

// Private fields
let modules, library, self, shared = {};

let __private = {};

// Constructor
function IPFSModule(cb, scope) {
    library = scope;
    self = this;
    self.ipfsFactory = IPFSFactory.create(IPFS_FACTORY_OPTIONS);

    return cb(null, self);
}

// Private methods
__private.attachApi = function () {
    const router = new Router();

    router.use(function (req, res, next) {
        if (modules) {
            return next();
        }
        res.status(500).send({success: false, error: 'Blockchain is loading'});
    });

    router.map(shared, {
        'get /fileByHash': 'getFileFromIpfs',
        'post /': 'addFilesToIpfs',
    });

    router.use(function (req, res) {
        res.status(500).send({success: false, error: 'API endpoint not found'});
    });

    library.network.app.use('/api/ipfs', router);
    library.network.app.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }
        library.logger.error('API error ' + req.url, err);
        res.status(500).send({success: false, error: 'API error: ' + err.message});
    });
};

__private.addFilesOnIpfs = function (files, cb) {
    try {
        const {path, content} = files;

        self.ipfsDaemon.api.files.add({path, content: Buffer.from(content)}, (err, filesAdded) => {
            if (err) throw err;

            library.logger.info('# Files added to IPFS');

            const hash = filesAdded[0].hash;

            __private.addHashToQueue(hash, function (error, data) {
                if (error) throw error;

                library.logger.info(`# ${data.queuedHash} added in queue`);

                return (cb(null, {hash: data.queuedHash}));
            });
        });
    }
    catch (error) {
        return (cb(error.message, null));
    }
};

__private.addHashToQueue = function (ipfsHash, cb) {
    let params = {};
    params.ipfsHash = ipfsHash;
    params.timestamp = slots.getTime();

    library.db.query(sql.IpfsSql.insert, params)
        .then(function (rows) {

            let data = {};
            if (rows.length > 0) {
                data = {
                    queuedHash: rows[0].ipfs_hash,
                };
            }

            return cb(null, data);
        }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('IPFS Queue insert error');
    })
};

__private.getHashFromQueue = function (ipfsHash, cb) {
    library.db.query(sql.IpfsSql.getHashFromQueue, {ipfsHash})
        .then(function (rows) {
            let data = {};

            if (rows.length > 0) {
                data = {
                    id: rows[0].id,
                    hash: rows[0].ipfs_hash,
                };
            }

            return cb(null, data);
        }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('IPFS Queue get error');
    })
};

__private.removeHashFromQueue = function (id, cb) {
    library.db.query(sql.IpfsSql.deleteHash, {id})
        .then(function (rows) {
            return cb(null, rows);
        }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb('IPFS Queue delete error');
    })
};

__private.pin = function (hash, cb) {
    self.ipfsDaemon.api.pin.add(hash, (err, hashAdded) => {
        if (err) cb(err.message);

        library.logger.info('# Files pinned to IPFS');

        cb(null, hashAdded[0].hash);
    });
};

__private.getFile = function (hash, cb) {
    self.ipfsDaemon.api.files.cat(hash, (err, file) => {
        if (err) return cb(err);

        const fileData = file.toString();

        return cb(null, {fileData});
    });
};

//
//__API__ `addFilesToIpfs`
shared.addFilesToIpfs = function (req, cb) {
    library.schema.validate(req.body, schema.addFilesToIpfs, function (err) {
        if (err) return cb(err[0].message);

        __private.addFilesOnIpfs(req.body.files, function (error, data) {
            if (error) return (cb(error, null));

            return cb(null, data);
        });
    });
};

//
//__API__ `getFileFromIpfs`
shared.getFileFromIpfs = function (req, cb) {
    library.schema.validate(req.body, schema.getFileFromIpfs, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getFile(req.body.hash, function (error, data) {
            if (error) return (cb(error.message, null));

            return cb(null, data);
        });
    });
};

//
//__EVENT__ `onStartIpfs`
IPFSModule.prototype.onStartIpfs = function () {
    // Spawn an IPFS daemon
    self.ipfsFactory.spawn((error, ipfsDaemon) => {
        if (error) console.log(error);

        self.ipfsDaemon = ipfsDaemon;

        library.logger.info("# IPFS daemon started");
        library.bus.message('IpfsStarted');
    });
};

//
//__EVENT__ `onBind`
IPFSModule.prototype.onBind = function (scope) {
    modules = scope;
};

//
//__EVENT__ `onAttachPublicApi`
IPFSModule.prototype.onAttachPublicApi = function () {
    __private.attachApi();
};

// This is strategic to stop daemon on process exit
IPFSModule.prototype.cleanup = function (cb) {
    if (self.ipfsDaemon) {
        library.logger.info('# Stopping IPFS daemon');
        self.ipfsDaemon.stop();
    }

    return cb();
};

IPFSModule.prototype.apply = function (queuedHash, cb) {
    __private.getHashFromQueue(queuedHash, function (error, res) {
        if (error) cb(error, null);

        const {id, hash} = res;

        __private.pin(hash, function (err) {
            if (err) cb(err, null);

            __private.removeHashFromQueue(id, function (err, res) {
                if (err) cb(err, null);

                cb(null, res);
            });
        });
    });
};

// Export
module.exports = IPFSModule;
