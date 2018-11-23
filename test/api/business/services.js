'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('../../node.js');
let sleep = require('sleep');
let messages = require('../../../helpers/messages.js');
let constants = require('../../../helpers/constants.js');
let slots = require('../../../helpers/slots.js');
let xlsx = require('xlsx');
let _ = require('lodash')

// TEST DATA

const PROVIDER = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
const NAME = 'serviceName';
const SECRET = "blade early broken display angry wine diary alley panda left spy woman";
const PUBLIC_KEY = '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6';

const SERVICE_NAME = 'serviceName';
const DESCRIPTION = 'description';

// RESULTS

const SUCCESS = 'success';
const ERROR = 'error';
const COUNT = 'count';
const TRUE = true;
const FALSE = false;

const SLEEP_TIME = 10001; // in milliseconds
let reportData = [];
let transactionList = [];

// TESTS

describe('Send Funds', function () {

    // this test is only used to generate the public key for the provider account, it is not supposed to actually send the amount
    it('Send funds - placeholder to generate public key', function (done) {
        let amountToSend = 10000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY,
            signature: '3045022100dacea735ccec2b4446b66a34bdb2e07e1253df8c95035535cfb37b84d2ba1d600220658893865a07d428dc8fbef2a6ab8936b9f04c8d2cf34cb59db020c8386d195b',
            secret: SECRET,
            amount: amountToSend,
            recipientId: PROVIDER
        }, function (err, res) {
            transactionList.push({
                'sender': PROVIDER,
                'recipient': PROVIDER,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            done();
        });
    });
});

describe('Get Services', function () {

    it('List Services - no results', function (done) {
        listServices(function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(0);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            done();
        });
    });
});
describe('Create Service', function () {

    it('Create Service - Simple', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let request = createServiceRequest();

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(PROVIDER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.createservice);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createservice);
            });
            done();
        });
    });

    it('Get Services by provider - 1 result', function (done) {
        getServices({provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('Get Services by name - 1 result', function (done) {
        getServices({name: NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('Get Services attribute types', function (done) {
        getServiceAttributeTypes({name: NAME, provider : PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.service_attribute_types).to.have.length(12);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(12);
            done();
        });
    });
});
// Utilities

function createServiceRequest(param) {
    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.service = {};
    request.asset.service.name = param.name ? param.name : SERVICE_NAME;
    request.asset.service.description = param.description ? param.description : DESCRIPTION;
    request.asset.service.provider = param.provider ? param.provider : PROVIDER;

    console.log(JSON.stringify(request));
    return request;
}

function listServices(done) {
    let url = '/api/services/list';
    node.get(url, done);
}

function getServices(params, done) {

    let url = '/api/services/';
    if (params.name || params.provider || params.status) {
        url += '?';
    }
    if (params.name) {
        url += 'name=' + '' + params.name;
    }
    if (params.provider) {
        url += 'provider=' + '' + params.provider;
    }
    if (params.status) {
        url += 'status=' + '' + params.status;
    }
    node.get(url, done);
}

function getServiceAttributeTypes(params, done) {

    if (!params.name || !params.provider) {
        done();
    }

    let url = '/api/services/attributetypes';
    url += '?name=' + '' + params.name + '&provider='+''+params.provider;
    node.get(url, done);
}

function putTransaction(params, done) {
    node.put('/api/transactions', params, done);
}

function postService(params, done) {
    node.post('/api/services', params, done);
}

function getBalance(address, done) {
    node.get('/api/accounts/getBalance?address=' + address, done);
}
