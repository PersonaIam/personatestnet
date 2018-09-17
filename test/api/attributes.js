'use strict';
/*jslint mocha:true, expr:true */

let node = require('./../node.js');
let sleep = require('sleep');
let constants = require('../../helpers/constants.js');

const VALIDATOR = 'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';
const OWNER = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
const OTHER_OWNER = 'LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ';
const DEFAULT_CHUNK = 7;
const CHUNK = 8;
const SECRET = "blade early broken display angry wine diary alley panda left spy woman";
const PUBLIC_KEY = '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6';

let transactionList = [];
let ipfsTransaction = {};


describe('PUT /api/transactions', function () {

    it('using valid parameters should be ok', function (done) {
        let amountToSend = 10000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY,
            signature: '3045022100dacea735ccec2b4446b66a34bdb2e07e1253df8c95035535cfb37b84d2ba1d600220658893865a07d428dc8fbef2a6ab8936b9f04c8d2cf34cb59db020c8386d195b',
            secret: SECRET,
            amount: amountToSend,
            recipientId: OWNER
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER,
                'recipient': OWNER,
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

describe('GET Attribute type', function () {

    it('Attribute type', function (done) {
        getAttributeTypeByName('name', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attribute_type).to.have.property('id');
            node.expect(res.body.attribute_type).to.have.property('data_type');
            node.expect(res.body.attribute_type).to.have.property('name').to.be.eq('name');
            node.expect(res.body.attribute_type.id).to.be.at.least(1);
            done();
        });
    });
});

describe('GET Non existing attribute type', function () {

    it('Non existing attribute type', function (done) {
        getAttributeTypeByName('weight', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Failed to get attribute type : Attribute type does not exist');
            done();
        });
    });
});

describe('POST Create new attribute ( name )', function () {

    it('Create new attribute ( name )', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let request = createAttributeRequest();

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(10000);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });
});

describe('POST Create new attribute with value stored on ( name )', function () {

    it('Create new attribute with value stored on IPFS ( name )', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let params = {};
        params.type = 'identity_card';
        params.value = 'some_random_file_content';

        let request = createAttributeRequest(params);

        ipfsTransaction.req = request; // keep the original requested data

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(10000);

            ipfsTransaction.transactionId = res.body.transactionId;

            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });

            done();
        });
    });
});

describe('GET transaction and check if it contains IPFS hash ( name )', function () {

    it('Should have the IPFS hash as the attribute value ( name )', function (done) {
        node.expect(ipfsTransaction).to.have.property('transactionId').to.be.a('string');

        let transactionId = ipfsTransaction.transactionId;

        getTransaction({ id: transactionId }, function (err, res) {
            node.expect(res).to.have.property('body');
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('transaction');
            node.expect(res.body.transaction).to.have.property('asset').to.be.a('object');
            node.expect(res.body.transaction.asset).to.have.property('attribute').to.be.a('array');
            node.expect(res.body.transaction.asset.attribute).to.have.length(1);
            node.expect(res.body.transaction.asset.attribute[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.transaction.asset.attribute[0]).to.have.property('type').to.be.a('string');

            let transaction = res.body.transaction;
            let originalTransaction = ipfsTransaction.req;

            node.expect(transaction.asset.attribute[0].value !== originalTransaction.asset.attribute[0].value);

            ipfsTransaction.forged = res.body.transaction;

            done();
        });
    });
});


describe('GET Existing attribute (name)', function () {

    it('Existing attribute (name)', function (done) {
        getAttribute(OTHER_OWNER, 'name', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('JOE');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('name');
            done();
        });
    });
});

describe('GET Non existing attribute (address)', function () {

    it('Non existing attribute (address)', function (done) {
        getAttribute(OTHER_OWNER, 'address', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.eq('No attributes were found');
            done();
        });
    });
});

describe('POST Create attribute (name) for different owner', function () {

    it('Create attribute (name) for different owner', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = 'QUEEN';

        let request = createAttributeRequest(param);

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(10000);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });
});

describe('GET All existing attributes for owner', function () {

    it('All existing attributes for owner', function (done) {
        getAttributesForOwner(OTHER_OWNER, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes).to.have.length(1);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('JOE');
            done();
        });
    });
});

describe('POST Create a different attribute ( address )', function () {

    it('Create a different attribute ( address )', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = 'Denver';
        param.type = 'address';

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(10000);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });
});

describe('POST Create an attribute with non existing attribute type', function () {

    it('Create an attribute with non existing attribute type', function (done) {

        let param = {};
        param.owner = OWNER;
        param.value = 'none';
        param.type = 'no_such_attribute';

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            done();
        });
    });
});

describe('GET Existing attribute (address)', function () {

    it('Existing attribute (address)', function (done) {
        getAttribute(OWNER, 'address', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('Denver');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('address');

            done();
        });
    });
});

describe('GET All existing attributes for owner', function () {

    it('All existing attributes for owner', function (done) {
        getAttribute(OWNER, null, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes).to.have.length(3);

            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('owner').to.eq(OWNER);
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');

            node.expect(res.body.attributes[1]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[1]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[1]).to.have.property('type').to.be.a('string');

            let values = [];
            values[0] = res.body.attributes[0].value;
            values[1] = res.body.attributes[1].value;
            node.expect(values.indexOf('Denver') > -1);
            node.expect(values.indexOf('QUEEN') > -1);

            let types = [];
            types[0] = res.body.attributes[0].type;
            types[1] = res.body.attributes[1].type;
            node.expect(types.indexOf('address') > -1);
            node.expect(types.indexOf('name') > -1);


            done();
        });
    });
});

describe('GET List of attributes', function () {

    function getAttributes(done) {
        node.get('/api/attributes/list', done);
    }

    it('List of attributes', function (done) {
        getAttributes(function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('count').to.be.eq(4);
            done();
        });
    });
});

describe('POST Create an attribute validation request', function () {

    it('Create an attribute validation request', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = 'name';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            sleep.msleep(10000);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequest);
            });
            done();
        });
    });
});

describe('POST Create another attribute validation request', function () {

    it('Create another attribute validation request', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = 'address';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            sleep.msleep(10000);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequest);
            });
            done();
        });
    });
});

describe('POST Create same attribute validation request', function () {

    it('Create same attribute validation request', function (done) {

        let param = {};
        param.owner = OWNER;

        param.validator = VALIDATOR;
        param.type = 'name';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            done();
        });
    });
});

describe('GET Attribute validation request', function () {

    it('Attribute validation request', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequest(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
            // node.expect(res.body.attribute_validation_requests[0]).to.have.property('completed').to.be.eq(0);
            done();
        });
    });
});

describe('POST Create attribute validation request for non existing attribute', function () {

    it('Create attribute validation request for non existing attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.type = 'address';
        param.validator = VALIDATOR;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Attribute does not exist. Cannot create validation request');
            done();
        });
    });
});

describe('POST Create attribute validation request for existing attribute with owner as validator', function () {

    it('Create attribute validation request for existing attribute with owner as validator', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'address';
        param.validator = OWNER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Owner cannot be the validator of his own attribute');
            done();
        });
    });
});

describe('POST Create an attribute validation', function () {

    it('Create an attribute validation ', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.owner = OWNER;
        param.type = 'name';
        param.validator = VALIDATOR;
        param.chunk = CHUNK;

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            sleep.msleep(10000);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidation);
            });
            done();
        });
    });

    it('Create an attribute validation - missing chunk ', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let request = createAttributeValidation({});
        request.asset.validation[0].chunk = null;

        postAttributeValidation(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Attribute validation chunk is undefined');
            done();
        });
    });
});

describe('POST Create an attribute validation for non existing attribute validation request', function () {

    it('Create an attribute validation for non existing attribute validation request ', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.validator = VALIDATOR;
        param.type = 'name';

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Validator does not have any validation request to complete for this attribute');
            done();
        });
    });
});


describe('GET Attribute validations for validator ', function () {

    it('Attribute validation - validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;
        getAttributeValidation(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validations');
            node.expect(res.body.attribute_validations[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('attribute_validation_request_id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('chunk');
            node.expect(res.body.attribute_validations[0]).to.have.property('timestamp');
            done();
        });
    });
});

describe('GET Attribute validations for attribute ', function () {

    it('Attribute validation - attribute', function (done) {

        let param = {};
        param.type = "name";
        param.owner = OWNER;

        getAttributeValidation(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validations');
            node.expect(res.body.attribute_validations[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('attribute_validation_request_id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('chunk');
            node.expect(res.body.attribute_validations[0]).to.have.property('timestamp');
            done();
        });
    });
});

describe('GET Attribute validations for attribute without any validation requests', function () {

    it('Attribute validation - attribute without validation requests', function (done) {

        let param = {};
        param.type = "name";
        param.owner = OTHER_OWNER;

        getAttributeValidation(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('No attribute validations or requests exist for the given parameters');
            done();
        });
    });
});

describe('GET Attribute validations for attribute with validation requests but without any validations', function () {

    it('Attribute validation - attribute with validation requests but without validations', function (done) {

        let param = {};
        param.type = "address";
        param.owner = OWNER;

        getAttributeValidation(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('No attribute validations were found for the given parameters');
            done();
        });
    });
});

describe('GET Attribute validations for non existing attribute', function () {

    it('Attribute validation - non existing attribute', function (done) {

        let param = {};
        param.type = "identity_card";
        param.owner = OTHER_OWNER;

        getAttributeValidation(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('No attribute validations or requests exist for the given parameters - validator was not provided or attribute does not exist');
            done();
        });
    });
});

describe('GET Attribute validation requests', function () {

    it('Attribute validation requests - completed given validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequestsForValidator(param, 'completed' , function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('chunk').to.eq(8);
            done();
        });
    });

    it('Attribute validation requests - incomplete given validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequestsForValidator(param, 'incomplete',  function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
            done();
        });
    });

    it('Attribute validation requests - completed given attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'name';

        getAttributeValidationRequestsForValidator(param, 'completed' , function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
            done();
        });
    });

    it('Attribute validation requests - incomplete given attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'address';

        getAttributeValidationRequestsForValidator(param, 'incomplete',  function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
            done();
        });
    });
});

/**
 * Utilities
 *
 */

function createAttributeRequest(param) {
    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.attribute = [];
    request.asset.attribute[0] = {};
    request.asset.attribute[0].type = param.type ? param.type : "name";
    request.asset.attribute[0].owner = param.owner ? param.owner : OTHER_OWNER;
    request.asset.attribute[0].value = param.value ? param.value : "JOE";
    return request;
}

function createAttributeValidationRequest(param) {

    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.validation = [];
    request.asset.validation[0] = {};
    request.asset.validation[0].type = param.type ? param.type : "name";
    request.asset.validation[0].owner = param.owner ? param.owner : OWNER;
    request.asset.validation[0].validator = param.validator ? param.validator : VALIDATOR;
    return request;
}

function createAttributeValidation(param) {

    let request = {};
    if (!param) {
        param = {}
    }

    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.validation = [];
    request.asset.validation[0] = {};
    request.asset.validation[0].type = param.type ? param.type : "name";
    request.asset.validation[0].owner = param.owner ? param.owner : OWNER;
    request.asset.validation[0].validator = param.validator ? param.validator : VALIDATOR;
    request.asset.validation[0].chunk = param.chunk ? param.chunk : DEFAULT_CHUNK;
    return request;
}

function getAttributeTypeByName(name, done) {
    node.get('/api/attributes/types?name=' + name, done);
}

function postAttribute(params, done) {
    node.post('/api/attributes', params, done);
}

function postAttributeValidationRequest(params, done) {
    node.post('/api/attributes/validationrequest', params, done);
}

function postAttributeValidation(params, done) {
    node.post('/api/attributes/validation', params, done);
}

function getAttribute(owner, typeName, done) {
    getAttributeTypeByName(typeName, function (err, res) {
        let type;
        if (res.body.attribute_type) {
            type = '' + res.body.attribute_type.name;
        }
        let url = '/api/attributes?owner=' + owner;
        if (type) {
            url += '&type=' + '' + type;
        }
        node.get(url, done);
    });
}

function getAttributesForOwner(owner, done) {

    let url = '/api/attributes?owner=' + owner;
    node.get(url, done);
}

function getAttributeValidationRequest(params, done) {
    let url = '/api/attributes/validationrequest';
    if (params.validator || params.attribute_id) {
        url += '?';
    }
    if (params.validator) {
        url += '&validator=' + '' + params.validator;
    }
    if (params.attribute_id) {
        url += '&attribute_id=' + '' + params.attribute_id;
    }
    node.get(url, done);

}

function getAttributeValidation(params, done) {
    let url = '/api/attributes/validation';
    if (params.validator || params.type || params.owner) {
        url += '?';
    }
    if (params.validator) {
        url += '&validator=' + '' + params.validator;
    }
    if (params.type) {
        url += '&type=' + '' + params.type;
    }
    if (params.owner) {
        url += '&owner=' + '' + params.owner;
    }
    node.get(url, done);

}

function getAttributeValidationRequestsForValidator(params, completeSuffix, done) {

    let url = '/api/attributes/validationrequest/' + completeSuffix;
    if (params.validator || params.type || params.owner) {
        url += '?';
    }
    if (params.validator) {
        url += '&validator=' + '' + params.validator;
    }
    if (params.type) {
        url += '&type=' + '' + params.type;
    }
    if (params.owner) {
        url += '&owner=' + '' + params.owner;
    }
    node.get(url, done);

}

function getBalance(address, done) {
    node.get('/api/accounts/getBalance?address=' + address, done);
}

function putTransaction (params, done) {
    node.put('/api/transactions', params, done);
}

function getTransaction (params, done) {
    node.get(`/api/transactions/get?id=${params.id}`, done);
}
