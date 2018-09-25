'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('./../node.js');
let sleep = require('sleep');
let messages = require('../../helpers/messages.js');
let constants = require('../../helpers/constants.js');

// TEST DATA

const APPLICANT = 'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';
const APPLICANT_2 = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';
const VALIDATOR = 'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';
const VALIDATOR_2 = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';
const OWNER = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
const OTHER_OWNER = 'LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ';
const DEFAULT_CHUNK = 7;
const CHUNK = 8;
const SECRET = "blade early broken display angry wine diary alley panda left spy woman";
const PUBLIC_KEY = '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6';
const ADDRESS_VALUE = 'Denver';

// TEST UTILS

const SLEEP_TIME = 10001; // in milliseconds
const SUCCESS = 'success';
const ERROR = 'error';
const TRUE = true;
const FALSE = false;

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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_TYPE_NOT_FOUND);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });
});

describe('POST Create new attribute with value stored on IPFS ( identity_card )', function () {

    it('Create new attribute with value stored on IPFS ( identity_card )', function (done) {

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
            console.log(err);
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);

            ipfsTransaction.transactionId = res.body.transactionId;

            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });

            done();
        });
    });
});

describe('GET transaction and check if it contains IPFS hash ( identity_card )', function () {

    it('Should have the IPFS hash as the attribute value ( identity_card )', function (done) {
        node.expect(ipfsTransaction).to.have.property('transactionId').to.be.a('string');

        let transactionId = ipfsTransaction.transactionId;

        getTransaction({id: transactionId}, function (err, res) {
            console.log(res.body);
            node.expect(res).to.have.property('body');
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.eq(messages.ATTRIBUTE_NOT_FOUND);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
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
        param.value = ADDRESS_VALUE;
        param.type = 'address';

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            done();
        });
    });
});

describe('GET Existing attribute (address)', function () {

    it('Existing attribute (address)', function (done) {
        getAttribute(OWNER, 'address', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ADDRESS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('address');
            done();
        });
    });
});

describe('GET All existing attributes for owner', function () {

    it('All existing attributes for owner', function (done) {
        getAttribute(OWNER, null, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
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
            node.expect(values.indexOf(ADDRESS_VALUE) > -1);
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

    it('List of attributes', function (done) {
        getAttributes(function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATOR_ALREADY_HAS_VALIDATION_REQUEST);
            done();
        });
    });
});

describe('GET Attribute validation request', function () {

    it('Attribute validation request', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
            done();
        });
    });

    it('Attribute validation request - no requests for validator', function (done) {

        let param = {};
        param.validator = VALIDATOR_2;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.OWNER_IS_VALIDATOR_ERROR);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidation);
            });
            done();
        });
    });

    it('Create an attribute validation - must fail since validation was already made', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'name';
        param.validator = VALIDATOR;
        param.chunk = CHUNK;

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_ALREADY_MADE);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATOR_HAS_NO_VALIDATION_REQUEST);
            done();
        });
    });
});


describe('GET Attribute validations for validator ', function () {

    it('Attribute validation - validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;
        getAttributeValidation(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_ATTRIBUTE_VALIDATIONS_OR_REQUESTS);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_ATTRIBUTE_VALIDATIONS);
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
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_ATTRIBUTE_VALIDATIONS_OR_REQUESTS_EXT);
            done();
        });
    });
});

describe('GET Attribute validation requests', function () {

    it('Attribute validation requests - completed given validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequestsForValidator(param, 'completed', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('chunk').to.eq(8);
            done();
        });
    });

    it('Attribute validation requests - incomplete given validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequestsForValidator(param, 'incomplete', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
            done();
        });
    });

    it('Attribute validation requests - completed given attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'name';

        getAttributeValidationRequestsForValidator(param, 'completed', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
            done();
        });
    });

    it('Attribute validation requests - incomplete given attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'address';

        getAttributeValidationRequestsForValidator(param, 'incomplete', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
            done();
        });
    });

    it('Attribute validation requests - no results', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'identity_card';

        getAttributeValidationRequestsForValidator(param, 'incomplete', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.eq(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
            done();
        });
    });
});


describe('POST Create an attribute share request', function () {

    it('Create an attribute share request', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.owner = OWNER;
        param.type = 'name';
        param.applicant = APPLICANT;

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributesharerequest);
            });
            done();
        });
    });
});

describe('POST Create an attribute share request', function () {

    it('Create an attribute share request - share request already exists', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'name';
        param.applicant = APPLICANT;

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_REQUEST_ALREADY_EXISTS);
            done();
        });
    });

    it('Create an attribute share request - attribute does not exist', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'email';
        param.applicant = APPLICANT;

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND_FOR_SHARE_REQUEST);
            done();
        });
    });

    it('Create an attribute share request - applicant is owner', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'name';
        param.applicant = OWNER;

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.OWNER_IS_APPLICANT_ERROR);
            done();
        });
    });
});


describe('GET Attribute share request', function () {

    it('Attribute share request', function (done) {

        let param = {};
        param.applicant = APPLICANT;

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_share_requests');
            node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.UNAPPROVED);
            done();
        });
    });

    it('Attribute share request - no share request for given applicant', function (done) {

        let param = {};
        param.applicant = APPLICANT_2;

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_REQUESTS_NOT_FOUND);
            done();
        });
    });
});

describe('POST Attribute share with no approved request', function () {

    it('Attribute share with no approved share request', function (done) {

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'name';

        let request = createAttributeShare(params);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST);
            done();
        });
    });

    it('Attribute share with no share request', function (done) {

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'identity_card';

        let request = createAttributeShare(params);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_SHARE_REQUEST);
            done();
        });
    });
});

describe('POST Approve attribute share request', function () {

    it('Approve attribute share request', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'name';
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshareapproval);
            });
            done();
        });
    });

    it('Attribute share request - check flag after approval', function (done) {

        let param = {};
        param.applicant = APPLICANT;

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_share_requests');
            node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.APPROVED);
            done();
        });
    });

    it('Approve attribute share request - request already approved', function (done) {

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'name';
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_APPROVED);
            done();
        });
    });

    it('Attribute share approval with no share request', function (done) {

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_WITH_NO_SHARE_REQUEST);
            done();
        });
    });
});


describe('GET Attribute shares - share not created yet', function () {

    it('Attribute share - not created yet', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'name';
        param.applicant = APPLICANT;

        getAttributeShare(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARES_NOT_FOUND);
            done();
        });
    });
});

describe('POST Create an attribute share - with existing approved share request', function () {

    it('Create an attribute share', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = 'KLMN';
        param.type = 'name';
        param.applicant = APPLICANT;

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshare);
            });
            done();
        });
    });
});


describe('GET Attribute shares - share exists', function () {

    it('Attribute share - share exists', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'name';
        param.applicant = APPLICANT;

        getAttributeShare(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_shares');
            node.expect(res.body.attribute_shares).to.have.length(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            done();
        });
    });

    it('Attribute share request (completed)', function (done) {

        let param = {};
        param.applicant = APPLICANT;
        param.owner = OWNER;
        param.type = 'name';

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_share_requests');
            node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.COMPLETED);
            done();
        });
    });
});

describe('POST Create an attribute share - same share as one already made', function () {

    it('Create an attribute share - same share as one already made', function (done) {

        let param = {};
        param.owner = OWNER;
        param.value = 'KLMN';
        param.type = 'name';
        param.applicant = APPLICANT;

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_COMPLETED);
            done();
        });
    });
});


describe('POST Unapprove attribute share request', function () {

    it('Unapprove attribute share request', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'name';
        params.action = false;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshareapproval);
            });
            done();
        });
    });

    it('Get attribute share request (unapproved)', function (done) {

        let param = {};
        param.applicant = APPLICANT;
        param.owner = OWNER;
        param.type = 'name';

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_share_requests');
            node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.UNAPPROVED);
            done();
        });
    });

    it('Unapprove attribute share request ( share request is already unapproved )', function (done) {


        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'name';
        params.action = false;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_UNAPPROVED);
            done();
        });
    });

    it('Create an attribute share - after unapproval', function (done) {

        let param = {};
        param.owner = OWNER;
        param.value = 'KLMN';
        param.type = 'name';
        param.applicant = APPLICANT;

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST);
            done();
        });
    });
});

describe('POST Consume attribute', function () {

    it('Consume attribute', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let params = {};
        params.owner = OWNER;
        params.type = 'name';

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeconsume);
            });
            done();
        });
    });
});


describe('GET Attribute consumptions', function () {

    let timestamp = 0;

    it('Attribute consumptions - with type & owner', function (done) {

        let param = {};
        param.type = "name";
        param.owner = OWNER;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.at.least(1);
            timestamp = res.body.attributeConsumptions[0].timestamp;
            done();
        });
    });

    it('Attribute consumptions - no type & owner', function (done) {

        let param = {};

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Missing required property: owner');
            done();
        });
    });

    it('Attribute consumptions - with type & owner & before', function (done) {

        let param = {};
        param.type = "name";
        param.owner = OWNER;
        param.before = timestamp+1;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.at.least(1);
            done();
        });
    });

    it('Attribute consumptions - with type & owner & after', function (done) {

        let param = {};
        param.type = "name";
        param.owner = OWNER;
        param.after = timestamp-1;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.at.least(1);
            done();
        });
    });

    it('Attribute consumptions - with type & owner & before & after', function (done) {

        let param = {};
        param.type = "name";
        param.owner = OWNER;
        param.before = timestamp+1;
        param.after = timestamp-1;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.at.least(1);
            done();
        });
    });

    it('Attribute consumptions - with type & owner & before & after - no results', function (done) {

        let param = {};
        param.type = "name";
        param.owner = OWNER;
        param.before = timestamp-1;
        param.after = timestamp+1;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body.attributeConsumptions).to.have.length(0);
            done();
        });
    });
});


describe('POST Consume attribute - second time', function () {

    it('Consume attribute - second time', function (done) {

        let unconfirmedBalance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let params = {};
        params.owner = OWNER;
        params.type = 'name';

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeconsume);
            });
            done();
        });
    });

    it('Consume attribute - attribute does not exist', function (done) {

        let params = {};
        params.owner = OWNER;
        params.type = 'ssn';

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND);
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

    console.log(request);
    return request;
}

function createAttributeShare(param) {
    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.share = [];
    request.asset.share[0] = {};
    request.asset.share[0].type = param.type ? param.type : "name";
    request.asset.share[0].owner = param.owner ? param.owner : OTHER_OWNER;
    request.asset.share[0].applicant = param.applicant ? param.applicant : APPLICANT;
    request.asset.share[0].value = param.value ? param.value : "KLMN";

    console.log(request);
    return request;
}


function createAttributeConsume(param) {
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
    request.asset.attribute[0].owner = param.owner ? param.owner : OWNER;

    console.log(request);
    return request;
}

function createAttributeShareApproval(param) {
    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.share = [];
    request.asset.share[0] = {};
    request.asset.share[0].type = param.type ? param.type : "name";
    request.asset.share[0].owner = param.owner ? param.owner : OTHER_OWNER;
    request.asset.share[0].applicant = param.applicant ? param.applicant : APPLICANT;
    request.asset.share[0].action = param.action;

    console.log(request);
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

    console.log(request);
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

    console.log('req = ' + request);
    console.log('asset = ' + request.asset);
    console.log('validation = ' + request.asset.validation[0]);
    return request;
}

function createAttributeShareRequest(param) {

    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.share = [];
    request.asset.share[0] = {};
    request.asset.share[0].type = param.type ? param.type : "name";
    request.asset.share[0].owner = param.owner ? param.owner : OWNER;
    request.asset.share[0].applicant = param.applicant ? param.applicant : APPLICANT;

    console.log(request);
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

function postAttributeShareRequest(params, done) {
    node.post('/api/attributes/sharerequest', params, done);
}

function postApproveShareAttributeRequest(params, done) {
    node.post('/api/attributes/approvesharerequest', params, done);
}

function postShareAttribute(params, done) {
    node.post('/api/attributes/share', params, done);
}

function postConsumeAttribute(params, done) {
    node.post('/api/attributes/consume', params, done);
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

function getAttributeShareRequest(params, done) {
    let url = '/api/attributes/sharerequest';
    if (params.applicant || params.attribute_id) {
        url += '?';
    }
    if (params.applicant) {
        url += '&applicant=' + '' + params.applicant;
    }
    if (params.attribute_id) {
        url += '&attribute_id=' + '' + params.attribute_id;
    }
    node.get(url, done);
}

function getAttributeShare(params, done) {
    let url = '/api/attributes/share';
    if (params.applicant || params.attribute_id) {
        url += '?';
    }
    if (params.applicant) {
        url += '&applicant=' + '' + params.applicant;
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

function getAttributeConsumptions(params, done) {

    let url = '/api/attributes/consume';
    if (params.type || params.owner || params.before || params.after) {
        url += '?';
    }
    if (params.type) {
        url += 'type=' + '' + params.type;
    }
    if (params.owner) {
        url += '&owner=' + '' + params.owner;
    }
    if (params.before) {
        url += '&before=' + '' + params.before;
    }
    if (params.after) {
        url += '&after=' + '' + params.after;
    }
    node.get(url, done);

}

function getBalance(address, done) {
    node.get('/api/accounts/getBalance?address=' + address, done);
}

function putTransaction(params, done) {
    node.put('/api/transactions', params, done);
}

function getTransaction(params, done) {
    node.get(`/api/transactions/get?id=${params.id}`, done);
}

function getAttributes(done) {
    node.get('/api/attributes/list', done);
}
