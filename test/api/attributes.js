'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('./../node.js');
let sleep = require('sleep');
let messages = require('../../helpers/messages.js');
let constants = require('../../helpers/constants.js');
let slots = require('../../helpers/slots.js');
let moment = require('moment');

// TEST DATA

const APPLICANT = 'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';
const APPLICANT_2 = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';
const VALIDATOR = 'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';
const VALIDATOR_2 = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';

const DEFAULT_CHUNK = 7;
const DEFAULT_AMOUNT = 0;
const CHUNK = 8;
const AMOUNT_1 = 2;
const AMOUNT_2 = 11;

const SECRET = "blade early broken display angry wine diary alley panda left spy woman";
const PUBLIC_KEY = '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6';
const OWNER = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';

const OTHER_SECRET = "city maple antenna above hurt random later common toss reveal torch label";
const OTHER_PUBLIC_KEY = '026434affd98ea4f0d9220d30263a46834076058feca62894352e16b4cddce3bae';
const OTHER_OWNER = 'LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ';

const ADDRESS_VALUE = 'Denver';
const NAME_VALUE = "JOE";
const SECOND_NAME_VALUE = "QUEEN";
const EMAIL = 'yeezy@gmail.com';
const FIRST_NAME = 'first_name';
const BIRTH_PLACE = 'Calgary';
const NEW_ADDRESS = 'Edmonton';
const NEW_ADDRESS2 = 'Toronto';


const INCORRECT_ADDRESS = 'ABC';

// TEST UTILS

const SLEEP_TIME = 10001; // in milliseconds
const SUCCESS = 'success';
const ERROR = 'error';
const TRUE = true;
const FALSE = false;

let transactionList = [];
let ipfsTransaction = {};

let time = 0;


describe('PUT /api/transactions', function () {
    // this test is only used to generate the public key for the owner account, it is not supposed to actually send the amount

    it('using valid parameters - placeholder to generate public key', function (done) {
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

describe('Insufficient funds', function () {

    it('send an amount that cannot be used to create an attribute', function (done) {
        let amountToSend = 1;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY,
            secret: SECRET,
            amount: amountToSend,
            recipientId: OTHER_OWNER
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER,
                'recipient': OTHER_OWNER,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            done();
        });
    });

    it('Create an attribute from an account that has insufficient funds', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OTHER_OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });
        console.log(balance);
        console.log(unconfirmedBalance);
        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.value = ADDRESS_VALUE;
        param.type = 'address';

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.contain('Account does not have enough PRSN: ' + OTHER_OWNER);
            getBalance(OTHER_OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balanceAfter === 1);
                node.expect(unconfirmedBalanceAfter === 1);
            });
            done();
        });
    });
});

describe('Send sufficient funds', function () {

    it('send more funds to the other owner', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY,
            secret: SECRET,
            amount: amountToSend,
            recipientId: OTHER_OWNER
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER,
                'recipient': OTHER_OWNER,
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
        getAttributeTypeByName('first_name', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attribute_type).to.have.property('id');
            node.expect(res.body.attribute_type).to.have.property('data_type');
            node.expect(res.body.attribute_type).to.have.property('name').to.be.eq('first_name');
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
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let request = createAttributeRequest();

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.createattribute);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });

    it('Create new attribute ( incorrect owner address )', function (done) {

        let params = {};
        params.owner = INCORRECT_ADDRESS;

        let request = createAttributeRequest(params);

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.eq('Owner address is incorrect');
            done();
        });
    });
});

describe('POST Create new attribute with value stored on IPFS ( identity_card )', function () {

    it('Create new expirable attribute with no expire_timestamp value ( identity_card )', function (done) {

        let params = {};
        params.type = 'identity_card';
        params.value = 'some_random_file_content';

        let request = createAttributeRequest(params);

        ipfsTransaction.req = request; // keep the original requested data

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRE_TIMESTAMP_REQUIRED);
            done();
        });
    });

    it('Create new attribute with value stored on IPFS ( identity_card )', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.type = 'identity_card';
        params.value = 'some_random_file_content';
        params.expire_timestamp = slots.getTime() + 20000;

        let request = createAttributeRequest(params);

        ipfsTransaction.req = request; // keep the original requested data

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);

            ipfsTransaction.transactionId = res.body.transactionId;

            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.createattribute);
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


describe('GET Attribute (name)', function () {

    it('Existing attribute (name)', function (done) {
        getAttribute(OTHER_OWNER, 'first_name', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('first_name');
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.eq(null);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(false);
            done();
        });
    });

    it('Non existing attribute (address)', function (done) {
        getAttribute(OTHER_OWNER, 'address', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributes');
            node.expect(res.body).to.have.property('attributes').to.have.length(0);
            done();
        });
    });
});

describe('POST Create attribute (name) for different owner', function () {

    it('Create attribute (name) for different owner', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = SECOND_NAME_VALUE;

        let request = createAttributeRequest(param);

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.createattribute);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });
});

describe('GET All existing attributes for owner 1 result', function () {

    it('All existing attributes for owner', function (done) {
        getAttributesForOwner(OTHER_OWNER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('count').to.be.eq(1);
            node.expect(res.body.attributes).to.have.length(1);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp');
            done();
        });
    });
});

describe('POST Create a different attribute ( address )', function () {

    it('Create a different attribute ( address )', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
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
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.createattribute);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });
});


describe('GET All existing attributes ', function () {

    it('All existing attributes for other owner', function (done) {
        getAttributesForOwner(OTHER_OWNER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('count').to.be.eq(1);
            node.expect(res.body.attributes).to.have.length(1);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NAME_VALUE);
            done();
        });
    });

    it('All existing attributes for owner - 3 results', function (done) {
        getAttributesForOwner(OWNER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('count').to.be.eq(3);
            node.expect(res.body.attributes).to.have.length(3);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[1]).to.have.property('value').to.eq(SECOND_NAME_VALUE);
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
            node.expect(res.body).to.have.property('count').to.be.eq(3);

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
            node.expect(values.indexOf(SECOND_NAME_VALUE) > -1);

            let types = [];
            types[0] = res.body.attributes[0].type;
            types[1] = res.body.attributes[1].type;
            node.expect(types.indexOf('address') > -1);
            node.expect(types.indexOf('first_name') > -1);


            done();
        });
    });
});

describe('POST Create an attribute validation request', function () {

    it('Create an attribute validation request', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = 'first_name';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequest);
            });
            done();
        });
    });

    it('Create new attribute validation request( incorrect owner address )', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.type = 'first_name';
        params.owner = INCORRECT_ADDRESS;

        let request = createAttributeValidationRequest(params);

        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.eq('Owner address is incorrect');
            done();
        });
    });

    it('Create new attribute validation request( incorrect validator address )', function (done) {

        let params = {};
        params.validator = INCORRECT_ADDRESS;
        params.type = 'first_name';
        params.owner = OWNER;

        let request = createAttributeValidationRequest(params);

        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.eq('Validator address is incorrect');
            done();
        });
    });
});

describe('POST Create another attribute validation request', function () {

    it('Create another attribute validation request', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
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
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequest);
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
        param.type = 'first_name';

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

    it('Get attribute validation request - using all parameters', function (done) {

        let param = {};
        param.validator = VALIDATOR;
        param.owner = OWNER;
        param.type = FIRST_NAME;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
            done();
        });
    });

    it('Get attribute validation request - by validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
            done();
        });
    });

    it('Get attribute validation requests - by type and owner', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = FIRST_NAME;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body).to.have.property('count');
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

    it('Attribute validation request - incorrect parameters', function (done) {

        let param = {};
        param.owner = OWNER;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_VALIDATION_PARAMETERS);
            done();
        });
    });

    it('Attribute validation request - incorrect parameters', function (done) {

        let param = {};
        param.type = FIRST_NAME;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_VALIDATION_PARAMETERS);
            done();
        });
    });
});

describe('POST Create attribute validation request for non existing attribute', function () {

    it('Create attribute validation request for non existing attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
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


describe('GET Attribute validation score for attribute with no validations', function () {
    it('Get Attribute validation score for attribute', function (done) {

        let param = {};
        param.type = "address";
        param.owner = OWNER;

        getAttributeValidationScore(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_score').to.be.eq(0);
            done();
        });
    });
});

describe('Consume attribute with no validations', function () {

    it('Consume attribute', function (done) {

        let params = {};
        params.owner = OWNER;
        params.type = 'first_name';
        params.amount = AMOUNT_1;

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);

            done();
        });
    });
});

describe('POST Create an attribute validation', function () {

    it('Create an attribute validation ', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';
        param.validator = VALIDATOR;
        param.chunk = CHUNK;

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidation);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidation);
            });
            done();
        });
    });

    it('Create an attribute validation - incorrect address for owner', function (done) {


        let param = {};
        param.owner = INCORRECT_ADDRESS;
        param.type = 'first_name';
        param.validator = VALIDATOR;
        param.chunk = CHUNK;

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
            done();
        });
    });

    it('Create an attribute validation - incorrect address for validator', function (done) {


        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';
        param.validator = INCORRECT_ADDRESS;
        param.chunk = CHUNK;

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Validator address is incorrect');
            done();
        });
    });

    it('Create an attribute validation - must fail since validation was already made', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';
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
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.validator = VALIDATOR;
        param.type = 'first_name';

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

    it('Get Attribute validation - using all parameters', function (done) {

        let param = {};
        param.validator = VALIDATOR;
        param.type = FIRST_NAME;
        param.owner = OWNER;

        getAttributeValidation(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validations');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_validations[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('attribute_validation_request_id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('chunk');
            node.expect(res.body.attribute_validations[0]).to.have.property('timestamp');
            done();
        });
    });


    it('Get Attribute validation - by validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;
        getAttributeValidation(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validations');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_validations[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('attribute_validation_request_id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('chunk');
            node.expect(res.body.attribute_validations[0]).to.have.property('timestamp');
            done();
        });
    });

    it('Get Attribute validation - by attribute', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OWNER;

        getAttributeValidation(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validations');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_validations[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('attribute_validation_request_id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('chunk');
            node.expect(res.body.attribute_validations[0]).to.have.property('timestamp');
            done();
        });
    });
});

describe('GET Attribute validation score for attribute', function () {
    it('Get Attribute validation score for attribute', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OWNER;

        getAttributeValidationScore(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_score').to.be.eq(CHUNK);
            done();
        });
    });

    it('Get Attribute validation score for attribute with no validations', function (done) {

        let param = {};
        param.type = "address";
        param.owner = OWNER;

        getAttributeValidationScore(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_score').to.be.eq(0);
            done();
        });
    });
});

describe('GET Attribute validations for attribute without any validation requests', function () {

    it('Attribute validation - attribute without validation requests', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;

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
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;

        getAttributeValidation(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND);
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
            node.expect(res.body).to.have.property('count');
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
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
            done();
        });
    });

    it('Attribute validation requests - completed given attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';

        getAttributeValidationRequestsForValidator(param, 'completed', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body).to.have.property('count');
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
            node.expect(res.body).to.have.property('count');
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

    it('Attribute share with no share request', function (done) {

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'first_name';

        let request = createAttributeShare(params);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_SHARE_REQUEST);
            done();
        });
    });

    it('Attribute share approval with no share request', function (done) {

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'first_name';
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_WITH_NO_SHARE_REQUEST);
            done();
        });
    });

    it('Create an attribute share request', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';
        param.applicant = APPLICANT;

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributesharerequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributesharerequest);
            });
            done();
        });
    });

    it('Create an attribute share request - Incorrect owner address', function (done) {

        let param = {};
        param.owner = INCORRECT_ADDRESS;
        param.type = 'first_name';
        param.applicant = APPLICANT;

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
            done();
        });
    });

    it('Create an attribute share request - Incorrect owner address', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';
        param.applicant = INCORRECT_ADDRESS;

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
            done();
        });
    });
});

describe('POST Create an attribute share request', function () {

    it('Create an attribute share request - share request already exists', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';
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
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND);
            done();
        });
    });

    it('Create an attribute share request - applicant is owner', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';
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

    it('Attribute share request - no query params', function (done) {

        let param = {};

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_SHARE_PARAMETERS);
            done();
        });
    });


    it('Attribute share request - type, owner and applicant', function (done) {

        let param = {};
        param.applicant = APPLICANT;
        param.owner = OWNER;
        param.type = FIRST_NAME;

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_share_requests');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.UNAPPROVED);
            done();
        });
    });

    it('Attribute share request - only applicant', function (done) {

        let param = {};
        param.applicant = APPLICANT;

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_share_requests');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.UNAPPROVED);
            done();
        });
    });

    it('Attribute share request - only owner and type', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = FIRST_NAME;

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_share_requests');
            node.expect(res.body).to.have.property('count');
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
        params.type = 'first_name';

        let request = createAttributeShare(params);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST);
            done();
        });
    });

});

describe('POST Approve attribute share request', function () {

    it('Approve attribute share request', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'first_name';
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributeshareapproval);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshareapproval);
            });
            done();
        });
    });

    it('Attribute share request - check flag after approval', function (done) {

        let param = {};
        param.applicant = APPLICANT;
        param.owner = OWNER;
        param.type = FIRST_NAME;

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
        params.type = 'first_name';
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_APPROVED);
            done();
        });
    });

    it('Approve attribute share request - incorrect owner address', function (done) {

        let params = {};
        params.applicant = APPLICANT;
        params.owner = INCORRECT_ADDRESS;
        params.type = 'first_name';
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
            done();
        });
    });

    it('Approve attribute share request - incorrect applicant address', function (done) {

        let params = {};
        params.applicant = INCORRECT_ADDRESS;
        params.owner = OWNER;
        params.type = 'first_name';
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
            done();
        });
    });

});


describe('GET Attribute shares - share not created yet', function () {

    it('Attribute share - not created yet', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';
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
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = 'KLMN';
        param.type = 'first_name';
        param.applicant = APPLICANT;

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributeshare);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshare);
            });
            done();
        });
    });

    it('Create an attribute share - incorrect owner address', function (done) {

        let param = {};
        param.owner = INCORRECT_ADDRESS;
        param.value = 'KLMN';
        param.type = 'first_name';
        param.applicant = APPLICANT;

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
            done();
        });
    });

    it('Create an attribute share - incorrect applicant address', function (done) {

        let param = {};
        param.owner = OWNER;
        param.value = 'KLMN';
        param.type = 'first_name';
        param.applicant = INCORRECT_ADDRESS;

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
            done();
        });
    });
});


describe('GET Attribute shares - share exists', function () {

    it('Attribute share - share exists, applicant parameter', function (done) {

        let param = {};
        param.applicant = APPLICANT;

        getAttributeShare(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_shares');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_shares).to.have.length(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            done();
        });
    });

    it('Attribute share - share exists, owner and type parameters', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = 'first_name';

        getAttributeShare(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_shares');
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_shares).to.have.length(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_shares[0]).to.have.property('applicant').to.be.eq(APPLICANT);
            done();
        });
    });

    it('Attribute share - share exists, owner with no type', function (done) {

        let param = {};
        param.owner = OWNER;

        getAttributeShare(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_SHARE_PARAMETERS);
            done();
        });
    });

    it('Attribute share - share exists, type with no owner', function (done) {

        let param = {};
        param.type = FIRST_NAME;

        getAttributeShare(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_SHARE_PARAMETERS);
            done();
        });
    });

    it('Attribute share request (completed)', function (done) {

        let param = {};
        param.applicant = APPLICANT;
        param.owner = OWNER;
        param.type = 'first_name';

        getAttributeShareRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_share_requests');
            node.expect(res.body).to.have.property('count');
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
        param.type = 'first_name';
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
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.applicant = APPLICANT;
        params.owner = OWNER;
        params.type = 'first_name';
        params.action = false;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributeshareapproval);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshareapproval);
            });
            done();
        });
    });

    it('Get attribute share request (unapproved)', function (done) {

        let param = {};
        param.applicant = APPLICANT;
        param.owner = OWNER;
        param.type = 'first_name';

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
        params.type = 'first_name';
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
        param.type = 'first_name';
        param.applicant = APPLICANT;

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST);
            done();
        });
    });

    it('Unapprove attribute share request - incorrect owner address', function (done) {

        let params = {};
        params.applicant = APPLICANT;
        params.owner = INCORRECT_ADDRESS;
        params.type = 'first_name';
        params.action = false;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
            done();
        });
    });

    it('Unapprove attribute share request - incorrect applicant address', function (done) {

        let params = {};
        params.applicant = INCORRECT_ADDRESS;
        params.owner = OWNER;
        params.type = 'first_name';
        params.action = false;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
            done();
        });
    });
});


describe('POST Run reward round - no attribute consumptions', function () {

    it('Run reward round - no attribute consumptions', function (done) {

        let param = {};
        let request = createRewardRound(param);
        postRewardRound(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_CONSUMPTIONS_FOR_REWARD_ROUND);
            done();
        });
    });
});

describe('POST Consume attribute', function () {

    it('Consume attribute', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let unconfirmedBalanceRecipient = 0;
        let balanceRecipient = 0;
        getBalance(constants.REWARD_FAUCET, function (err, res) {
            balanceRecipient = parseInt(res.body.balance);
            unconfirmedBalanceRecipient = parseInt(res.body.unconfirmedBalance);
        });

        let params = {};
        params.owner = OWNER;
        params.type = 'first_name';
        params.amount = AMOUNT_1;

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributeconsume);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeconsume);
            });
            getBalance(constants.REWARD_FAUCET, function (err, res) {
                let unconfirmedBalanceAfterRecipient = parseInt(res.body.unconfirmedBalance);
                let balanceAfterRecipient = parseInt(res.body.balance);
                node.expect(balanceAfterRecipient - balanceRecipient === params.amount);
                node.expect(unconfirmedBalanceAfterRecipient - unconfirmedBalanceRecipient === params.amount);
            });
            done();
        });
    });

    it('Consume attribute - amount is 0', function (done) {

        let params = {};
        params.owner = OWNER;
        params.type = 'first_name';
        params.amount = 0;

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Value 0 is less than minimum 1');
            done();
        });
    });

    it('Consume attribute - owner address is incorrect', function (done) {

        let params = {};
        params.owner = INCORRECT_ADDRESS;
        params.type = 'first_name';
        params.amount = 1;

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
            done();
        });
    });
});

describe('GET Attribute consumptions', function () {

    let timestampConsume1 = 0;

    it('Attribute consumptions - with type & owner', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OWNER;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body).to.have.property('count').to.be.eq(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
            timestampConsume1 = res.body.attributeConsumptions[0].timestamp;
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

    it('Attribute consumptions - owner and no type', function (done) {

        let param = {};
        param.owner = OWNER;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Missing required property: type');
            done();
        });
    });

    it('Attribute consumptions - type and no owner', function (done) {

        let param = {};
        param.type = FIRST_NAME;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq('Missing required property: owner');
            done();
        });
    });

    it('Attribute consumptions - with type & owner & before', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OWNER;
        param.before = timestampConsume1+1;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.eq(timestampConsume1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
            done();
        });
    });

    it('Attribute consumptions - with type & owner & after', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OWNER;
        param.after = timestampConsume1-1;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.eq(timestampConsume1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
            done();
        });
    });

    it('Attribute consumptions - with type & owner & before & after', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OWNER;
        param.before = timestampConsume1+1;
        param.after = timestampConsume1-1;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.eq(timestampConsume1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
            done();
        });
    });

    it('Attribute consumptions - with type & owner & before & after - no results', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OWNER;
        param.before = timestampConsume1-1;
        param.after = timestampConsume1+1;

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

    it('Consume attribute - again, different amount', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let unconfirmedBalanceRecipient = 0;
        let balanceRecipient = 0;
        getBalance(constants.REWARD_FAUCET, function (err, res) {
            unconfirmedBalanceRecipient = parseInt(res.body.unconfirmedBalance);
            balanceRecipient = parseInt(res.body.balance);
        });

        let params = {};
        params.owner = OWNER;
        params.type = 'first_name';
        params.amount = AMOUNT_2;

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributeconsume);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeconsume);
            });
            getBalance(constants.REWARD_FAUCET, function (err, res) {
                let unconfirmedBalanceAfterRecipient = parseInt(res.body.unconfirmedBalance);
                let balanceAfterRecipient = parseInt(res.body.balance);
                node.expect(balanceAfterRecipient - balance === params.amount);
                node.expect(unconfirmedBalanceAfterRecipient - unconfirmedBalanceRecipient === params.amount);
            });
            done();
        });
    });

    it('Get attribute consumptions - with type & owner', function (done) {

        let param = {};
        param.type = FIRST_NAME;
        param.owner = OWNER;

        getAttributeConsumptions(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributeConsumptions');
            node.expect(res.body).to.have.property('count').to.be.eq(2);
            node.expect(res.body.attributeConsumptions).to.have.length(2);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.at.least(1);
            node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
            node.expect(res.body.attributeConsumptions[1]).to.have.property('amount').to.be.eq(AMOUNT_2);
            done();
        });
    });


    it('Consume attribute - attribute does not exist', function (done) {

        let params = {};
        params.owner = OWNER;
        params.type = 'ssn';
        params.amount = 1;

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND);
            done();
        });
    });
});


describe('POST Run reward round - with attribute consumptions', function () {

    it('Run reward round - with attribute consumptions', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        let request = createRewardRound(param);
        postRewardRound(request, function (err, res) {
            console.log(res.body);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.rewardRound);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.rewardRound);
            });
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            done();
        });
    });

    it('Update Last reward round', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        let request = createUpdateRewardRound(param);

        postUpdateRewardRound(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.updateRewardRound);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.updateRewardRound);
            });
            done();
        });
    });

    it('Update Last reward round', function (done) {

        let param = {};
        let request = createUpdateRewardRound(param);

        postUpdateRewardRound(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('message').to.be.eq(messages.REWARD_ROUND_WITH_NO_UPDATE);
            done();
        });
    });

});


describe('POST Create new attribute with expiry in the future', function () {

    it('Create new attribute with expiry in the future', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        time = slots.getTime() + 20000;
        param.expire_timestamp = time;
        param.type = 'email';
        param.value = EMAIL;
        let request = createAttributeRequest(param);

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.createattribute);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });

    it('GET Existing attribute with expiry in the future' , function (done) {
        getAttribute(OTHER_OWNER, 'email', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(EMAIL);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('email');
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.be.eq(time);
            done();
        });
    });
});

describe('POST Consume inactive attribute', function () {
    it('Consume attribute for inactive', function (done) {

        let params = {};
        params.owner = OTHER_OWNER;
        params.type = 'email';
        params.amount = 1;

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);
            done();
        });
    });
});


describe('POST Share inactive attribute', function () {
    it('Create attribute share request for inactive attribute', function (done) {

        let params = {};
        params.owner = OTHER_OWNER;
        params.applicant = APPLICANT;
        params.type = 'email';
        params.amount = 1;

        let request = createAttributeShareRequest(params);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);
            done();
        });
    });

    it('Share for inactive attribute ', function (done) {

        let params = {};
        params.owner = OTHER_OWNER;
        params.applicant = APPLICANT;
        params.type = 'email';
        params.amount = 1;

        let request = createAttributeShare(params);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);
            done();
        });
    });

    it('Approve attribute share request for inactive attribute ', function (done) {

        let params = {};
        params.owner = OTHER_OWNER;
        params.applicant = APPLICANT;
        params.type = 'email';
        params.amount = 1;
        params.action = true;

        let request = createAttributeShareApproval(params);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);
            done();
        });
    });
});

describe('POST Create new attribute (expired)', function () {

    it('Create new attribute (expired)', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        time = slots.getTime() - 20000;
        param.expire_timestamp = time;
        param.type = 'birthplace';
        param.value = BIRTH_PLACE;
        let request = createAttributeRequest(param);

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.createattribute);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });

    it('GET Existing attribute with expiry' , function (done) {
        getAttribute(OTHER_OWNER, 'birthplace', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(BIRTH_PLACE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('birthplace');
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.be.eq(time);
            done();
        });
    });

    it('Create attribute validation request for expired attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.validator = VALIDATOR;
        param.type = 'birthplace';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });

    it('Create attribute validation for expired attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.validator = VALIDATOR;
        param.type = 'birthplace';

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });

    it('Create attribute share request for expired attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.applicant = APPLICANT;
        param.type = 'birthplace';

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });

    it('Create attribute share approval for expired attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.applicant = APPLICANT;
        param.type = 'birthplace';
        param.action = true;

        let request = createAttributeShareApproval(param);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });

    it('Create attribute share for expired attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.applicant = APPLICANT;
        param.type = 'birthplace';

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });

    it('Consume expired attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.type = 'birthplace';
        param.amount = 1;

        let request = createAttributeConsume(param);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });
});

// ATTRIBUTE UPDATE TESTS

describe('Attribute update preparations : create attribute, validation and share requests', function () {

    it('Create an attribute ( address )', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OTHER_OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });
        console.log(balance);
        console.log(unconfirmedBalance);
        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.value = ADDRESS_VALUE;
        param.type = 'address';

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OTHER_OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                console.log(balanceAfter);
                console.log(unconfirmedBalanceAfter);
                node.expect(balance - balanceAfter === constants.fees.createattribute);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });

    it('Create an attribute validation request', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OTHER_OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.validator = VALIDATOR;
        param.type = 'address';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OTHER_OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequest);
            });
            done();
        });
    });

});

describe('PUT update attribute ( address )', function () {

    it('Update attribute ( address )', function (done) {

        getAttribute(OTHER_OWNER, 'address', function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OTHER_OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let param = {};
            param.attributeId = attributeId;
            param.owner = OTHER_OWNER;
            param.secret = OTHER_SECRET;
            param.publicKey = OTHER_PUBLIC_KEY;
            param.value = NEW_ADDRESS;
            time = slots.getTime();
            console.log(time);
            param.expire_timestamp = time + 20000;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('transactionId');
                sleep.msleep(SLEEP_TIME);
                getBalance(OTHER_OWNER, function (err, res) {
                    let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                    let balanceAfter = parseInt(res.body.balance);
                    node.expect(balance - balanceAfter === constants.fees.updateattribute);
                    node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.updateattribute);
                });
                done();
            });
        });

    });

    it('GET after update', function (done) {

        getAttribute(OTHER_OWNER, 'address', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_ADDRESS);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.eq(time + 20000);
            node.expect(res.body.attributes[0]).to.have.property('timestamp').to.be.at.least(time);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('address');
            done();
        });
    });

    it('Update attribute ( non existing attribute )', function (done) {

            let param = {};
            param.attributeId = 777;
            param.owner = OTHER_OWNER;
            param.secret = OTHER_SECRET;
            param.publicKey = OTHER_PUBLIC_KEY;
            param.value = NEW_ADDRESS;
            time = slots.getTime();
            param.expire_timestamp = time + 20000;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
                node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND_FOR_UPDATE);
                done();
            });
        });

    it('Update attribute ( only expire timestamp )', function (done) {

        getAttribute(OTHER_OWNER, 'address', function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OTHER_OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let param = {};
            param.attributeId = attributeId;
            param.owner = OTHER_OWNER;
            param.secret = OTHER_SECRET;
            param.publicKey = OTHER_PUBLIC_KEY;
            param.value = NEW_ADDRESS;
            time = slots.getTime();
            console.log(time);
            param.expire_timestamp = time + 20000;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('transactionId');
                sleep.msleep(SLEEP_TIME);
                getBalance(OTHER_OWNER, function (err, res) {
                    let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                    let balanceAfter = parseInt(res.body.balance);
                    node.expect(balance - balanceAfter === constants.fees.updateattribute);
                    node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.updateattribute);
                });
                done();
            });
        });
    });

    it('Update attribute ( only value )', function (done) {

        getAttribute(OTHER_OWNER, 'address', function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OTHER_OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let param = {};
            param.attributeId = attributeId;
            param.owner = OTHER_OWNER;
            param.secret = OTHER_SECRET;
            param.publicKey = OTHER_PUBLIC_KEY;
            param.value = NEW_ADDRESS2;
            param.expire_timestamp = res.body.attributes[0].expire_timestamp;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('transactionId');
                sleep.msleep(SLEEP_TIME);
                getBalance(OTHER_OWNER, function (err, res) {
                    let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                    let balanceAfter = parseInt(res.body.balance);
                    node.expect(balance - balanceAfter === constants.fees.updateattribute);
                    node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.updateattribute);
                });
                done();
            });
        });
    });

    it('Update attribute ( no change - nothing to update )', function (done) {

        getAttribute(OTHER_OWNER, 'address', function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OTHER_OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let param = {};
            param.attributeId = attributeId;
            param.owner = OTHER_OWNER;
            param.secret = OTHER_SECRET;
            param.publicKey = OTHER_PUBLIC_KEY;
            param.value = NEW_ADDRESS2;
            param.expire_timestamp = res.body.attributes[0].expire_timestamp;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('message').to.be.eq(messages.NOTHING_TO_UPDATE);
                getBalance(OTHER_OWNER, function (err, res) {
                    let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                    let balanceAfter = parseInt(res.body.balance);
                    // balance and unconfirmed balances should remain the same
                    node.expect(balance - balanceAfter === 0);
                    node.expect(unconfirmedBalance - unconfirmedBalanceAfter === 0);
                });
                done();
            });
        });
    });

    it('Create an attribute validation for validation request made before update ', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.type = 'address';
        param.validator = VALIDATOR;
        param.chunk = CHUNK;

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATOR_HAS_NO_VALIDATION_REQUEST);
            done();
        });
    });

    it('Create an attribute share request after update ( attribute is inactive )', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.value = 'KLMN';
        param.type = 'address';
        param.applicant = APPLICANT;

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);
            done();
        });
    });

    it('Create an attribute share approval after update ( attribute is inactive )', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.value = 'KLMN';
        param.type = 'address';
        param.applicant = APPLICANT;
        param.action = true;

        let request = createAttributeShareApproval(param);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);
            done();
        });
    });

    it('Consume attribute after update ( attribute is inactive )', function (done) {

        let params = {};
        params.owner = OTHER_OWNER;
        params.type = 'address';
        params.amount = AMOUNT_1;

        let request = createAttributeConsume(params);
        postConsumeAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);
            done();
        });
    });

    it('Create an attribute validation request after update', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OTHER_OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.validator = VALIDATOR;
        param.type = 'address';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OTHER_OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequest);
            });
            done();
        });
    });

    it('Create an attribute validation - for request made after update - should work ', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.type = 'address';
        param.validator = VALIDATOR;
        param.chunk = CHUNK;

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidation);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidation);
            });
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
    request.asset.attribute[0].type = param.type ? param.type : FIRST_NAME;
    request.asset.attribute[0].owner = param.owner ? param.owner : OTHER_OWNER;
    request.asset.attribute[0].value = param.value ? param.value : NAME_VALUE;
    if (param.expire_timestamp) {
        request.asset.attribute[0].expire_timestamp =  param.expire_timestamp;
    }

    console.log(JSON.stringify(request));
    return request;
}

function updateAttributeRequest(param) {
    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.attribute = [];
    request.asset.attribute[0] = {};
    request.asset.attribute[0].attributeId = param.attributeId;
    request.asset.attribute[0].owner = param.owner ? param.owner : OTHER_OWNER;
    request.asset.attribute[0].value = param.value;
    if (param.expire_timestamp) {
        request.asset.attribute[0].expire_timestamp =  param.expire_timestamp;
    }

    console.log(JSON.stringify(request));
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
    request.asset.share[0].type = param.type ? param.type : FIRST_NAME;
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
    request.amount = param.amount ? param.amount : DEFAULT_AMOUNT;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.attribute = [];
    request.asset.attribute[0] = {};
    request.asset.attribute[0].type = param.type ? param.type : FIRST_NAME;
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
    request.asset.share[0].type = param.type ? param.type : FIRST_NAME;
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
    request.asset.validation[0].type = param.type ? param.type : FIRST_NAME;
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
    request.asset.validation[0].type = param.type ? param.type : FIRST_NAME;
    request.asset.validation[0].owner = param.owner ? param.owner : OWNER;
    request.asset.validation[0].validator = param.validator ? param.validator : VALIDATOR;
    request.asset.validation[0].chunk = param.chunk ? param.chunk : DEFAULT_CHUNK;
    if (param.expire_timestamp) {
        request.asset.validation[0].expire_timestamp =  param.expire_timestamp;
    }
    return request;
}

function createRewardRound(param) {

    let request = {};
    if (!param) {
        param = {}
    }

    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;

    return request;
}


function createUpdateRewardRound(param) {

    let request = {};
    if (!param) {
        param = {}
    }

    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;

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
    request.asset.share[0].type = param.type ? param.type : FIRST_NAME;
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

function putAttributeUpdate(params, done) {
    node.put('/api/attributes', params, done);
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

function postRewardRound(params, done) {
    node.post('/api/attributes/runrewardround', params, done);
}

function postUpdateRewardRound(params, done) {
    node.post('/api/attributes/updaterewardround', params, done);
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
    if (params.validator || params.owner || params.type) {
        url += '?';
    }
    if (params.validator) {
        url += '&validator=' + '' + params.validator;
    }
    if (params.owner) {
        url += '&owner=' + '' + params.owner;
    }
    if (params.type) {
        url += '&type=' + '' + params.type;
    }
    node.get(url, done);

}

function getAttributeShareRequest(params, done) {
    let url = '/api/attributes/sharerequest';
    if (params.applicant || params.owner || params.type) {
        url += '?';
    }
    if (params.applicant) {
        url += '&applicant=' + '' + params.applicant;
    }
    if (params.owner) {
        url += '&owner=' + '' + params.owner;
    }
    if (params.type) {
        url += '&type=' + '' + params.type;
    }
    node.get(url, done);
}

function getAttributeShare(params, done) {
    let url = '/api/attributes/share';
    if (params.applicant || params.owner || params.type) {
        url += '?';
    }
    if (params.applicant) {
        url += '&applicant=' + '' + params.applicant;
    }
    if (params.owner) {
        url += '&owner=' + '' + params.owner;
    }
    if (params.type) {
        url += '&type=' + '' + params.type;
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

function getAttributeValidationScore(params, done) {
    let url = '/api/attributes/validationscore';
    if (params.type || params.owner) {
        url += '?';
    }
    if (params.type) {
        url += 'type=' + '' + params.type;
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
