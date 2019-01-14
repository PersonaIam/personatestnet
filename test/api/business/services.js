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

const TRANSACTION_ID = 'transactionId';
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

describe('LIST SERVICES', function () {

    it('As a PUBLIC user, I want to Get the List of Services. EXPECTED : SUCCESS. RESULT : Empty List', function (done) {
        listServices(function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(0);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            done();
        });
    });
});

describe('CREATE SERVICE', function () {

    it('As a PUBLIC user, I want to Get the List of Services which belong to a given provider. ' +
        'EXPECTED : SUCCESS. RESULT : Empty List', function (done) {
        getServices({provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(0);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            done();
        });
    });

    it('As a PROVIDER, I want to Create a new Service without specifying any description. ' +
        'EXPECTED : FAILURE. ERROR : MISSING_SERVICE_DESCRIPTION', function (done) {

        let param = {};
        param.attributeTypes = ['identity_card'];
        param.validations_required = 1;
        let request = createServiceRequest(param);

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.MISSING_SERVICE_DESCRIPTION);
            done();
        });
    });

    it('As a PROVIDER, I want to Create a new Service without specifying any attribute types. ' +
        'EXPECTED : FAILURE. ERROR : MISSING_ATTRIBUTE_TYPES', function (done) {

        let param = {};
        param.description = DESCRIPTION;
        param.validations_required = 1;
        let request = createServiceRequest(param);

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.MISSING_ATTRIBUTE_TYPES);
            done();
        });
    });

    it('As a PROVIDER, I want to Create a new Service without specifying the number of validations required. ' +
        'EXPECTED : FAILURE. ERROR : MISSING_NUMBER_OF_VALIDATIONS_REQUIRED', function (done) {

        let param = {};
        param.description = DESCRIPTION;
        param.attributeTypes = ['identity_card'];
        let request = createServiceRequest(param);

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.MISSING_NUMBER_OF_VALIDATIONS_REQUIRED);
            done();
        });
    });

    it('As a PROVIDER, I want to Create a new Service. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });
        let param = {};
        param.validations_required = CUSTOM_VALIDATIONS;
        param.description = DESCRIPTION;
        param.attributeTypes = ['identity_card'];
        let request = createServiceRequest(param);

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PROVIDER, I want to Create a Service which already exists. ' +
        'EXPECTED : FAILURE. ERROR : SERVICE_ALREADY_EXISTS', function (done) {

        let param = {};
        param.validations_required = CUSTOM_VALIDATIONS;
        param.description = DESCRIPTION;
        param.attributeTypes = ['identity_card'];
        let request = createServiceRequest(param);

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SERVICE_ALREADY_EXISTS);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the List of Services which belong to a given provider. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Service', function (done) {
        getServices({provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].validations_required).to.be.eq(CUSTOM_VALIDATIONS);
            done();
        });
    });

    it('As a PROVIDER, I want to Create a new Service, with a description that is too long. ' +
        'EXPECTED : FAILURE. ERROR : SERVICE_DESCRIPTION_TOO_LONG', function (done) {
        let param = {};
        param.name = SERVICE2_NAME;
        param.description = descriptionTooLong;
        param.attributeTypes = ['identity_card'];
        param.validations_required = CUSTOM_VALIDATIONS;

        let request = createServiceRequest(param);

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SERVICE_DESCRIPTION_TOO_LONG);
            done();
        });
    });

    it('As a PROVIDER, I want to Create a new Service, with a description that is of maximum length. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE2_NAME;
        param.description = descriptionMaxLength;
        param.attributeTypes = ['identity_card'];
        param.validations_required = CUSTOM_VALIDATIONS;
        let request = createServiceRequest(param);

        postService(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the List of Services that have a given name. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Service', function (done) {
        getServices({name: SERVICE_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the List of Services which belong to a given provider. ' +
        'EXPECTED : SUCCESS. RESULT : 2 Services', function (done) {
        getServices({provider : PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(2);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(2);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the List of Services that are inactive. ' +
        'EXPECTED : SUCCESS. RESULT : No results', function (done) {
        getServices({status : 'INACTIVE'}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(0);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the List of Services that are active. ' +
        'EXPECTED : SUCCESS. RESULT : 2 results', function (done) {
        getServices({status : 'ACTIVE'}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(2);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(2);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the Attribute Types for a given service. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result', function (done) {
        getServiceAttributeTypes({provider : PROVIDER, name : SERVICE_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('service_attribute_types');
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the Attribute Types for a service that does not exist. ' +
        'EXPECTED : FAILURE. ERROR : SERVICE_NOT_FOUND', function (done) {
        getServiceAttributeTypes({provider : PROVIDER, name : NON_EXISTING_SERVICE_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SERVICE_NOT_FOUND);
            done();
        });
    });

});

describe('INACTIVATE SERVICE', function () {

    it('As a PROVIDER, I want to Inactivate one of my services. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

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
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the details of an Inactive service. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Service, with INACTIVE status' , function (done) {
        getServices({name: SERVICE_NAME, provider : PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].status).to.be.eq(constants.serviceStatus.INACTIVE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });

    });

    it('As a PUBLIC user, I want to Get the List of Services that are inactive. ' +
        'EXPECTED : SUCCESS. RESULT : 1 result', function (done) {
        getServices({status : 'INACTIVE'}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the List of Services that inactive and belong to a given provider. ' +
        'EXPECTED : SUCCESS. RESULT : 1 result', function (done) {
        getServices({status : 'INACTIVE', provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the List of Services that inactive and belong to a given provider. ' +
        'EXPECTED : SUCCESS. RESULT : 1 result', function (done) {
        getServices({status : 'ACTIVE', provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('As a PROVIDER, I want to Inactivate a service that does not exist. ' +
        'EXPECTED : FAILURE. ERROR : SERVICE_NOT_FOUND', function (done) {

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

    it('As a PROVIDER, I want to Inactivate a service that is already INACTIVE. ' +
        'EXPECTED : FAILURE. ERROR : SERVICE_IS_ALREADY_INACTIVE', function (done) {

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
    request.asset.service.provider = param.provider ? param.provider : PROVIDER;
    if (param.description) {
        request.asset.service.description = param.description;
    }
    if (param.validations_required) {
        request.asset.service.validations_required = param.validations_required;
    }
    if (param.attributeTypes) {
        request.asset.service.attributeTypes = param.attributeTypes;
    }

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

    let url = '/api/services';
    if (params.name || params.provider || params.status) {
        url += '?';
    }
    if (params.name) {
        url += 'name=' + '' + params.name;
    }
    if (params.provider) {
        url += '&provider=' + '' + params.provider;
    }
    if (params.status) {
        url += '&status=' + '' + params.status;
    }
    node.get(url, done);
}

function getServiceAttributeTypes(params, done) {

    let url = '/api/services/attributeTypes';
    if (params.name || params.provider) {
        url += '?';
    }
    if (params.name) {
        url += '&name=' + '' + params.name;
    }
    if (params.provider) {
        url += '&provider=' + '' + params.provider;
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
