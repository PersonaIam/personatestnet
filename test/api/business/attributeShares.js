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

const APPLICANT = 'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';
const APPLICANT_2 = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';

const VALIDATOR = 'LNJJKBGmC1GZ89XbQ4nfRRwVCZiNig2H9M';
const VALIDATOR_SECRET = "mechanic excuse globe emerge hedgehog food knee shy burden digital copy online";
const VALIDATOR_PUBLIC_KEY = '022a09511647055f00f46d1546595fa5950349ffd8ac477d5684294ea107f4f84c';
const VALIDATOR_2 = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';
const VALIDATOR_SECRET_2 = "isolate spoil weekend protect swallow trap brown cross message patient public reward";
const VALIDATOR_PUBLIC_KEY_2 = '032699280d1527ed944131ac488fe264a80617b0acc9305fe0d40c61b9a1b924f9';

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
const DEFAULT_AMOUNT = 0;

const REASON_FOR_DECLINE_1024_GOOD =
    '1000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';
const REASON_FOR_REJECT_1024_GOOD =
    '1000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';

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

    it('Send funds - to the validator', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY,
            secret: SECRET,
            amount: amountToSend,
            recipientId: VALIDATOR
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER,
                'recipient': VALIDATOR,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            done();
        });
    });

    it('Send funds - to the second validator', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY,
            secret: SECRET,
            amount: amountToSend,
            recipientId: VALIDATOR_2
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER,
                'recipient': VALIDATOR_2,
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

describe('Create Attribute', function () {

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
});

describe('Create Attribute of File Data Type (IDENTITY_CARD)', function () {

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

    it('Create Attribute validation request - expired attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.validator = VALIDATOR;
        param.type = 'email';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });

    it('Create Attribute share request - expired attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.applicant = APPLICANT;
        param.type = 'email';

        let request = createAttributeShareRequest(param);
        postAttributeShareRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });

    it('Create Attribute share - expired attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.applicant = APPLICANT;
        param.type = 'email';

        let request = createAttributeShare(param);
        postShareAttribute(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
            done();
        });
    });

    it('Create Attribute share approval - expired attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.applicant = APPLICANT;
        param.type = 'email';

        let request = createAttributeShareApproval(param);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.EXPIRED_ATTRIBUTE);
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

// no validation tests here

describe('Create Attribute validation request', function () {

    it('Create Attribute validation request - success (IDENTITY_CARD)', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = IDENTITY_CARD;

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

    it('Create Attribute validation request - success (PHONE_NUMBER)', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = 'phone_number';

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

    it('Create Attribute validation request - success (BIRTHPLACE)', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = BIRTHPLACE;

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

    it('Create Attribute validation request - success (IDENTITY_CARD), another validator', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_2;
        param.type = IDENTITY_CARD;

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

    it('Get Attribute - IDENTITY_CARD - attribute is still inactive, with 2 requests, 1 COMPLETED & 1 PENDING_APPROVAL', function (done) {
        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(IDENTITY_CARD);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(false);
            done();
        });
    });

    it('Create Attribute validation request - success, attribute with no associations and which does not require an associated document (EMAIL)', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = 'email';

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

    it('Get Attribute validation requests - with results, using validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body).to.have.property(COUNT);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.eq(null);
            done();
        });
    });

});

describe('Approve/Decline/Notarize/Reject attribute validation request', function () {

    it('Approve Attribute validation Request - Request exists and is PENDING_APPROVAL ( to be notarized )', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            addToReportData(
                {   testName:"Approve Attribute Validation Request - Request exists and is PENDING_APPROVAL",
                    expected: "SUCCESS"
                }, function (err, res) {
                    done();
                });
        });
    });

    it('Approve Attribute validation Request - Request exists and is PENDING_APPROVAL ( to be notarized by second validator )', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_2, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            addToReportData(
                {   testName:"Approve Attribute Validation Request - Request exists and is PENDING_APPROVAL ( to be notarized by second validator )",
                    expected: "SUCCESS"
                }, function (err, res) {
                    done();
                });
        });
    });

    it('Get Attribute validation request - verify the status is IN_PROGRESS after a PENDING_APPROVAL request is APPROVED ', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.IN_PROGRESS);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1); // the request was approved - action
                done();
            });
        });
    });

    it('Get Attribute validation request - verify the status is IN_PROGRESS after a PENDING_APPROVAL request is APPROVED (second validator)', function (done) {

        let param = {};
        param.validator = VALIDATOR_2;

        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.IN_PROGRESS);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1); // the request was approved - action
                done();
            });
        });
    });

    it('Approve Attribute validation Request - Request exists and is PENDING_APPROVAL ( to be rejected )', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            addToReportData(
                {   testName:"Approve Attribute Validation Request - Request exists and is PENDING_APPROVAL",
                    expected: "SUCCESS"
                }, function (err, res) {
                    done();
                });
        });
    });

    it('Get Attribute validation request - verify the status is IN_PROGRESS after a PENDING_APPROVAL request is APPROVED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'phone_number', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.IN_PROGRESS);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                done();
            });
        });
    });

    it('Decline Attribute validation request - Request exists and is in PENDING_APPROVAL', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'email';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postDeclineValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('Get Attribute validation request - verify the status is DECLINED after a PENDING_APPROVAL request is DECLINED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'email', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.DECLINED);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('reason').to.be.eq(REASON_FOR_DECLINE_1024_GOOD);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1); // decline was a successful action
                done();
            });
        });
    });

    it('Cancel Attribute validation request - Request exists and is in PENDING_APPROVAL', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postCancelValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestcancel);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestcancel);
            });
            done();
        });
    });

    it('Get Attribute validation request - verify the status is CANCELLED after a PENDING_APPROVAL request is CANCELLED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.CANCELLED);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1); // cancel was a successful action
                done();
            });
        });
    });

    it('Notarize Attribute validation request - Request exists, is in IN_PROGRESS and NOTARIZATION is correct' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('Get Attribute - Before last notarization - still inactive ( IDENTITY_CARD )', function (done) {
        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('QmNh1KGj4vndExrkT5AKV965zVJBbWBXbzVzmzpYXrsEoF');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(IDENTITY_CARD);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(false);
            done();
        });
    });

    it('Notarize Attribute validation request - Request exists, is in IN_PROGRESS and NOTARIZATION is correct ( second validator )' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_2, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('Get Attribute - After second notarization - becomes active ( IDENTITY_CARD )', function (done) {
        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('QmNh1KGj4vndExrkT5AKV965zVJBbWBXbzVzmzpYXrsEoF');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(IDENTITY_CARD);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(true);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is COMPLETED after a IN_PROGRESS request is NOTARIZED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.COMPLETED);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('validation_type').to.be.eq(constants.validationType.FACE_TO_FACE);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1); // successful notarization
                done();
            });
        });
    });

    it('Reject Attribute validation request - Request exists and is in IN_PROGRESS', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('Get Attribute validation request - verify the status is REJECTED after a IN_PROGRESS request is REJECTED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'phone_number', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.REJECTED);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('reason').to.be.eq(REASON_FOR_REJECT_1024_GOOD);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

});

describe('Generate Report', function () {

    it('Generate Report', function (done) {
        createReport('Report_AttributeShares.xlsx', function (err, res) {
            done();
        });
    });
});

//-----------------------------------------------------------------------------------------------------------------------------------------------

// it('Create approve attribute share request - request already approved', function (done) {
//
//     let params = {};
//     params.applicant = APPLICANT;
//     params.owner = OWNER;
//     params.type = FIRST_NAME;
//
//     let request = createAttributeShareApproval(params);
//     postApproveShareAttributeRequest(request, function (err, res) {
//         console.log(res.body);
//         node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//         node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_APPROVED);
//         done();
//     });
// });
//
// it('Create approve attribute share request - incorrect owner address', function (done) {
//
//     let params = {};
//     params.applicant = APPLICANT;
//     params.owner = INCORRECT_ADDRESS;
//     params.type = FIRST_NAME;
//
//     let request = createAttributeShareApproval(params);
//     postApproveShareAttributeRequest(request, function (err, res) {
//         console.log(res.body);
//         node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//         node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
//         done();
//     });
// });
//
// it('Create approve attribute share request - incorrect applicant address', function (done) {
//
//     let params = {};
//     params.applicant = INCORRECT_ADDRESS;
//     params.owner = OWNER;
//     params.type = FIRST_NAME;
//
//     let request = createAttributeShareApproval(params);
//     postApproveShareAttributeRequest(request, function (err, res) {
//         console.log(res.body);
//         node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//         node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
//         done();
//     });
// });


// VERY LAST TEST :
//  After ALL validations are made :
//      update document ( 3 ways update : only value, only expire_timestamp, only associations ) :
//      all associated attributes that are of requireDocument type have their validations expired


//
// describe('POST Create attribute share request', function () {
//
//     it('Create attribute share - with no share request', function (done) {
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShare(params);
//         postShareAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_SHARE_REQUEST);
//             done();
//         });
//     });
//
//     it('Create attribute share approval - with no share request', function (done) {
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_WITH_NO_SHARE_REQUEST);
//             done();
//         });
//     });
//
//     it('Create attribute share request - successful', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let param = {};
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//         param.applicant = APPLICANT;
//
//         let request = createAttributeShareRequest(param);
//         postAttributeShareRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('transactionId');
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.attributesharerequest);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributesharerequest);
//             });
//             done();
//         });
//     });
//
//     it('Create attribute share request - incorrect owner address', function (done) {
//
//         let param = {};
//         param.owner = INCORRECT_ADDRESS;
//         param.type = FIRST_NAME;
//         param.applicant = APPLICANT;
//
//         let request = createAttributeShareRequest(param);
//         postAttributeShareRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
//             done();
//         });
//     });
//
//     it('Create attribute share request - incorrect applicant address', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//         param.applicant = INCORRECT_ADDRESS;
//
//         let request = createAttributeShareRequest(param);
//         postAttributeShareRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
//             done();
//         });
//     });
//
//     it('Create attribute share request - share request already exists', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//         param.applicant = APPLICANT;
//
//         let request = createAttributeShareRequest(param);
//         postAttributeShareRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_REQUEST_ALREADY_EXISTS);
//             done();
//         });
//     });
//
//     it('Create attribute share request - attribute does not exist', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.type = 'email';
//         param.applicant = APPLICANT;
//
//         let request = createAttributeShareRequest(param);
//         postAttributeShareRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND);
//             done();
//         });
//     });
//
//     it('Create attribute share request - applicant is owner', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//         param.applicant = OWNER;
//
//         let request = createAttributeShareRequest(param);
//         postAttributeShareRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.OWNER_IS_APPLICANT_ERROR);
//             done();
//         });
//     });
// });
//
// describe('GET Attribute share request', function () {
//
//     it('Get attribute share request - no query params', function (done) {
//
//         let param = {};
//
//         getAttributeShareRequest(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_SHARE_PARAMETERS);
//             done();
//         });
//     });
//
//     it('Get attribute share request - with type, owner and applicant', function (done) {
//
//         let param = {};
//         param.applicant = APPLICANT;
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//
//         getAttributeShareRequest(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attribute_share_requests');
//             node.expect(res.body).to.have.property(COUNT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.UNAPPROVED);
//             done();
//         });
//     });
//
//     it('Get attribute share request - only applicant', function (done) {
//
//         let param = {};
//         param.applicant = APPLICANT;
//
//         getAttributeShareRequest(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attribute_share_requests');
//             node.expect(res.body).to.have.property(COUNT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.UNAPPROVED);
//             done();
//         });
//     });
//
//     it('Get attribute share request - only owner and type', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//
//         getAttributeShareRequest(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attribute_share_requests');
//             node.expect(res.body).to.have.property(COUNT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.UNAPPROVED);
//             done();
//         });
//     });
//
//     it('Get attribute share request - no share request for given applicant', function (done) {
//
//         let param = {};
//         param.applicant = APPLICANT_2;
//
//         getAttributeShareRequest(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_REQUESTS_NOT_FOUND);
//             done();
//         });
//     });
// });
//
// describe('POST Approve attribute share request', function () {
//
//     it('Create attribute share - with no approved share request', function (done) {
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShare(params);
//         postShareAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST);
//             done();
//         });
//     });
//
//     it('Create approve attribute share request - successful', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.attributeshareapproval);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshareapproval);
//             });
//             done();
//         });
//     });
//
//     it('Get attribute share request - check flag after approval', function (done) {
//
//         let param = {};
//         param.applicant = APPLICANT;
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//
//         getAttributeShareRequest(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attribute_share_requests');
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.APPROVED);
//             done();
//         });
//     });
//
//     it('Create approve attribute share request - request already approved', function (done) {
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_APPROVED);
//             done();
//         });
//     });
//
//     it('Create approve attribute share request - incorrect owner address', function (done) {
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = INCORRECT_ADDRESS;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
//             done();
//         });
//     });
//
//     it('Create approve attribute share request - incorrect applicant address', function (done) {
//
//         let params = {};
//         params.applicant = INCORRECT_ADDRESS;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
//             done();
//         });
//     });
// });
//
// describe('POST Create attribute share', function () {
//
//     it('Get attribute share - share does not exist', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//         param.applicant = APPLICANT;
//
//         getAttributeShare(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARES_NOT_FOUND);
//             done();
//         });
//     });
//
//     it('Create attribute share - successful', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let param = {};
//         param.owner = OWNER;
//         param.value = 'KLMN';
//         param.type = FIRST_NAME;
//         param.applicant = APPLICANT;
//
//         let request = createAttributeShare(param);
//         postShareAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('transactionId');
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.attributeshare);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshare);
//             });
//             done();
//         });
//     });
//
//     it('Create attribute share - incorrect owner address', function (done) {
//
//         let param = {};
//         param.owner = INCORRECT_ADDRESS;
//         param.value = 'KLMN';
//         param.type = FIRST_NAME;
//         param.applicant = APPLICANT;
//
//         let request = createAttributeShare(param);
//         postShareAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
//             done();
//         });
//     });
//
//     it('Create attribute share - incorrect applicant address', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.value = 'KLMN';
//         param.type = FIRST_NAME;
//         param.applicant = INCORRECT_ADDRESS;
//
//         let request = createAttributeShare(param);
//         postShareAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
//             done();
//         });
//     });
//
//     it('Create attribute share - same share as one already made', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.value = 'KLMN';
//         param.type = FIRST_NAME;
//         param.applicant = APPLICANT;
//
//         let request = createAttributeShare(param);
//         postShareAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_COMPLETED);
//             done();
//         });
//     });
// });
//
// describe('GET Attribute shares', function () {
//
//     it('Get attribute share - share exists, applicant parameter', function (done) {
//
//         let param = {};
//         param.applicant = APPLICANT;
//
//         getAttributeShare(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attribute_shares');
//             node.expect(res.body).to.have.property(COUNT);
//             node.expect(res.body.attribute_shares).to.have.length(1);
//             node.expect(res.body.attribute_shares[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attribute_shares[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attribute_shares[0]).to.have.property('applicant').to.be.eq(APPLICANT);
//             done();
//         });
//     });
//
//     it('Get attribute share - share exists, owner and type parameters', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//
//         getAttributeShare(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attribute_shares');
//             node.expect(res.body).to.have.property(COUNT);
//             node.expect(res.body.attribute_shares).to.have.length(1);
//             node.expect(res.body.attribute_shares[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attribute_shares[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attribute_shares[0]).to.have.property('applicant').to.be.eq(APPLICANT);
//             done();
//         });
//     });
//
//     it('Get attribute share - share exists, owner with no type', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//
//         getAttributeShare(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_SHARE_PARAMETERS);
//             done();
//         });
//     });
//
//     it('Get attribute share - share exists, type with no owner', function (done) {
//
//         let param = {};
//         param.type = FIRST_NAME;
//
//         getAttributeShare(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_SHARE_PARAMETERS);
//             done();
//         });
//     });
//
//     it('Get attribute share request (completed share)', function (done) {
//
//         let param = {};
//         param.applicant = APPLICANT;
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//
//         getAttributeShareRequest(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attribute_share_requests');
//             node.expect(res.body).to.have.property(COUNT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.COMPLETED);
//             done();
//         });
//     });
// });
//
// describe('POST Unapprove attribute share request', function () {
//
//     it('Unapprove attribute share request', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.attributeshareapproval);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeshareapproval);
//             });
//             done();
//         });
//     });
//
//     it('Get attribute share request - unapproved', function (done) {
//
//         let param = {};
//         param.applicant = APPLICANT;
//         param.owner = OWNER;
//         param.type = FIRST_NAME;
//
//         getAttributeShareRequest(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attribute_share_requests');
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('applicant').to.be.eq(APPLICANT);
//             node.expect(res.body.attribute_share_requests[0]).to.have.property('status').to.be.eq(constants.shareStatus.UNAPPROVED);
//             done();
//         });
//     });
//
//     it('Unapprove attribute share request - share request is already unapproved', function (done) {
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_UNAPPROVED);
//             done();
//         });
//     });
//
//     it('Create attribute share - after unapproval', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//         param.value = 'KLMN';
//         param.type = FIRST_NAME;
//         param.applicant = APPLICANT;
//
//         let request = createAttributeShare(param);
//         postShareAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST);
//             done();
//         });
//     });
//
//     it('Unapprove attribute share request - incorrect owner address', function (done) {
//
//         let params = {};
//         params.applicant = APPLICANT;
//         params.owner = INCORRECT_ADDRESS;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
//             done();
//         });
//     });
//
//     it('Unapprove attribute share request - incorrect applicant address', function (done) {
//
//         let params = {};
//         params.applicant = INCORRECT_ADDRESS;
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//
//         let request = createAttributeShareApproval(params);
//         postApproveShareAttributeRequest(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Applicant address is incorrect');
//             done();
//         });
//     });
// });
//
// describe('POST Run reward round', function () {
//
//     it('Run reward round - no attribute consumptions', function (done) {
//
//         let param = {};
//         let request = createRewardRound(param);
//         postRewardRound(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_CONSUMPTIONS_FOR_REWARD_ROUND);
//             done();
//         });
//     });
// });
//
// describe('POST Consume attribute', function () {
//
//     it('Consume attribute - successful', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let unconfirmedBalanceRecipient = 0;
//         let balanceRecipient = 0;
//         getBalance(constants.REWARD_FAUCET, function (err, res) {
//             balanceRecipient = parseInt(res.body.balance);
//             unconfirmedBalanceRecipient = parseInt(res.body.unconfirmedBalance);
//         });
//
//         let params = {};
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//         params.amount = AMOUNT_1;
//
//         let request = createAttributeConsume(params);
//         postConsumeAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.attributeconsume);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeconsume);
//             });
//             getBalance(constants.REWARD_FAUCET, function (err, res) {
//                 let unconfirmedBalanceAfterRecipient = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfterRecipient = parseInt(res.body.balance);
//                 node.expect(balanceAfterRecipient - balanceRecipient === params.amount);
//                 node.expect(unconfirmedBalanceAfterRecipient - unconfirmedBalanceRecipient === params.amount);
//             });
//             done();
//         });
//     });
//
//     it('Consume attribute - amount is 0', function (done) {
//
//         let params = {};
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//         params.amount = 0;
//
//         let request = createAttributeConsume(params);
//         postConsumeAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Value 0 is less than minimum 1');
//             done();
//         });
//     });
//
//     it('Consume attribute - owner address is incorrect', function (done) {
//
//         let params = {};
//         params.owner = INCORRECT_ADDRESS;
//         params.type = FIRST_NAME;
//         params.amount = 1;
//
//         let request = createAttributeConsume(params);
//         postConsumeAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Owner address is incorrect');
//             done();
//         });
//     });
// });
//
// describe('GET Attribute consumptions', function () {
//
//     let timestampConsume1 = 0;
//
//     it('Get attribute consumptions - with type & owner', function (done) {
//
//         let param = {};
//         param.type = FIRST_NAME;
//         param.owner = OWNER;
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attributeConsumptions');
//             node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
//             timestampConsume1 = res.body.attributeConsumptions[0].timestamp;
//             done();
//         });
//     });
//
//     it('Get attribute consumptions - no type & owner', function (done) {
//
//         let param = {};
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Missing required property: owner');
//             done();
//         });
//     });
//
//     it('Get attribute consumptions - owner and no type', function (done) {
//
//         let param = {};
//         param.owner = OWNER;
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Missing required property: type');
//             done();
//         });
//     });
//
//     it('Get attribute consumptions - type and no owner', function (done) {
//
//         let param = {};
//         param.type = FIRST_NAME;
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq('Missing required property: owner');
//             done();
//         });
//     });
//
//     it('Get attribute consumptions - with type & owner & before', function (done) {
//
//         let param = {};
//         param.type = FIRST_NAME;
//         param.owner = OWNER;
//         param.before = timestampConsume1+1;
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attributeConsumptions');
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.eq(timestampConsume1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
//             done();
//         });
//     });
//
//     it('Get attribute consumptions - with type & owner & after', function (done) {
//
//         let param = {};
//         param.type = FIRST_NAME;
//         param.owner = OWNER;
//         param.after = timestampConsume1-1;
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attributeConsumptions');
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.eq(timestampConsume1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
//             done();
//         });
//     });
//
//     it('Get attribute consumptions - with type & owner & before & after', function (done) {
//
//         let param = {};
//         param.type = FIRST_NAME;
//         param.owner = OWNER;
//         param.before = timestampConsume1+1;
//         param.after = timestampConsume1-1;
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attributeConsumptions');
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.eq(timestampConsume1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
//             done();
//         });
//     });
//
//     it('Get attribute consumptions - with type & owner & before & after - no results', function (done) {
//
//         let param = {};
//         param.type = FIRST_NAME;
//         param.owner = OWNER;
//         param.before = timestampConsume1-1;
//         param.after = timestampConsume1+1;
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attributeConsumptions');
//             node.expect(res.body.attributeConsumptions).to.have.length(0);
//             done();
//         });
//     });
// });
//
// describe('POST Consume attribute', function () {
//
//     it('Consume attribute - again, different amount', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let unconfirmedBalanceRecipient = 0;
//         let balanceRecipient = 0;
//         getBalance(constants.REWARD_FAUCET, function (err, res) {
//             unconfirmedBalanceRecipient = parseInt(res.body.unconfirmedBalance);
//             balanceRecipient = parseInt(res.body.balance);
//         });
//
//         let params = {};
//         params.owner = OWNER;
//         params.type = FIRST_NAME;
//         params.amount = AMOUNT_2;
//
//         let request = createAttributeConsume(params);
//         postConsumeAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.attributeconsume);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributeconsume);
//             });
//             getBalance(constants.REWARD_FAUCET, function (err, res) {
//                 let unconfirmedBalanceAfterRecipient = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfterRecipient = parseInt(res.body.balance);
//                 node.expect(balanceAfterRecipient - balance === params.amount);
//                 node.expect(unconfirmedBalanceAfterRecipient - unconfirmedBalanceRecipient === params.amount);
//             });
//             done();
//         });
//     });
//
//     it('Get attribute consumptions - with type & owner', function (done) {
//
//         let param = {};
//         param.type = FIRST_NAME;
//         param.owner = OWNER;
//
//         getAttributeConsumptions(param, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('attributeConsumptions');
//             node.expect(res.body).to.have.property(COUNT).to.be.eq(2);
//             node.expect(res.body.attributeConsumptions).to.have.length(2);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('attribute_id').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('timestamp').to.be.at.least(1);
//             node.expect(res.body.attributeConsumptions[0]).to.have.property('amount').to.be.eq(AMOUNT_1);
//             node.expect(res.body.attributeConsumptions[1]).to.have.property('amount').to.be.eq(AMOUNT_2);
//             done();
//         });
//     });
//
//     it('Consume attribute - attribute does not exist', function (done) {
//
//         let params = {};
//         params.owner = OWNER;
//         params.type = 'ssn';
//         params.amount = 1;
//
//         let request = createAttributeConsume(params);
//         postConsumeAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND);
//             done();
//         });
//     });
// });
//
// describe('POST Run reward round - with attribute consumptions', function () {
//
//     it('Run reward round - with attribute consumptions', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let param = {};
//         let request = createRewardRound(param);
//         postRewardRound(request, function (err, res) {
//             console.log(res.body);
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.rewardRound);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.rewardRound);
//             });
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('transactionId');
//             done();
//         });
//     });
//
//     it('Update Last reward round - successful', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let param = {};
//         let request = createUpdateRewardRound(param);
//
//         postUpdateRewardRound(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('transactionId');
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.updateRewardRound);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.updateRewardRound);
//             });
//             done();
//         });
//     });
//
//     it('Update Last reward round - no update needed', function (done) {
//
//         let param = {};
//         let request = createUpdateRewardRound(param);
//
//         postUpdateRewardRound(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('message').to.be.eq(messages.REWARD_ROUND_WITH_NO_UPDATE);
//             done();
//         });
//     });
// });
//
// describe('POST Create attribute with expiry in the future', function () {
//
//     it('Create attribute - with expiry in the future', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//
//         let param = {};
//         time = slots.getTime() + 20000;
//         param.expire_timestamp = time;
//         param.type = 'email';
//         param.value = EMAIL;
//         let request = createAttributeRequest(param);
//
//         postAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body).to.have.property('transactionId');
//             sleep.msleep(SLEEP_TIME);
//             getBalance(OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balance - balanceAfter === constants.fees.createattribute);
//                 node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.createattribute);
//             });
//             done();
//         });
//     });
//
//     it('Get attribute - with expiry in the future' , function (done) {
//         getAttribute(OTHER_OWNER, 'email', function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//             node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
//             node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
//             node.expect(res.body.attributes[0]).to.have.property('value').to.eq(EMAIL);
//             node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
//             node.expect(res.body.attributes[0]).to.have.property('type').to.eq('email');
//             node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.be.eq(time);
//             done();
//         });
//     });
// });
//

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
    request.asset.share[0].owner = param.owner ? param.owner : OWNER;
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
    request.asset.share[0].owner = param.owner ? param.owner : OWNER;
    request.asset.share[0].applicant = param.applicant ? param.applicant : APPLICANT;

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

function createAnswerAttributeValidationRequest(param) {
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
    if (param.validationType){
        request.asset.validation[0].validationType = param.validationType;
    }
    if (param.reason){
        request.asset.validation[0].reason = param.reason;
    }

    console.log(request);
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

function getAttributeTypesList(done) {
    node.get('/api/attributes/types/list', done);
}

function postAttribute(params, done) {
    node.post('/api/attributes', params, done);
}

function putAttributeUpdate(params, done) {
    node.put('/api/attributes', params, done);
}

function postAttributeValidationRequest(params, done) {
    node.post('/api/attribute-validations/validationrequest', params, done);
}

function postApproveValidationAttributeRequest(params, done) {
    node.post('/api/attribute-validations/approve', params, done);
}

function postDeclineValidationAttributeRequest(params, done) {
    node.post('/api/attribute-validations/decline', params, done);
}

function postNotarizeValidationAttributeRequest(params, done) {
    node.post('/api/attribute-validations/notarize', params, done);
}

function postRejectValidationAttributeRequest(params, done) {
    node.post('/api/attribute-validations/reject', params, done);
}

function postCancelValidationAttributeRequest(params, done) {
    node.post('/api/attribute-validations/cancel', params, done);
}

function postAttributeShareRequest(params, done) {
    node.post('/api/attribute-shares/sharerequest', params, done);
}

function postApproveShareAttributeRequest(params, done) {
    node.post('/api/attribute-shares/approvesharerequest', params, done);
}

function postShareAttribute(params, done) {
    node.post('/api/attribute-shares/share', params, done);
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
    let url = '/api/attribute-validations/validationrequest';
    if (params.validator || params.attributeId || params.owner) {
        url += '?';
    }
    if (params.validator) {
        url += '&validator=' + '' + params.validator;
    }
    if (params.attributeId) {
        url += '&attributeId=' + '' + params.attributeId;
    }
    if (params.owner) {
        url += '&owner=' + '' + params.owner;
    }
    node.get(url, done);
}

function getAttributeShareRequest(params, done) {
    let url = '/api/attribute-shares/sharerequest';
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
    let url = '/api/attribute-shares/share';
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

function getAttributeValidationScore(params, done) {
    let url = '/api/attribute-validations/validationscore';
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

function getAttributeValidationRequests(params, done) {

    let url = '/api/attribute-validations/validationrequest/';
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
    if (params.status) {
        url += '&status=' + '' + params.status;
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

