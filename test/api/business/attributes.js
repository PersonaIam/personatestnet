'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('../../node.js');
let sleep = require('sleep');
let messages = require('../../../helpers/messages.js');
let constants = require('../../../helpers/constants.js');
let slots = require('../../../helpers/slots.js');

// TEST DATA

const OWNER = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
const SECRET = "blade early broken display angry wine diary alley panda left spy woman";
const PUBLIC_KEY = '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6';

const OTHER_OWNER = 'LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ';
const OTHER_SECRET = "city maple antenna above hurt random later common toss reveal torch label";
const OTHER_PUBLIC_KEY = '026434affd98ea4f0d9220d30263a46834076058feca62894352e16b4cddce3bae';

const FIRST_NAME = 'first_name';
const PHONE_NUMBER = 'phone_number';
const BIRTHPLACE = 'birthplace';
const ADDRESS = 'address';
const IDENTITY_CARD = 'identity_card';

const ADDRESS_VALUE = 'Denver';
const NAME_VALUE = "JOE";
const SECOND_NAME_VALUE = "QUEEN";
const THIRD_ID_VALUE = "QUEENS";
const EMAIL = 'yeezy@gmail.com';
const PHONE_NUMBER_VALUE = '345654321';
const BIRTHPLACE_VALUE = 'Calgary';
const NEW_ADDRESS = 'Edmonton';
const NEW_ADDRESS2 = 'Toronto';
const INCORRECT_ADDRESS = 'ABC';

// RESULTS

const TRANSACTION_ID = 'transactionId';
const SUCCESS = 'success';
const ERROR = 'error';
const COUNT = 'count';
const TRUE = true;
const FALSE = false;

// TEST UTILS

const SLEEP_TIME = 10001; // in milliseconds
let transactionList = [];
let ipfsTransaction = {};
let time = 0;

// TESTS

describe('Send Funds', function () {

    // this test is only used to generate the public key for the owner account, it is not supposed to actually send the amount
    it('Send funds - placeholder to generate public key', function (done) {
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

    it('Send funds - to the other owner', function (done) {
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

describe('ATTRIBUTE TYPES', function () {

    it('As a PUBLIC user, I want to Get the details of an attribute type (FIRST_NAME). ' +
        'EXPECTED : SUCCESS. RESULT : Attribute type details (name is FIRST_NAME)', function (done) {
        getAttributeTypeByName(FIRST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attribute_type).to.have.property('id');
            node.expect(res.body.attribute_type).to.have.property('data_type');
            node.expect(res.body.attribute_type).to.have.property('name').to.be.eq(FIRST_NAME);
            node.expect(res.body.attribute_type.id).to.be.at.least(1);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute type that does not exist. ' +
        'EXPECTED : FAILURE. ERROR : ATTRIBUTE_TYPE_NOT_FOUND', function (done) {
        getAttributeTypeByName('weight', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the list of attribute types. ' +
        'EXPECTED : SUCCESS. RESULT : Attribute type list', function (done) {
        getAttributeTypesList(function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.at.least(1);
            node.expect(res.body).to.have.property('attribute_types');
            done();
        });
    });
});

describe('CREATE ATTRIBUTE', function () {

    it('As an OWNER, I want to Create a non file attribute and provide associations. ' +
        'EXPECTED : FAILURE. ERROR : ASSOCIATIONS_NOT_SUPPORTED_FOR_NON_FILE_TYPES', function (done) {

        let params = {};
        params.associations = [1];
        let request = createAttributeRequest(params);

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ASSOCIATIONS_NOT_SUPPORTED_FOR_NON_FILE_TYPES);
            done();
        });
    });

    it('As an OWNER, I want to Create a non file attribute (FIRST_NAME). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let request = createAttributeRequest();

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As an OWNER, I want to Create a non file attribute (PHONE_NUMBER). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = PHONE_NUMBER_VALUE;
        param.type = PHONE_NUMBER;

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

    it('As an OWNER, I want to Create a non file attribute (BIRTHPLACE). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = BIRTHPLACE_VALUE;
        param.type = BIRTHPLACE;

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the details of an attribute (OWNER, FIRST_NAME). ' +
        'EXPECTED : SUCCESS. RESULT : Attribute Details, including value, type, active, expire_timestamp', function (done) {
        getAttribute(OWNER, FIRST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(FIRST_NAME);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.eq(null);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(false);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute that does not exist (OWNER, ADDRESS). ' +
        'EXPECTED : SUCCESS. RESULT : Empty "attributes" array', function (done) {
        getAttribute(OWNER, ADDRESS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributes');
            node.expect(res.body).to.have.property('attributes').to.have.length(0);
            done();
        });
    });

    it('As an OWNER, I want to Create a non file attribute type, but the provided owner address is invalid. ' +
        'EXPECTED : FAILURE. ERROR : INVALID_OWNER_ADDRESS', function (done) {

        let params = {};
        params.owner = INCORRECT_ADDRESS;

        let request = createAttributeRequest(params);

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.eq(messages.INVALID_OWNER_ADDRESS);
            done();
        });
    });

    it('As an OWNER, I want to Create an attribute, but the provided attribute type does not exist. ' +
        'EXPECTED : FAILURE. ERROR : ATTRIBUTE_TYPE_NOT_FOUND', function (done) {

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

    it('As an OTHER_OWNER, I want to Create an attribute for some other user (OWNER). ' +
        'EXPECTED : FAILURE. ERROR : SENDER_IS_NOT_OWNER', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.value = 'none';
        param.type = 'first_name';

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SENDER_IS_NOT_OWNER);
            done();
        });
    });
});

describe('CREATE FILE TYPE ATTRIBUTES', function () {

    it('As an OWNER, I want to Create a file type attribute, without providing an expiration timestamp. ' +
        'EXPECTED : FAILURE. ERROR : EXPIRE_TIMESTAMP_REQUIRED', function (done) {

        let params = {};
        params.type = IDENTITY_CARD;
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

    it('As an OWNER, I want to Create a file type attribute, with the provided expiration timestamp in the past. ' +
        'EXPECTED : FAILURE. ERROR : EXPIRE_TIMESTAMP_IN_THE_PAST', function (done) {

        let params = {};
        params.type = IDENTITY_CARD;
        params.value = 'some_random_file_content';
        params.expire_timestamp = slots.getTime() - 20000;

        let request = createAttributeRequest(params);

        ipfsTransaction.req = request; // keep the original requested data

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRE_TIMESTAMP_IN_THE_PAST);
            done();
        });
    });

    it('As an OWNER, I want to Create a file type attribute (IDENTITY_CARD) correctly. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.value = 'some_random_file_content';
        params.expire_timestamp = slots.getTime() + 20000;

        let request = createAttributeRequest(params);

        ipfsTransaction.req = request; // keep the original requested data

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the details of a tx used to create a file type attribute. ' +
        'EXPECTED : SUCCESS. RESULT : Tx asset value is the IPFS Hash of the file type attribute', function (done) {
        node.expect(ipfsTransaction).to.have.property(TRANSACTION_ID).to.be.a('string');

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

    it('As a PUBLIC user, I want to Get the details of a file type attribute. ' +
        'EXPECTED : SUCCESS. RESULT : Attribute details, having the IPFS Hash as value', function (done) {
        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('QmNh1KGj4vndExrkT5AKV965zVJBbWBXbzVzmzpYXrsEoF');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(IDENTITY_CARD);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.be.at.least(1);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(false);
            done();
        });
    });
});

describe('CREATE ATTRIBUTE', function () {

    it('As a PUBLIC user, I want to Get the attributes of a user (OTHER_OWNER) that has no attributes. ' +
        'EXPECTED : SUCCESS. RESULT : Empty "attributes" array', function (done) {
        getAttributesForOwner(OTHER_OWNER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            node.expect(res.body.attributes).to.have.length(0);
            done();
        });
    });

    it('As an OTHER_OWNER, I want to Create a non file attribute (FIRST_NAME). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

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
        param.value = SECOND_NAME_VALUE;

        let request = createAttributeRequest(param);

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(OTHER_OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.createattribute);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the attributes of a user (OTHER_OWNER) that has 1 attribute. ' +
        'EXPECTED : SUCCESS. RESULT : Contains "attributes" as an array with 1 element', function (done) {
        getAttributesForOwner(OTHER_OWNER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            node.expect(res.body.attributes).to.have.length(1);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(SECOND_NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp');
            done();
        });
    });

    it('As an OTHER_OWNER, I want to Create a file type attribute (IDENTITY_CARD), providing an empty association array for it. ' +
        'EXPECTED : FAILURE. ERROR : EMPTY_ASSOCIATIONS_ARRAY', function (done) {

        getAttribute(OTHER_OWNER, FIRST_NAME, function() {
            let param = {};
            param.owner = OTHER_OWNER;
            param.type = IDENTITY_CARD;
            param.secret = OTHER_SECRET;
            param.publicKey = OTHER_PUBLIC_KEY;
            param.value = THIRD_ID_VALUE;
            param.associations = [];
            param.expire_timestamp = slots.getTime() + 200000;

            let request = createAttributeRequest(param);

            postAttribute(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
                node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EMPTY_ASSOCIATIONS_ARRAY);
                done();
            });
        });
    });

    it('As an OTHER_OWNER, I want to Create a file type attribute (IDENTITY_CARD), providing an association (FIRST_NAME) for it. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OTHER_OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        getAttribute(OTHER_OWNER, 'first_name', function (err, identityCardData) {
            let param = {};
            param.owner = OTHER_OWNER;
            param.type = IDENTITY_CARD;
            param.secret = OTHER_SECRET;
            param.publicKey = OTHER_PUBLIC_KEY;
            param.value = THIRD_ID_VALUE;
            param.associations = [identityCardData.body.attributes[0].id];
            param.expire_timestamp = slots.getTime() + 200000;

            let request = createAttributeRequest(param);

            postAttribute(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property(TRANSACTION_ID);
                sleep.msleep(SLEEP_TIME);
                getBalance(OTHER_OWNER, function (err, res) {
                    let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                    let balanceAfter = parseInt(res.body.balance);
                    node.expect(balance - balanceAfter === constants.fees.createattribute);
                    node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
                });
                done();
            });
        });
    });

    it('As an OWNER, I want to Create a non file attribute (ADDRESS). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = ADDRESS_VALUE;
        param.type = ADDRESS;

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the attributes of a user (OWNER) that has multiple attributes. ' +
        'EXPECTED : SUCCESS. RESULT : Contains "attributes" as an array with 5 elements', function (done) {
        getAttributesForOwner(OWNER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(5);
            node.expect(res.body.attributes).to.have.length(5);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NAME_VALUE);        // first_name
            node.expect(res.body.attributes[4]).to.have.property('value').to.eq(ADDRESS_VALUE);     // address

            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(FIRST_NAME);
            node.expect(res.body.attributes[1]).to.have.property('type').to.eq(PHONE_NUMBER);
            node.expect(res.body.attributes[2]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[3]).to.have.property('type').to.eq(IDENTITY_CARD);
            node.expect(res.body.attributes[4]).to.have.property('type').to.eq(ADDRESS);

            done();
        });
    });
});

describe('UPDATE ATTRIBUTE', function () {

    it('As an OWNER, I want to Update a file type attribute (IDENTITY_CARD). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let params = {};
            params.attributeId = attributeId;
            params.owner = OWNER;
            params.type = IDENTITY_CARD;
            params.value = 'some_new_file_content';
            params.expire_timestamp = slots.getTime() + 20000;

            let request = updateAttributeRequest(params);

            ipfsTransaction.req = request; // keep the original requested data

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property(TRANSACTION_ID);
                sleep.msleep(SLEEP_TIME);

                ipfsTransaction.transactionId = res.body.transactionId;

                getBalance(OWNER, function (err, res) {
                    let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                    let balanceAfter = parseInt(res.body.balance);
                    node.expect(balance - balanceAfter === constants.fees.updateattribute);
                    node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.updateattribute);
                });

                done();
            });
        });
    });

    it('As a PUBLIC user, I want to Get the details of a recently updated attribute (OWNER, IDENTITY_CARD). ' +
        'EXPECTED : SUCCESS. RESULT : Contains "value" as the new IPFS Hash', function (done) {
        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('QmWC2ELAX6vzYUaCpdSLmsGHAYjXC4EufortQ2dPBmMzsD');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(IDENTITY_CARD);
            node.expect(res.body.attributes[0]).to.have.property('timestamp').to.be.at.least(time);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(false);
            done();
        });
    });

    it('As an OWNER, I want to Update a non file attribute (ADDRESS). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        getAttribute(OWNER, ADDRESS, function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let param = {};
            param.attributeId = attributeId;
            param.owner = OWNER;
            param.secret = SECRET;
            param.publicKey = PUBLIC_KEY;
            param.value = NEW_ADDRESS;
            time = slots.getTime();
            param.expire_timestamp = time + 200000;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property(TRANSACTION_ID);
                sleep.msleep(SLEEP_TIME);
                getBalance(OWNER, function (err, res) {
                    let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                    let balanceAfter = parseInt(res.body.balance);
                    node.expect(balance - balanceAfter === constants.fees.updateattribute);
                    node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.updateattribute);
                });
                done();
            });
        });

    });

    it('As a PUBLIC user, I want to Get the details of a recently updated non file attribute (OWNER, ADDRESS). ' +
        'EXPECTED : SUCCESS. RESULT : Contains "value" as the new address value', function (done) {

        getAttribute(OWNER, ADDRESS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_ADDRESS);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.eq(time + 200000);
            node.expect(res.body.attributes[0]).to.have.property('timestamp').to.be.at.least(time);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ADDRESS);
            done();
        });
    });

    it('As an OWNER, I want to Update an attribute that does not exist. ' +
        'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND_FOR_UPDATE', function (done) {

        let param = {};
        param.attributeId = 777;
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.value = NEW_ADDRESS;
        time = slots.getTime();
        param.expire_timestamp = time + 200000;
        let request = updateAttributeRequest(param);

        putAttributeUpdate(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND_FOR_UPDATE);
            done();
        });
    });

    it('As an OWNER, I want to Update an attribute (ADDRESS) by changing the expire timestamp, keeping the value the same. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        getAttribute(OWNER, ADDRESS, function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let param = {};
            param.attributeId = attributeId;
            param.owner = OWNER;
            param.secret = SECRET;
            param.publicKey = PUBLIC_KEY;
            time = slots.getTime();
            param.expire_timestamp = time + 200000;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As an OWNER, I want to Update an attribute (ADDRESS) by changing the value, keeping the expire timestamp the same. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        getAttribute(OWNER, ADDRESS, function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let param = {};
            param.attributeId = attributeId;
            param.owner = OWNER;
            param.secret = SECRET;
            param.publicKey = PUBLIC_KEY;
            param.value = NEW_ADDRESS2;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As an OWNER, I want to Update another user\'s attribute (OTHER_OWNER, FIRST_NAME). ' +
        'EXPECTED : FAILURE. ERROR : SENDER_IS_NOT_OWNER', function (done) {

        getAttribute(OTHER_OWNER, FIRST_NAME, function (err, res) {
            let param = {};
            param.attributeId = res.body.attributes[0].id;
            param.owner = OTHER_OWNER;
            param.secret = SECRET;
            param.publicKey = PUBLIC_KEY;
            param.value = 'who cares';

            let request = updateAttributeRequest(param);
            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
                node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.SENDER_IS_NOT_OWNER);
                done();
            });
        });
    });

    it('As a PUBLIC user, I want to Get the details of a recently updated attribute (OWNER, ADDRESS). ' +
        'EXPECTED : SUCCESS. RESULT : Contains "value" as the address provided in the second update', function (done) {

        getAttribute(OWNER, ADDRESS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_ADDRESS2);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ADDRESS);
            done();
        });
    });

});

describe('UPDATE ATTRIBUTE ASSOCIATIONS', function () {

    it('As an OWNER, I want to Update an attribute (IDENTITY_CARD) by providing a new association (FIRST_NAME). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        getAttribute(OWNER, IDENTITY_CARD, function (err, identityCardData) {

            let identityCardId = identityCardData.body.attributes[0].id;

            getAttribute(OWNER, FIRST_NAME, function (err, attributeData) {

                let unconfirmedBalance = 0;
                let balance = 0;
                getBalance(OWNER, function (err, res) {
                    unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                    balance = parseInt(res.body.balance);
                });

                let param = {};
                param.attributeId = identityCardId;
                param.owner = OWNER;
                param.secret = SECRET;
                param.publicKey = PUBLIC_KEY;
                param.associations = [attributeData.body.attributes[0].id];
                time = slots.getTime();
                param.expire_timestamp = time + 200000;
                param.value = 'new value for identity_card';

                let request = updateAttributeRequest(param);

                putAttributeUpdate(request, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property(TRANSACTION_ID);
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
    });

    it('As a PUBLIC user, I want to Get the details of a recently updated attribute (OWNER, IDENTITY_CARD). ' +
        'EXPECTED : SUCCESS. RESULT : Contains an "associations" property', function (done) {

        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('associations');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(IDENTITY_CARD);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (OWNER, FIRST_NAME) that is part of an association. ' +
        'EXPECTED : SUCCESS. RESULT : The attribute is associated, not documented and not active', function (done) {
        getAttribute(OWNER, FIRST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            node.expect(res.body.attributes).to.have.length(1);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('documented').to.eq(false);
            node.expect(res.body.attributes[0]).to.have.property('associated').to.eq(true);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(false);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp');
            done();
        });
    });

    it('As an OWNER, I want to Update an attribute (ADDRESS) by providing a new association (FIRST_NAME). ' +
        'EXPECTED : FAILURE. ERROR : ATTRIBUTE_ASSOCIATION_BASE_ATTRIBUTE_NOT_A_FILE', function (done) {

        getAttribute(OWNER, ADDRESS, function (err, addressAttribute) {
            let addressAttributeId = addressAttribute.body.attributes[0].id;

            getAttribute(OWNER, FIRST_NAME, function (err, attributeData) {
                let param = {};
                param.attributeId = addressAttributeId;
                param.owner = OWNER;
                param.secret = SECRET;
                param.publicKey = PUBLIC_KEY;

                param.value = '24682';
                param.associations = [attributeData.body.attributes[0].id];

                let request = updateAttributeRequest(param);

                putAttributeUpdate(request, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
                    node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_ASSOCIATION_BASE_ATTRIBUTE_NOT_A_FILE);
                    done();
                });
            });
        });
    });

    it('As an OWNER, I want to Update an attribute (ADDRESS) by providing a new association (IDENTITY_CARD). ' +
        'EXPECTED : FAILURE. ERROR : ATTRIBUTE_ASSOCIATION_BASE_ATTRIBUTE_NOT_A_FILE', function (done) {

        getAttribute(OWNER, ADDRESS, function (err, addressAttribute) {
            let addressAttributeId = addressAttribute.body.attributes[0].id;

            getAttribute(OWNER, IDENTITY_CARD, function (err, identityCardData) {
                let param = {};
                param.attributeId = addressAttributeId;
                param.owner = OWNER;
                param.secret = SECRET;
                param.publicKey = PUBLIC_KEY;

                param.value = '134354';
                param.associations = [identityCardData.body.attributes[0].id];

                let request = updateAttributeRequest(param);

                putAttributeUpdate(request, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
                    node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_ASSOCIATION_BASE_ATTRIBUTE_NOT_A_FILE);
                    done();
                });
            });
        });
    });
});

describe('EXPIRED ATTRIBUTES', function () {

    it('As an OWNER, I want to Create a non-expirable, non-file attribute (EMAIL) with an expiration in the past. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        time = slots.getTime() - 20000;
        param.expire_timestamp = time;
        param.type = 'email';
        param.value = EMAIL;
        let request = createAttributeRequest(param);

        postAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the details of a non-expirable attribute (OWNER, EMAIL). ' +
        'EXPECTED : SUCCESS. RESULT : The details contain the "expire_timestamp" provided during creation' , function (done) {
        getAttribute(OWNER, 'email', function (err, res) {
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

    it('As an OWNER, I want to Update the expire_timestamp of a non-expirable attribute (EMAIL). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        getAttribute(OWNER, 'email', function (err, res) {

            let attributeId = res.body.attributes[0].id;
            let unconfirmedBalance = 0;
            let balance = 0;
            getBalance(OWNER, function (err, res) {
                unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
                balance = parseInt(res.body.balance);
            });

            let param = {};
            param.attributeId = attributeId;
            param.owner = OWNER;
            param.secret = SECRET;
            param.publicKey = PUBLIC_KEY;
            param.value = EMAIL;
            time = slots.getTime();
            param.expire_timestamp = time + 200000;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property(TRANSACTION_ID);
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
    request.asset.attribute[0].owner = param.owner ? param.owner : OWNER;
    request.asset.attribute[0].value = param.value ? param.value : NAME_VALUE;
    if (param.associations) {
        request.asset.attribute[0].associations = param.associations;
    }
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
    request.asset.attribute[0].owner = param.owner ? param.owner : OWNER;
    if (param.value) {
        request.asset.attribute[0].value = param.value;
    }
    if (param.associations) {
        request.asset.attribute[0].associations = param.associations;
    }
    if (param.expire_timestamp) {
        request.asset.attribute[0].expire_timestamp =  param.expire_timestamp;
    }

    console.log(JSON.stringify(request));
    return request;
}

function getAttributeTypeByName(name, done) {
    node.get('/api/attributes/types?name=' + name, done);
}

function getAttributeTypesList(done) {
    node.get('/api/attributes/types/list', done);
}

function postAttribute(params, done) {
    node.post('/api/attributes', params, done);
}

function putAttributeUpdate(params, done) {
    node.put('/api/attributes', params, done);
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

function getBalance(address, done) {
    node.get('/api/accounts/getBalance?address=' + address, done);
}

function putTransaction(params, done) {
    node.put('/api/transactions', params, done);
}

function getTransaction(params, done) {
    node.get(`/api/transactions/get?id=${params.id}`, done);
}
