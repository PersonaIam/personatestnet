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

// e.g.
// {
//     nethash: "5ceaa37839023de939cfd5702584aaac09e37a904dad49c8d928b6770019a8b5",
//     server: "5.135.75.64:4101",
//     accounts: [
//         { address: "Aoasdk8wehw98eve8fvwr", amount: 13940327 },
//         { address: "A12lknlkh23902h3n4l2234", amount: 1000000000 }
//     ]
// }

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

        var accounts = payload.accounts;
        var total = 0;
        var transactions = [];

        accounts.forEach(function(account) {
            total += elem.amount;

            var tx = personajs.transaction.createTransaction(account.address, account.amount, null, passphrase);
        });

        self.prompt({
            type: 'confirm',
            name: 'continue',
            default: false,
            message: "You are sending a total of: " + total + "PRS."
        }, function (result) {
            if(result.continue) {

            } else {
                self.log("Aborted");
            }
        });
    });


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
