'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('../../node.js');
let sleep = require('sleep');
let messages = require('../../../helpers/messages.js');
let constants = require('../../../helpers/constants.js');

// TEST DATA

const OWNER_FAUCET = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
const SECRET_FAUCET = "blade early broken display angry wine diary alley panda left spy woman";
const PUBLIC_KEY_FAUCET = '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6';

const PROVIDER = 'LTAAFiSnPSsZXnNPGD6dg7cfy2gm4o6Fu7';
const SECRET = "blade early broken display angry wine diary alley panda left spy woman";
const PUBLIC_KEY = '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6';

const NON_EXISTING_SERVICE_NAME = 'gonzo';
const SERVICE_NAME = 'firstService';
const SERVICE2_NAME = 'secondService';
const DESCRIPTION = 'description';
const CUSTOM_VALIDATIONS = 2;

// RESULTS

const SUCCESS = 'success';
const ERROR = 'error';
const COUNT = 'count';
const TRUE = true;
const FALSE = false;

const SLEEP_TIME = 10001; // in milliseconds
let transactionList = [];

let maxLength = 2048;
let descriptionMaxLength = new Array(1 + maxLength).join('x');
let descriptionTooLong = new Array(1 + maxLength + 1).join('x');

// TESTS

describe('Send Funds', function () {

    // this test is only used to generate the public key for the provider account, it is not supposed to actually send the amount
    it('Send funds - placeholder to generate public key', function (done) {
        let amountToSend = 10000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: PROVIDER
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
                'recipient': PROVIDER,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            sleep.msleep(SLEEP_TIME);
            done();
        });
    });
});

describe('List Services', function () {

    it('No results', function (done) {
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

    it('Get Services by provider - no results', function (done) {
        getServices({provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(0);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            done();
        });
    });

    it('SUCCESS -> Service does not already exist', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });
        let param = {};
        param.validations = CUSTOM_VALIDATIONS;
        let request = createServiceRequest(param);

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

    it('FAILURE -> Service already exists for provider', function (done) {

        let request = createServiceRequest();

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SERVICE_ALREADY_EXISTS);
            done();
        });
    });

    it('Get Services by provider - 1 result', function (done) {
        getServices({provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].validations_required).to.be.eq(CUSTOM_VALIDATIONS);
            done();
        });
    });

    it('FAILURE -> Service description is too long', function (done) {
        let param = {};
        param.name = SERVICE2_NAME;
        param.description = descriptionTooLong;

        let request = createServiceRequest(param);

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SERVICE_DESCRIPTION_TOO_LONG);
            done();
        });
    });

    it('SUCCESS -> Second service for a given provider, with description of max length (2048)', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE2_NAME;
        param.description = descriptionMaxLength;
        let request = createServiceRequest(param);

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

    it('Get Services by name - 1 result', function (done) {
        getServices({name: SERVICE_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('Get Services by provider - 2 results', function (done) {
        getServices({provider : PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(2);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(2);
            done();
        });
    });

});

describe('Inactivate Service', function () {

    it('SUCCESS -> Service was previously active', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.name = SERVICE_NAME;
        params.provider = PROVIDER;

        let request = inactivateServiceRequest(params);

        putInactivateService(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);

            getBalance(PROVIDER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.inactivateservice);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.inactivateservice);
            });

            done();
        });
    });

    it('Get Service - Service is inactive, immediately after Inactivation' , function (done) {
        getServices({name: SERVICE_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].status).to.be.eq(constants.serviceStatus.INACTIVE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('FAILURE -> Service does not exist', function (done) {

        let params = {};
        params.name = NON_EXISTING_SERVICE_NAME;
        params.provider = PROVIDER;

        let request = inactivateServiceRequest(params);

        putInactivateService(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SERVICE_NOT_FOUND);
            done();
        });
    });

    it('FAILURE -> Service is already inactive', function (done) {

        let params = {};
        params.name = SERVICE_NAME;
        params.provider = PROVIDER;

        let request = inactivateServiceRequest(params);

        putInactivateService(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SERVICE_IS_ALREADY_INACTIVE);
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
    request.asset.service.validations_required = param.validations ? param.validations : 1;
    request.asset.service.attributeTypes = ['identity_card'];

    console.log(JSON.stringify(request));
    return request;
}

function inactivateServiceRequest(param) {
    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.service = {};
    request.asset.service.name = param.name ? param.name : SERVICE_NAME;
    request.asset.service.provider = param.provider ? param.provider : PROVIDER;
    console.log(JSON.stringify(request));
    return request;
}

// Requests

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

function putTransaction(params, done) {
    node.put('/api/transactions', params, done);
}

function postService(params, done) {
    node.post('/api/services', params, done);
}

function putInactivateService(params, done) {
    node.put('/api/services/inactivate', params, done);
}

function getBalance(address, done) {
    node.get('/api/accounts/getBalance?address=' + address, done);
}
