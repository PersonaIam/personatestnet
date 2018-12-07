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

//'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';
//'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';

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
const ALIAS = 'alias';
const EMAIL = 'email';
const INCORRECT_ATTRIBUTE_TYPE = 'noSuchType';

const ADDRESS_VALUE = 'Denver';
const NAME_VALUE = "JOE";
const SECOND_NAME_VALUE = "QUEEN";
const THIRD_ID_VALUE = "QUEENS";
const EMAIL_VALUE = 'yeezy@gmail.com';
const EMAIL_VALUE2 = 'yeezy2@gmail.com';
const PHONE_NUMBER_VALUE = '345654321';
const BIRTHPLACE_VALUE = 'Calgary';
const DEFAULT_AMOUNT = 0;

const PROVIDER = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';
const PROVIDER_SECRET = "isolate spoil weekend protect swallow trap brown cross message patient public reward";
const PROVIDER_PUBLIC_KEY = '032699280d1527ed944131ac488fe264a80617b0acc9305fe0d40c61b9a1b924f9';
const SERVICE_NAME = 'Ada';             // to be used by Approve Identity Use Request
const SERVICE2_NAME = 'Anabella';       // to be used by End Identity Use Request
const SERVICE3_NAME = 'Amy';            // to be used by Decline Identity Use Request
const SERVICE4_NAME = 'Arielle';        // to be used by Cancel Identity Use Request

const SERVICE5_NAME = 'Ali';            // to be used by Create Identity Use Request on Inactive Service
const SERVICE6_NAME = 'Aria';           // to be used by Approve Identity Use Request on Inactive Service
const SERVICE7_NAME = 'Akiane';         // to be used by End Identity Use Request on Inactive Service
const SERVICE8_NAME = 'Anne';           // to be used by Decline Identity Use Request on Inactive Service
const SERVICE9_NAME = 'Astrid';         // to be used by Cancel Identity Use Request on Inactive Service

const DESCRIPTION = 'Modus';

const REASON_FOR_DECLINE_1024_GOOD =
    '1000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';
const REASON_FOR_REJECT_1024_GOOD =
    '1000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';

const REASON_FOR_DECLINE_1025_TOO_LONG =
    '10000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';

// RESULTS

const SUCCESS = 'success';
const ERROR = 'error';
const COUNT = 'count';
const TRUE = true;
const FALSE = false;
const STATUS = 'status';
const ATTRIBUTES = 'attributes';
const REASON = 'reason';

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

// Setup Attributes

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

// Setup Services

describe('Create Services', function() {

    it('Create Service - First Service - will store the approved request', function (done) {

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

    it('Create Service - Second Service - will store the approved + ended request', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE2_NAME;
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

    it('Create Service - Third Service - will store the cancelled request', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE3_NAME;
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

    it('Create Service - Fourth Service - will store the denied request', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE4_NAME;
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

    it('Create Service - Fifth Service - will be used to create requests on an inactive service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE5_NAME;
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

    it('Create Service - Sixth Service - will be used to approve requests on an inactive service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE6_NAME;
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

    it('Create Service - Seventh Service - will be used to end requests on an inactive service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE7_NAME;
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

    it('Create Service - Eighth Service - will be used to decline requests on an inactive service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE8_NAME;
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

    it('Create Service - Ninth Service - will be used to cancel requests on an inactive service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE9_NAME;
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

    it('Get Services by provider - 9 results', function (done) {
        getServices({provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(9);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(9);
            done();
        });
    });

})

// Setup Validation Requests

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

describe('Approve/Decline/Notarize/Reject/Cancel attribute validation request', function () {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.CANCELED);
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

// Identity Use Requests

describe('Create Identity Use Requests - negative scenarios', function() {

    it('Create Identity Use Request - action is made by the provider', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_SENDER_IS_NOT_OWNER_ERROR);
            done();
        });
    });

    it('Create Identity Use Request - IDENTITY_CARD attribute has just one completed validation, which is insufficient to become active', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.CANNOT_CREATE_IDENTITY_USE_REQUEST_SOME_REQUIRED_SERVICE_ATTRIBUTES_ARE_EXPIRED_OR_INACTIVE);
            done();
        });
    });
})

describe('Create Identity Use Requests - SUCCESS', function () {

    it('Get Identity Use Requests - no results', function (done) {

        let param = {};

        param.serviceName = SERVICE_NAME;
        param.serviceProvider = PROVIDER;

        getIdentityUseRequests(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('identity_use_requests').to.have.length(0);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            done();
        });
    });

    it('Notarize Attribute validation request - Request exists, is in IN_PROGRESS and NOTARIZATION is correct ( second validator )', function (done) {

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

    it('Create Identity Use Request - IDENTITY_CARD attribute is active, but the request contains a different attribute value', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.values = [{type : 'first_name', value:'HHH'}];

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.CANNOT_CREATE_IDENTITY_USE_REQUEST_MISSING_REQUIRED_SERVICE_ATTRIBUTES_VALUES);
            done();
        });
    });

    it('Create Identity Use Request - SUCCESS -> attribute has 2 completed validations, which is enough to become active', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequest);
            });
            done();
        });
    });

    it('Create Identity Use Request - SUCCESS -> For the second service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequest);
            });
            done();
        });
    });

    it('Create Identity Use Request - SUCCESS -> For the third service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE3_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequest);
            });
            done();
        });
    });

    it('Create Identity Use Request - SUCCESS -> For the fourth service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE4_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequest);
            });
            done();
        });
    });

    it('Get Identity Use Request - Using the attributeId and serviceId', function (done) {

        let param = {};

        getServices({provider: PROVIDER, name : SERVICE_NAME}, function (err, res) {
            param.serviceId = res.body.services[0].id;
            getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
                param.attributeId = res.body.attributes[0].id;
                getIdentityUseRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                    node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.PENDING_APPROVAL);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(ATTRIBUTES);
                    done();
                });
            });
        });
    });

    it('Get Identity Use Request - Using the service provider', function (done) {

        let param = {serviceProvider : PROVIDER};

        getIdentityUseRequests(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('identity_use_requests').to.have.length(4);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(4);
            node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.PENDING_APPROVAL);
            done();
        });
    });

    it('Get Identity Use Request - Using the owner', function (done) {

        let param = {owner : OWNER};

        getIdentityUseRequests(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('identity_use_requests').to.have.length(4);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(4);
            node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.PENDING_APPROVAL);
            done();
        });
    });
});

describe('Approve Identity Use Request', function () {

    it('Approve Identity Use Request -> Request is PENDING APPROVAL, action is made by the OWNER instead of the PROVIDER', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_PROVIDER_ERROR);
            done();
        });
    });

    it('Approve Identity Use Request - SUCCESS -> Request goes from Pending Approval to ACTIVE', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequestapprove);
            });
            done();
        });
    });

    it('Get Identity Use Request - ACTIVE', function (done) {

        let param = {};

        getServices({provider: PROVIDER, name: SERVICE_NAME}, function (err, res) {
            param.serviceId = res.body.services[0].id;
            getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
                param.attributeId = res.body.attributes[0].id;
                getIdentityUseRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                    node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.ACTIVE);
                    done();
                });
            });
        })
    })

    it('Approve Identity Use Request -> Request is already ACTIVE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Decline Identity Use Request -> Request is already ACTIVE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE_NAME;
        param.serviceProvider = PROVIDER;
        param.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerIdentityUseRequest(param);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Cancel Identity Use Request -> Request is already ACTIVE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postCancelIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });
})

describe('End Identity Use Request', function () {

    it('End Identity Use Request -> Request is still PENDING_APPROVAL', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postEndIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_ACTIVE);
            done();
        });
    });

    it('Approve Identity Use Request - SUCCESS -> Request goes from Pending Approval to ACTIVE', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequestapprove);
            });
            done();
        });
    });

    it('End Identity Use Request -> Request is ACTIVE, action is made by the PROVIDER instead of the OWNER', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postEndIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR);
            done();
        });
    });

    it('End Identity Use Request - SUCCESS -> Request goes from ACTIVE to ENDED', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postEndIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequestend);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequestend);
            });
            done();
        });
    });

    it('Get Identity Use Request - ENDED', function (done) {

        let param = {};

        getServices({provider: PROVIDER, name: SERVICE2_NAME}, function (err, res) {
            param.serviceId = res.body.services[0].id;
            getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
                param.attributeId = res.body.attributes[0].id;
                getIdentityUseRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                    node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.ENDED);
                    done();
                });
            });
        })
    })

    it('Approve Identity Use Request -> Request is already ENDED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Decline Identity Use Request -> Request is already ENDED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;
        param.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerIdentityUseRequest(param);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Cancel Identity Use Request -> Request is already ENDED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postCancelIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('End Identity Use Request -> Request is already ENDED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE2_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postEndIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_ACTIVE);
            done();
        });
    });
})

describe('Decline Identity Use Request', function () {

    it('Decline Identity Use Request -> Request is PENDING_APPROVAL, action is made by the OWNER instead of the PROVIDER', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE3_NAME;
        param.serviceProvider = PROVIDER;
        param.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerIdentityUseRequest(param);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_PROVIDER_ERROR);
            done();
        });
    });

    it('Decline Identity Use Request - no reason is provided for declining the identity use request', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE3_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.DECLINE_IDENTITY_USE_REQUEST_NO_REASON);
            done();
        });
    });

    it('Decline Identity Use Request - Request exists and is in PENDING_APPROVAL, but reason is too long', function (done) {

        let params = {};
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = PROVIDER_SECRET;
        params.publicKey = PROVIDER_PUBLIC_KEY;
        params.serviceName = SERVICE3_NAME;
        params.serviceProvider = PROVIDER;
        params.reason = REASON_FOR_DECLINE_1025_TOO_LONG;

        let request = createAnswerIdentityUseRequest(params);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REASON_TOO_BIG_DECLINE);
            done();
        });
    });

    it('Get Identity Use Request - Still PENDING_APPROVAL after the incorrect declinings', function (done) {

        let param = {};

        getServices({provider: PROVIDER, name: SERVICE3_NAME}, function (err, res) {
            param.serviceId = res.body.services[0].id;
            getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
                param.attributeId = res.body.attributes[0].id;
                getIdentityUseRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                    node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.PENDING_APPROVAL);
                    done();
                });
            });
        })
    })

    it('Decline Identity Use Request - SUCCESS -> Request goes from PENDING_APPROVAL to DECLINED', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE3_NAME;
        param.serviceProvider = PROVIDER;
        param.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerIdentityUseRequest(param);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequestdecline);
            });
            done();
        });
    });

    it('Get Identity Use Request - DECLINED', function (done) {

        let param = {};

        getServices({provider: PROVIDER, name: SERVICE3_NAME}, function (err, res) {
            param.serviceId = res.body.services[0].id;
            getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
                param.attributeId = res.body.attributes[0].id;
                getIdentityUseRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                    node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.DECLINED);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(REASON).to.be.eq(REASON_FOR_DECLINE_1024_GOOD);
                    done();
                });
            });
        })
    })

    it('Decline Identity Use Request -> Request is already DECLINED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE3_NAME;
        param.serviceProvider = PROVIDER;
        param.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerIdentityUseRequest(param);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Approve Identity Use Request -> Request is already DECLINED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE3_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Cancel Identity Use Request -> Request is already DECLINED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE3_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postCancelIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('End Identity Use Request -> Request is already DECLINED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE3_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postEndIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_ACTIVE);
            done();
        });
    });
})

describe('Cancel Identity Use Request', function () {

    it('Cancel Identity Use Request -> Request is PENDING_APPROVAL, action is made by the PROVIDER instead of the OWNER', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE4_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postCancelIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR);
            done();
        });
    });

    it('Cancel Identity Use Request - SUCCESS -> Request goes from PENDING_APPROVAL to CANCELED', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE4_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postCancelIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequestcancel);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequestcancel);
            });
            done();
        });
    });

    it('Get Identity Use Request - CANCELED', function (done) {

        let param = {};

        getServices({provider: PROVIDER, name: SERVICE4_NAME}, function (err, res) {
            param.serviceId = res.body.services[0].id;
            getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
                param.attributeId = res.body.attributes[0].id;
                getIdentityUseRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                    node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.CANCELED);
                    done();
                });
            });
        })
    })

    it('Decline Identity Use Request -> Request is already CANCELED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE4_NAME;
        param.serviceProvider = PROVIDER;
        param.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerIdentityUseRequest(param);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Approve Identity Use Request -> Request is already CANCELED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE4_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Cancel Identity Use Request -> Request is already CANCELED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE4_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postCancelIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('End Identity Use Request -> Request is already CANCELED', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE4_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postEndIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_IDENTITY_USE_REQUEST_NOT_ACTIVE);
            done();
        });
    });
})

describe('Actions on an inactive service', function () {

    // Inactivate Fifth Service ( for CREATE action )

    it('Inactivate Service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.name = SERVICE5_NAME;
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

    it('Get Service - After Inactivation' , function (done) {
        getServices({name: SERVICE5_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].status).to.be.eq(constants.serviceStatus.INACTIVE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('Create Identity Use Request - Service is INACTIVE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE5_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_FOR_INACTIVE_SERVICE);
            done();
        });
    });

    // Inactivate Sixth Service ( for APPROVE action )

    it('Create Identity Use Request - SUCCESS -> For the sixth service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE6_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequest);
            });
            done();
        });
    });

    it('Inactivate Service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.name = SERVICE6_NAME;
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

    it('Get Service - After Inactivation' , function (done) {
        getServices({name: SERVICE6_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].status).to.be.eq(constants.serviceStatus.INACTIVE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('Approve Identity Use Request -> Service is INACTIVE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE6_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_ACTION_FOR_INACTIVE_SERVICE);
            done();
        });
    });

    // Inactivate Seventh Service ( for END action )

    it('Create Identity Use Request - SUCCESS -> For the seventh service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE7_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequest);
            });
            done();
        });
    });

    it('Approve Identity Use Request - SUCCESS -> Request goes from Pending Approval to ACTIVE', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE7_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postApproveIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequestapprove);
            });
            done();
        });
    });

    it('Inactivate Service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.name = SERVICE7_NAME;
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

    it('Get Service - After Inactivation' , function (done) {
        getServices({name: SERVICE7_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].status).to.be.eq(constants.serviceStatus.INACTIVE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('End Identity Use Request -> Service is INACTIVE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE7_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postEndIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_ACTION_FOR_INACTIVE_SERVICE);
            done();
        });
    });

    // Inactivate Eighth Service ( for DECLINE action )

    it('Create Identity Use Request - SUCCESS -> For the eighth service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE8_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequest);
            });
            done();
        });
    });

    it('Inactivate Service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.name = SERVICE8_NAME;
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

    it('Get Service - After Inactivation' , function (done) {
        getServices({name: SERVICE8_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].status).to.be.eq(constants.serviceStatus.INACTIVE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('Decline Identity Use Request - Service is INACTIVE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = PROVIDER_SECRET;
        param.publicKey = PROVIDER_PUBLIC_KEY;
        param.serviceName = SERVICE8_NAME;
        param.serviceProvider = PROVIDER;
        param.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerIdentityUseRequest(param);
        postDeclineIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_ACTION_FOR_INACTIVE_SERVICE);
            done();
        });
    });

    // Inactivate Ninth Service ( for CANCEL action )

    it('Create Identity Use Request - SUCCESS -> For the ninth service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE9_NAME;
        param.serviceProvider = PROVIDER;

        let request = createIdentityUseRequest(param);
        postIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            sleep.msleep(SLEEP_TIME);
            getBalance(OWNER, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.identityuserequest);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.identityuserequest);
            });
            done();
        });
    });

    it('Inactivate Service', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.name = SERVICE9_NAME;
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

    it('Get Service - After Inactivation' , function (done) {
        getServices({name: SERVICE9_NAME}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(1);
            node.expect(res.body.services[0].status).to.be.eq(constants.serviceStatus.INACTIVE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('Cancel Identity Use Request - Service is INACTIVE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.serviceName = SERVICE9_NAME;
        param.serviceProvider = PROVIDER;

        let request = createAnswerIdentityUseRequest(param);
        postCancelIdentityUseRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.IDENTITY_USE_REQUEST_ACTION_FOR_INACTIVE_SERVICE);
            done();
        });
    });

})

describe('Generate Report', function () {

    it('Generate Report', function (done) {
        createReport('Report_IdentityUses.xlsx', function (err, res) {
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

function createIdentityUseRequest(param) {

    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.identityuse = [];
    request.asset.identityuse[0] = {};
    request.asset.identityuse[0].owner = param.owner ? param.owner : OWNER;
    request.asset.identityuse[0].serviceName = param.serviceName ? param.serviceName : SERVICE_NAME;
    request.asset.identityuse[0].serviceProvider = param.serviceProvider ? param.serviceProvider : PROVIDER;
    request.asset.identityuse[0].attributes = param.values ? param.values : [{type : 'identity_card', value:'HHH'}];

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

function createAnswerIdentityUseRequest(param) {
    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.identityuse = [];
    request.asset.identityuse[0] = {};
    request.asset.identityuse[0].type = param.type ? param.type : FIRST_NAME;
    request.asset.identityuse[0].owner = param.owner ? param.owner : OWNER;
    request.asset.identityuse[0].serviceName = param.serviceName ? param.serviceName : SERVICE_NAME;
    request.asset.identityuse[0].serviceProvider = param.serviceProvider ? param.serviceProvider : PROVIDER;
    if (param.reason){
        request.asset.identityuse[0].reason = param.reason;
    }

    console.log(request);
    return request;
}

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

// actions on attributes

function getAttributeTypeByName(name, done) {
    node.get('/api/attributes/types?name=' + name, done);
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

// actions on validation requests

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

function getIdentityUseRequests(params, done) {
    let url = '/api/identity-use';
    if (params.attributeId && params.serviceId) {
        url += '?attributeId=' + '' + params.attributeId + '&serviceId=' + '' + params.serviceId;
    } else {
        if (params.serviceName || params.serviceProvider || params.owner) {
            url += '?';
        }
        if (params.serviceName) {
            url += '&serviceName=' + '' + params.serviceName;
        }
        if (params.serviceProvider) {
            url += '&serviceProvider=' + '' + params.serviceProvider;
        }
        if (params.owner) {
            url += '&owner=' + '' + params.owner;
        }
    }
    node.get(url, done);
}

function postIdentityUseRequest(params, done) {
    node.post('/api/identity-use', params, done);
}

function postApproveIdentityUseRequest(params, done) {
    node.post('/api/identity-use/approve', params, done);
}

function postDeclineIdentityUseRequest(params, done) {
    node.post('/api/identity-use/decline', params, done);
}

function postEndIdentityUseRequest(params, done) {
    node.post('/api/identity-use/end', params, done);
}

function postCancelIdentityUseRequest(params, done) {
    node.post('/api/identity-use/cancel', params, done);
}

// actions on services

function postService(params, done) {
    node.post('/api/services', params, done);
}

// others

function getBalance(address, done) {
    node.get('/api/accounts/getBalance?address=' + address, done);
}

function putTransaction(params, done) {
    node.put('/api/transactions', params, done);
}

function getTransaction(params, done) {
    node.get(`/api/transactions/get?id=${params.id}`, done);
}

function getServices(params, done) {

    let url = '/api/services';
    if (params.name || params.provider || params.status) {
        url += '?';
    }
    if (params.name) {
        url += '&name=' + '' + params.name;
    }
    if (params.provider) {
        url += '&provider=' + '' + params.provider;
    }
    if (params.status) {
        url += '&status=' + '' + params.status;
    }
    node.get(url, done);
}

function putInactivateService(params, done) {
    node.put('/api/services/inactivate', params, done);
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

