var fs = require('fs');
var path = require('path');
var personajs = require('personajs');
var crypto = require('crypto');
var bip39 = require('bip39');
var ByteBuffer = require('bytebuffer');
var bignum = require('../helpers/bignum.js');
var Crypto = require('../helpers/crypto.js');
var networks = require('../networks.json');
var vorpal = require('vorpal')();
var request = require("request");
var colors = require("colors");
var async = require("async");


// e.g.
// {
//     nethash: "5ceaa37839023de939cfd5702584aaac09e37a904dad49c8d928b6770019a8b5",
//     server: "5.135.75.64:4101",
//     network: "testnet",
//     accounts: [
//         { address: "Aoasdk8wehw98eve8fvwr", amount: 13940327 },
//         { address: "A12lknlkh23902h3n4l2234", amount: 1000000000 }
//     ]
// }

var networks = {
    testnet: {
        nethash: "5ceaa37839023de939cfd5702584aaac09e37a904dad49c8d928b6770019a8b5",
        peers: [
            "5.135.75.64:4101",
            "5.135.75.65:4101",
            "5.135.75.66:4101",
            "5.135.75.67:4101",
            "5.135.75.68:4101"
        ]
    },
    localnet: {
        nethash: "527df5a4bf0fbd0dbe4b6c0a255c14a8451f4f3144afdf82bcb65b68ff963114",
        peers: [
            "127.0.0.1:4100"
        ]
    }

};

var network = null;
var server = null;
var nethash = null;

vorpal
    .command('send <file>', 'Sends tokens to the accounts listed in the provided file')
    .action(function (args, callback) {
        var self = this;

        var file = args.file;
        var payload = null;

        if (fs.existsSync(file)) {
            payload = JSON.parse(fs.readFileSync(file));
        } else {
            self.log("Could not find file");
            return callback();
        }

        network = payload.network;
        network = networks[network];

        if(!network){
            self.log("Network not found");
            return callback();
        }

        var accounts = payload.accounts;
        var total = 0;
        var transactions = [];

        accounts.forEach(function(account) {
            total += account.amount;
        });

        connect2network(network, function () {

            personajs.crypto.setNetworkVersion(network.config.version);

            self.prompt({
                type: 'confirm',
                name: 'continue',
                default: false,
                message: "You are sending a total of: " + total + "PRS."
            }, function (result) {
                if (result.continue) {

                    getAccount(self, function (sender) {
                        if (!sender.passphrase) {
                            self.log("Could not get passphrase");
                            return callback();
                        }

                        var passphrase = sender.passphrase;

                        accounts.forEach(function (account) {
                            var tx = personajs.transaction.createTransaction(account.address, account.amount, null, passphrase);

                            postTransaction(self, tx, function (err, response, body) {
                                if (err) {
                                    self.log("Failed to send transaction: " + err);
                                }
                                else if (body.success) {
                                    self.log("Transaction sent successfully with id " + tx.id);
                                }
                                else {
                                    self.log("Failed to send transaction: " + body.error);
                                }
                            });
                        });
                    });
                } else {
                    self.log("Aborted");
                }
            });
        });
    });

vorpal
    .delimiter('distrib>')
    .show();

function findEnabledPeers(cb) {
    var peers = [];
    getFromNode('http://' + server + '/peer/list', function (err, response, body) {

        if (err) {
            vorpal.log(colors.red("Can't get peers from network: " + err));
            return cb(peers);
        }
        else {
            var respeers = JSON.parse(body).peers.map(function (peer) {
                return peer.ip + ":" + peer.port;
            }).filter(function (peer) {
                return peer.status == "OK";
            });
            async.each(respeers, function (peer, cb) {
                getFromNode('http://' + peer + '/api/blocks/getHeight', function (err, response, body) {
                    if (body != "Forbidden") {
                        peers.push(peer);
                    }
                    cb();
                });
            }, function (err) {
                return cb(peers);
            });
        }
    });
}

function connect2network(n, callback) {
    server = n.peers[Math.floor(Math.random() * 1000) % n.peers.length];
    findEnabledPeers(function (peers) {
        if (peers.length > 0) {
            server = peers[0];
            n.peers = peers;
        }
    });

    getFromNode('http://' + server + '/api/loader/autoconfigure', function (err, response, body) {
        if (!body) connect2network(n, callback);
        else {
            n.config = JSON.parse(body).network;
            vorpal.log(n.config);
            callback();
        }
    });
}

function getFromNode(url, cb) {
    nethash = network ? network.nethash : "";
    request(
        {
            url: url,
            headers: {
                nethash: nethash,
                version: '1.0.0',
                port: 1
            },
            timeout: 5000
        },
        cb
    );
}

function getAccount(container, cb) {

    container.prompt({
        type: 'password',
        name: 'passphrase',
        message: 'passphrase: ',
    }, function (result) {
        if (result.passphrase) {
            return cb({
                passphrase: result.passphrase,
            });
        } else {
            return cb("Aborted.");
        }
    });
}

function postTransaction(container, transaction, cb) {
    var performPost = function () {
        request({
            url: 'http://' + server + '/peer/transactions',
            headers: {
                nethash: network.nethash,
                version: '1.0.0',
                port: 1
            },
            method: 'POST',
            json: true,
            body: { transactions: [transaction] }
        }, cb);
    };

    let senderAddress = personajs.crypto.getAddress(transaction.senderPublicKey);
    getFromNode('http://' + server + '/api/accounts?address=' + senderAddress, function (err, response, body) {
        if (!body) {
            performPost();
        } else {
            body = JSON.parse(body);
            if (body.account.secondSignature) {
                container.prompt({
                    type: 'password',
                    name: 'passphrase',
                    message: 'Second passphrase: ',
                }, function (result) {
                    if (result.passphrase) {
                        var secondKeys = personajs.crypto.getKeys(result.passphrase);
                        personajs.crypto.secondSign(transaction, secondKeys);
                        transaction.id = personajs.crypto.getId(transaction);
                        performPost();
                    } else {
                        vorpal.log('No second passphrase given. Trying without.');
                        performPost();
                    }
                });
            } else {
                performPost();
            }
        }
    });
}
