'use strict';

const appRoot = require('app-root-path');
const async = require('async');
const schema = require('../schema/ipfs.js');
const Router = require('../helpers/router.js');
const slots = require('../helpers/slots.js');
const sql = require('../sql/ipfs.js');
const {join} = require('path');
const fs = require('fs-extra');
const IPFS = require('go-ipfs-dep');
const IPFSApi = require('ipfs-api');
const IPFSFactory = require('ipfsd-ctl');
const differenceWith= require('lodash/differenceWith');

const IPFS_FACTORY_OPTIONS = {
    type: 'go',
    IpfsApi: IPFSApi,
    Bootstrap: [],
};

const IPFS_PATH = join(appRoot.path, '.ipfs-repo');

const IPFS_DAEMON_CONFIG = {
    init: false,
    start: false,
    disposable: false,
    defaultAddrs: true,
    repoPath: IPFS_PATH,
    Bootstrap: [],
};

const IPFS_DAEMON_INITIALIZATION_CONFIG = {
    directory: IPFS_PATH,
    keysize: 4096,
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
        'get /': 'getIpfsNodeInfo',
        'get /net': 'getIpfsNetwork',
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

__private.cleanLocks = function (cb) {
    // This fixes a bug on Windows, where the daemon seems
    // not to be exiting correctly, hence the file is not
    // removed.
    const lockPath = join(IPFS_PATH, 'repo.lock');
    const apiPath = join(IPFS_PATH, 'api');

    if (fs.existsSync(lockPath)) {
        try {
            fs.unlinkSync(lockPath)
        } catch (_) {
            console.warn('Could not remove repo.lock. Daemon might be running')
        }
    }

    if (fs.existsSync(apiPath)) {
        try {
            fs.unlinkSync(apiPath)
        } catch (_) {
            console.warn('Could not remove api. Daemon might be running')
        }
    }

    cb();
};

__private.startIpfsDaemon = function () {
    self.ipfsDaemon.start(function (err) {
        if (err) {
            console.log('Error starting IPFS Daemon - ' + err)
            return err;
        }
        else {
            library.logger.info("# IPFS daemon started");
            library.bus.message('IpfsStarted');
            self.ipfsDaemon.api.bootstrap.rm({all: true});
        }
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
            } else {
                data = {
                    queuedHash: ipfsHash,
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

__private.getPeerIpfsAddresses = function (peer, cb) {
    modules.transport.requestFromPeer(
        peer,
        {
            url: '/api/ipfs',
            method: 'GET',
            schema: schema.getIpfsNodeInfoResponse,
        },
        function (err, res) {
            if (err) return cb(err);

            return cb(null, res);
        }
    );
};

__private.bootstrapAddress = function (address, cb) {
    try {
        self.ipfsDaemon.api.bootstrap.add(address, (err) => {
            if (err) return cb(err);

            library.logger.info('# ' + address + ' bootstrap success');

            self.ipfsDaemon.api.swarm.connect(address, (err) => {
                if (err) {
                    library.logger.info('# ' + err.message);
                    self.ipfsDaemon.api.bootstrap.rm(address, (err, res) => library.logger.info('# ' + address + ' remove from bootstrap success'));
                    return cb(err);
                }

                library.logger.info('# ' + address + ' connected success');

                cb(null, address);
            });
        });
    }
    catch (e) {
        cb(e);
    }
};

__private.connectToAddresses = function (addresses, cb) {
    self.ipfsDaemon.api.bootstrap.list((err, bootstrappedAddresses) => {
        try {
            if (err) return cb(err);

            const { Peers } = bootstrappedAddresses;

            // Filter existing addresses, add only new ones to ipfs bootstrap
            const newAddresses = differenceWith(addresses, Peers, (address, peer) => address === peer);


            if (newAddresses.length) {
                const bootstrapTasks = newAddresses
                    .map(address => (callback) => __private.bootstrapAddress(address, callback ));

                async.parallel(
                    bootstrapTasks,
                    (err, results) => {
                        if (err) return cb(err);

                        cb(null, results);
                    },
                )
            }
        }
        catch (e) {
            cb(e);
        }
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

shared.getIpfsNodeInfo = function (req, cb) {
    library.schema.validate(req.body, schema.getIpfsNodeInfo, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        self.ipfsDaemon.api.id(function (err, data) {
            if (err) return (cb(err.message, null));

            return cb(null, data);
        });
    });
};

shared.getIpfsNetwork = function (req, cb) {
    self.ipfsDaemon.api.swarm.peers((err, peers) => {
        if (err) return cb(err);

        cb(null, peers);
    })
};

//
//__EVENT__ `onStartIpfs`
IPFSModule.prototype.onStartIpfs = function () {
    // Spawn an IPFS daemon
    __private.cleanLocks(function () {
        self.ipfsFactory.spawn(IPFS_DAEMON_CONFIG, (error, ipfsDaemon) => {
            if (error) {
                console.log(error);
                return error;
            }

            self.ipfsDaemon = ipfsDaemon;

            if (!self.ipfsDaemon.initialized) {
                self.ipfsDaemon.init(IPFS_DAEMON_INITIALIZATION_CONFIG, function (err) {
                    if (err) {
                        console.log(err);
                        return err;
                    }

                    fs.copySync(`${appRoot.path}/swarm.key`, `${IPFS_PATH}/swarm.key`);
                    __private.startIpfsDaemon();
                })
            }
            else {
                __private.startIpfsDaemon();
            }
        });
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
        __private.cleanLocks(function () {
            self.ipfsDaemon.stop();
        });
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

IPFSModule.prototype.accept = function (peer) {
    __private.getPeerIpfsAddresses(peer, function (err, res) {
        try {
            if (err) {
                library.logger.error(err.message);
                return;
            }

            const {body: {addresses}} = res;

            __private.connectToAddresses(addresses, function (err) {
                if (err) {
                    library.logger.error(err.message);
                }
            });
        }
        catch (e) {
            library.logger.error(err.message ? err.message : err);
        }
    });
};

// Export
module.exports = IPFSModule;
