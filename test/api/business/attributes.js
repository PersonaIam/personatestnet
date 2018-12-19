'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('../../node.js');
let sleep = require('sleep');
let messages = require('../../../helpers/messages.js');
let constants = require('../../../helpers/constants.js');
let slots = require('../../../helpers/slots.js');
let xlsx = require('xlsx');

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
let reportData = [];

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

describe('Attribute Type', function () {

    it('Get Attribute Type - Attribute Type exists (FIRST_NAME)', function (done) {
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

    it('Get Attribute Type - Attribute Type does not exist', function (done) {
        getAttributeTypeByName('weight', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            done();
        });
    });

    it('Get Attribute Type List', function (done) {
        getAttributeTypesList(function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.at.least(1);
            node.expect(res.body).to.have.property('attribute_types');
            done();
        });
    });
});

describe('Create Attribute', function () {

    it('Create Attribute - Non file type, with associations', function (done) {

        let params = {};
        params.associations = [1];
        let request = createAttributeRequest(params);

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_ASSOCIATIONS_FOR_NON_FILE_TYPE)

            addToReportData(
                {   testName:"CREATE ATTRIBUTE - FIRST_NAME, no associations",
                    expected: "SUCCESS"
                }, function (err, res) {
                    done();
                });
        });
    });

    it('Create Attribute - FIRST_NAME', function (done) {

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

    it('Create Attribute - PHONE_NUMBER ', function (done) {

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

    it('Create Attribute - BIRTHPLACE ', function (done) {

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

    it('Get Attribute - FIRST_NAME', function (done) {
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

    it('Get Attribute - Attribute does not exist', function (done) {
        getAttribute(OWNER, ADDRESS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attributes');
            node.expect(res.body).to.have.property('attributes').to.have.length(0);
            done();
        });
    });

    it('Create Attribute - Owner Address is incorrect', function (done) {

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

    it('Create Attribute - Attribute Type does not exist', function (done) {

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

    it('Create Attribute - Sender and attribute owner do not correspond', function (done) {

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

describe('Create Attribute of File Data Type (IDENTITY_CARD)', function () {

    it('Create Attribute - File Data Type with no expiration timestamp', function (done) {

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

    it('Create Attribute - Expirable type, expire timestamp is in the past', function (done) {

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

    it('Create Attribute - File Data Type (IDENTITY_CARD)', function (done) {

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

    it('Get File Attribute Creation Transaction - should have the IPFS hash as the attribute value', function (done) {
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

    it('Get Attribute - File Data Type', function (done) {
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

describe('Create Attribute', function () {

    it('Get Attributes - no results', function (done) {
        getAttributesForOwner(OTHER_OWNER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            node.expect(res.body.attributes).to.have.length(0);
            done();
        });
    });

    it('Create Attribute - FIRST_NAME, other owner', function (done) {

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
            node.expect(res.body).to.have.property('transactionId');
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

    it('Get Attributes - 1 result', function (done) {
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

    it('Create Attribute - IDENTITY_CARD, other owner, with associations', function (done) {

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
            param.associations = [identityCardData.body.attributes[0].id]
            param.expire_timestamp = slots.getTime() + 200000;

            let request = createAttributeRequest(param);

            postAttribute(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('transactionId');
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

    it('Create Attribute - ADDRESS ', function (done) {

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

    it('Get Attribute - ADDRESS', function (done) {
        getAttribute(OWNER, ADDRESS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ADDRESS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ADDRESS);
            done();
        });
    });

    it('Get Attributes - Multiple Results and checks order is expected', function (done) {
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

describe('Update Attribute', function () {

    it('Update Attribute - Value stored in IPFS ( IDENTITY_CARD )', function (done) {

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
                node.expect(res.body).to.have.property('transactionId');
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

    it('Get Attribute - After Update ( IDENTITY_CARD )', function (done) {
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

    it('Update Attribute - ( ADDRESS )', function (done) {

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
            console.log(time);
            param.expire_timestamp = time + 200000;
            let request = updateAttributeRequest(param);

            putAttributeUpdate(request, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('transactionId');
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

    it('Get Attribute - After Update ( ADDRESS )', function (done) {

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

    it('Update Attribute - Attribute does not exist', function (done) {

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

    it('Update Attribute - Only expire timestamp ( ADDRESS )', function (done) {

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

    it('Update Attribute - Only value ( ADDRESS )', function (done) {

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

    it('Update Attribute - Sender and attribute owner do not correspond', function (done) {

        getAttribute(OWNER, ADDRESS, function (err, res) {
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

    it('Get Attribute - After Second Update ( ADDRESS )', function (done) {

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

})

describe('Update Attribute Associations', function () {

    it('Update Associations - Document to Attribute association ( IDENTITY_CARD -> FIRST_NAME )', function (done) {

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
    });

    it('Get Attribute - After Association Update ( IDENTITY_CARD )', function (done) {

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

    it('Get Attribute - After association was made, verify Attribute is still not documented, and is associated( IDENTITY_CARD is not active yet, but the association exists )', function (done) {
        getAttribute(OWNER, 'first_name', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            node.expect(res.body.attributes).to.have.length(1);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('documented').to.eq(false);
            node.expect(res.body.attributes[0]).to.have.property('associated').to.eq(true);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp');
            done();
        });
    });

    // it('Update Associations - One association element, and it belongs to different owner', function (done) {
    //
    //     getAttribute(OWNER, IDENTITY_CARD, function (err, identityCardData) {
    //         let attributeId = identityCardData.body.attributes[0].id;
    //
    //         getAttribute(OTHER_OWNER, FIRST_NAME, function (err, attributeData) {
    //             let param = {};
    //             param.attributeId = attributeId;
    //             param.owner = OWNER;
    //             param.secret = SECRET;
    //             param.publicKey = PUBLIC_KEY;
    //
    //             param.value = '24680';
    //             param.expire_timestamp = identityCardData.body.attributes[0].expire_timestamp;
    //             param.associations = [attributeData.body.attributes[0].id];
    //
    //             let request = updateAttributeRequest(param);
    //
    //             putAttributeUpdate(request, function (err, res) {
    //                 console.log(res.body);
    //                 node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
    //                 node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_ASSOCIATION_DIFFERENT_OWNERS);
    //                 done();
    //             });
    //         });
    //     });
    // });

    // it('Update Associations - Two association elements, and the second belongs to different owner', function (done) {
    //
    //     getAttribute(OWNER, IDENTITY_CARD, function (err, identityCardData) {
    //         let attributeId = identityCardData.body.attributes[0].id;
    //
    //         getAttribute(OWNER, FIRST_NAME, function (err, firstNameData) {
    //             let attributeIdFN = firstNameData.body.attributes[0].id;
    //
    //         getAttribute(OTHER_OWNER, FIRST_NAME, function (err, attributeDataOtherOwner) {
    //             let param = {};
    //             param.attributeId = attributeId;
    //             param.owner = OWNER;
    //             param.secret = SECRET;
    //             param.publicKey = PUBLIC_KEY;
    //
    //             param.value = '24681';
    //             param.expire_timestamp = identityCardData.body.attributes[0].expire_timestamp;
    //             param.associations = [attributeIdFN, attributeDataOtherOwner.body.attributes[0].id];
    //
    //             let request = updateAttributeRequest(param);
    //
    //             putAttributeUpdate(request, function (err, res) {
    //                 console.log(res.body);
    //                 node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
    //                 node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_ASSOCIATION_DIFFERENT_OWNERS);
    //                 done();
    //             });
    //         });
    //         });
    //     });
    // });

    it('Update Associations - Attribute to Attribute association', function (done) {

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

    it('Update Associations - Attribute to Document association', function (done) {

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

describe('Expired Attribute', function () {

    it('Create Attribute - success (Timestamp in the past, but not expirable)', function (done) {

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

    it('Get Attribute - expired' , function (done) {
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

    it('Update Attribute - Only expire timestamp ( EMAIL, make it not expired )', function (done) {

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
});

describe('Generate Report', function () {

    it('Generate Report', function (done) {
        createReport('Report_Attributes.xlsx', function (err, res) {
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

function createReport(reportName, cb) {
    let workbook = xlsx.utils.book_new();
    let ws = xlsx.utils.json_to_sheet(reportData);
    xlsx.utils.book_append_sheet(workbook, ws, "Results");
    xlsx.writeFile(workbook, reportName, {type: 'file'});
    return cb(null);
}

function addToReportData(data, cb){
    reportData.push(data);
    return cb(null);
}
