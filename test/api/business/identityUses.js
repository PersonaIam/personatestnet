'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('../../node.js');
let sleep = require('sleep');
let messages = require('../../../helpers/messages.js');
let constants = require('../../../helpers/constants.js');
let slots = require('../../../helpers/slots.js');

// TEST DATA

const OWNER = 'LX9JSTgnd34zPQaE665qQqXdqiPfJ1gAoJ';
const SECRET = "seven melt double auto antique liquid damp enough road man candy second";
const PUBLIC_KEY = '0338fee3edbaea4eb28dbe78a9340ecf25ad9f363e523dd72e691ab0d6d2bc4f92';

const OTHER_OWNER = 'LSuxyEmzrxEA95aDjDWEjUTEKJwg4eWbvu';
const OTHER_SECRET = "bulb slide ribbon confirm school grit wheel judge side radio vessel refuse";
const OTHER_PUBLIC_KEY = '034e3e86a3bf2af24a660e41db3900dacf61fb2b38bf451b973c43059524a9545a';

const VALIDATOR = 'LbDsDwL3vt9e35f3djJZHxWHfHGXntq3N5';
const VALIDATOR_SECRET = "project sock cycle embrace chest hen praise merry two receive enable foam";
const VALIDATOR_PUBLIC_KEY = '02e89df52a352dc7d3f4df99ab1deddb9dd0dc882f08cf79936c861276dbaca99a';

const VALIDATOR_2 = 'LWBeHAE1LjaPXLsedn3aqGtNU4zw6CNkR9';
const VALIDATOR_SECRET_2 = "net strategy innocent mutual pink oval virtual song legal grocery swamp season";
const VALIDATOR_PUBLIC_KEY_2 = '0380e1c760787e321f8ae42d13bec4cc57f09d3ab12a642ec24b29e6501f23c115';

const PROVIDER = 'LSDquEuwwggJJSHjqN46oNj1QWa3xaDqhD';
const PROVIDER_SECRET = "family valve solve message ensure front desert maze rug cabin intact party";
const PROVIDER_PUBLIC_KEY = '030cca25405fa440277a2d226656bc281744657f805c1e66480c132d8f89a8692e';

const FIRST_NAME = 'first_name';
const PHONE_NUMBER = 'phone_number';
const BIRTHPLACE = 'birthplace';
const ADDRESS = 'address';
const IDENTITY_CARD = 'identity_card';

const ADDRESS_VALUE = 'Denver';
const NAME_VALUE = "JOE";
const SECOND_NAME_VALUE = "QUEEN";
const THIRD_ID_VALUE = "QUEENS";
const PHONE_NUMBER_VALUE = '345654321';
const BIRTHPLACE_VALUE = 'Calgary';

const SERVICE_NAME = 'Ada';             // to be used by Approve Identity Use Request
const SERVICE2_NAME = 'Anabella';       // to be used by End Identity Use Request
const SERVICE3_NAME = 'Amy';            // to be used by Decline Identity Use Request
const SERVICE4_NAME = 'Arielle';        // to be used by Cancel Identity Use Request

const SERVICE5_NAME = 'Ali';            // to be used by Create Identity Use Request on Inactive Service
const SERVICE6_NAME = 'Aria';           // to be used by Approve Identity Use Request on Inactive Service
const SERVICE7_NAME = 'Akiane';         // to be used by End Identity Use Request on Inactive Service
const SERVICE8_NAME = 'Anne';           // to be used by Decline Identity Use Request on Inactive Service
const SERVICE9_NAME = 'Astrid';         // to be used by Cancel Identity Use Request on Inactive Service
const SERVICE10_NAME = 'Amelie';        // to be used by Create Identity Use Request with insufficient validation

const DESCRIPTION_VALUE = 'Modus';

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
const REASON = 'reason';
const CUSTOM_VALIDATIONS = 2;
const ONE_VALIDATION = 1;

// TEST UTILS

const SLEEP_TIME = 10001; // in milliseconds
let transactionList = [];
let ipfsTransaction = {};

// TESTS

describe('Prerequisites ', function () {

    // this test is only used to generate the public key for the owner account, it is not supposed to actually send the amount
    it('Send funds, placeholder to generate the public key', function (done) {
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

    it('Send funds to the other owner', function (done) {
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

    it('Send funds to the validator', function (done) {
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

    it('Send funds to the second validator', function (done) {
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

describe('Setup Attribute ', function () {

    it('Create FIRST_NAME', function (done) {

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

    it('Create PHONE_NUMBER ', function (done) {

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

    it('Create BIRTHPLACE ', function (done) {

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

    it('Get FIRST_NAME', function (done) {
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

describe('Setup Attribute (File Data Type)', function () {

    it('Create IDENTITY_CARD ', function (done) {

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

    it('IDENTITY_CARD creation transaction should have the IPFS hash as the attribute value', function (done) {
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

    it('Get IDENTITY_CARD', function (done) {
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

// Setup Attributes

describe('Setup Attribute ', function () {

    it('Create FIRST_NAME, other owner', function (done) {

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

    it('Create IDENTITY_CARD, other owner, with associations', function (done) {

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

    it('Create ADDRESS', function (done) {

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

    it('Get Attributes (Multiple Results) and check order is respected', function (done) {
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

describe('Setup Services ', function() {

    it('First Service (will store the approved request)', function (done) {

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

    it('Second Service (will store the approved + ended request)', function (done) {

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

    it('Third Service (will store the canceled request)', function (done) {

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

    it('Fourth Service (will store the denied request)', function (done) {

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

    it('Fifth Service (will be used to create requests on an inactive service)', function (done) {

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

    it('Sixth Service (will be used to approve requests on an inactive service)', function (done) {

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

    it('Seventh Service (will be used to end requests on an inactive service)', function (done) {

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

    it('Eighth Service (will be used to decline requests on an inactive service)', function (done) {

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

    it('Ninth Service (will be used to cancel requests on an inactive service)', function (done) {

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

    it('Tenth Service (will have a requirement of just 1 validations per attribute)', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(PROVIDER, function (err, res) {
            balance = parseInt(res.body.balance);
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
        });

        let param = {};
        param.name = SERVICE10_NAME;
        param.validations = ONE_VALIDATION;
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

    it('Make sure all 10 services are created', function (done) {
        getServices({provider: PROVIDER}, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.services).to.have.length(10);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(10);
            node.expect(res.body.services[0].validations_required).to.be.eq(CUSTOM_VALIDATIONS);
            node.expect(res.body.services[1].validations_required).to.be.eq(CUSTOM_VALIDATIONS);
            node.expect(res.body.services[9].validations_required).to.be.eq(ONE_VALIDATION);
            done();
        });
    });

});

// Setup Validation Requests

describe('Setup Attribute validation request ', function () {

    it('Create for IDENTITY_CARD', function (done) {

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

    it('Create for PHONE_NUMBER', function (done) {

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

    it('Create for BIRTHPLACE', function (done) {

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

    it('Create for IDENTITY_CARD, second validator', function (done) {

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

    it('Get IDENTITY_CARD (attribute is still inactive, with 1 request in PENDING_APPROVAL)', function (done) {
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

    it('Get 3 existing requests, using validator', function (done) {

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

// Setup Validation Requests ( Actions )

describe('Attribute validation request actions ', function () {

    it('Approve - Request exists and is PENDING_APPROVAL ( to be notarized )', function (done) {

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
            done();
        });
    });

    it('Approve - Request exists and is PENDING_APPROVAL ( to be notarized by second validator )', function (done) {

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
            done();
        });
    });

    it('Get - Verify the request status is IN_PROGRESS after a PENDING_APPROVAL request is APPROVED ', function (done) {

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

    it('Get - Verify the status is IN_PROGRESS after a PENDING_APPROVAL request is APPROVED (second validator)', function (done) {

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

    it('Approve - Request exists and is PENDING_APPROVAL ( to be rejected )', function (done) {

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
            done();
        });
    });

    it('Get - Verify the status is IN_PROGRESS after a PENDING_APPROVAL request is APPROVED', function (done) {

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

    it('Cancel - Request exists and is in PENDING_APPROVAL', function (done) {

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

    it('Get - Verify the status is canceled after a PENDING_APPROVAL request is canceled', function (done) {

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

    it('Notarize - Request exists, is in IN_PROGRESS and NOTARIZATION is correct' , function (done) {

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

    it('Get - Verify the status is COMPLETED after a IN_PROGRESS request is NOTARIZED', function (done) {

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

    it('Get IDENTITY_CARD (attribute is now active, with 1 request COMPLETED)', function (done) {
        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(IDENTITY_CARD);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(true);
            done();
        });
    });

    it('Reject - Request exists and is in IN_PROGRESS', function (done) {

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

    it('Get - Verify the status is REJECTED after an IN_PROGRESS request is REJECTED', function (done) {

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

describe('Create Identity Use Requests ', function () {

    it('FAILURE -> Action is made by the provider', function (done) {

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

    it('FAILURE -> Attribute has just one completed validation, which is insufficient for a service that requires 2 validations', function (done) {

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

    it('SUCCESS -> The service requires a single validation', function (done) {

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
        param.serviceName = SERVICE10_NAME;
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

    it('Get Newly Created Identity Use Request', function (done) {

        let param = {};

        param.serviceName = SERVICE10_NAME;
        param.serviceProvider = PROVIDER;

        getIdentityUseRequests(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
            done();
        });
    });

    it('Notarize - Request exists, is in IN_PROGRESS and NOTARIZATION is correct ( second validator )', function (done) {

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

    it('Get - After second notarization, attribute remains active ( IDENTITY_CARD )', function (done) {
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

    it('FAILURE -> Attribute is active, but the request contains a different attribute value', function (done) {

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

    it('SUCCESS -> Attribute has 2 completed validations, for a service that requires 2 validations', function (done) {

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
        param.values = [{type : 'identity_card', value:'HHH'}];

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

    it('SUCCESS -> For the second service', function (done) {

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
        param.values = [{type : 'identity_card', value:'HHH'}];

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

    it('SUCCESS -> For the third service', function (done) {

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
        param.values = [{type : 'identity_card', value:'HHH3'}];

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

    it('SUCCESS -> For the fourth service', function (done) {

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
        param.values = [{type : 'identity_card', value:'HHH4'}];

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

    it('Get Identity Use Requests - Using the service provider', function (done) {

        let param = {serviceProvider : PROVIDER};

        getIdentityUseRequests(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('identity_use_requests').to.have.length(5);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(5);
            node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.PENDING_APPROVAL);
            node.expect(JSON.parse(res.body.identity_use_requests[0].attributes)[0].value).to.be.eq('QmXaErkZBhwTNSLcesqgmtA3shYqpvqxhdWEydtjo9SEb8');
            node.expect(JSON.parse(res.body.identity_use_requests[1].attributes)[0].value).to.be.eq('QmXaErkZBhwTNSLcesqgmtA3shYqpvqxhdWEydtjo9SEb8');
            done();
        });
    });

    it('Get Identity Use Requests - Using the owner', function (done) {

        let param = {owner : OWNER};

        getIdentityUseRequests(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('identity_use_requests').to.have.length(5);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(5);
            node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.PENDING_APPROVAL);
            done();
        });
    });

    it('Get Identity Use Requests - Using the owner and the serviceId', function (done) {

        let param = {};

        getServices({provider: PROVIDER, name: SERVICE_NAME}, function (err, res) {
            param.serviceId = res.body.services[0].id;
            param.owner = OWNER;
            getIdentityUseRequests(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                node.expect(res.body).to.have.property('validation_requests_count').to.be.eq(2);
                node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.PENDING_APPROVAL);
                done();
            });
        });
    });
});

describe('Approve Identity Use Request', function () {

    it('FAILURE -> Request is in PENDING APPROVAL, but the action is made by the OWNER instead of the PROVIDER', function (done) {

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

    it('SUCCESS -> Request goes from Pending Approval to ACTIVE', function (done) {

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
            param.owner = OWNER;
            getIdentityUseRequests(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.ACTIVE);
                done();
            });
        });
    });

    it('FAILURE -> Request is already ACTIVE', function (done) {

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

    it('FAILURE -> Decline Identity Use Request -> Request is already ACTIVE', function (done) {

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

    it('FAILURE -> Cancel Identity Use Request -> Request is already ACTIVE', function (done) {

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
});

describe('End Identity Use Request', function () {

    it('FAILURE -> Request is still PENDING_APPROVAL', function (done) {

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

    it('Approve Identity Use Request - Request goes from Pending Approval to ACTIVE', function (done) {

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

    it('FAILURE -> Request is ACTIVE, action is made by the PROVIDER instead of the OWNER', function (done) {

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

    it('SUCCESS -> Request goes from ACTIVE to ENDED', function (done) {

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
            param.owner = OWNER;
            getIdentityUseRequests(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.ENDED);
                done();
            });
        });
    });

    it('FAILURE -> Approve Identity Use Request -> Request is already ENDED', function (done) {

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

    it('FAILURE -> Decline Identity Use Request -> Request is already ENDED', function (done) {

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

    it('FAILURE -> Cancel Identity Use Request -> Request is already ENDED', function (done) {

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

    it('FAILURE -> End Identity Use Request -> Request is already ENDED', function (done) {

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
});

describe('Decline Identity Use Request', function () {

    it('FAILURE -> Request is PENDING_APPROVAL, action is made by the OWNER instead of the PROVIDER', function (done) {

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

    it('FAILURE -> No reason is provided for declining the identity use request', function (done) {

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

    it('FAILURE -> Request exists and is in PENDING_APPROVAL, but reason is too long', function (done) {

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

    it('Get Identity Use Request - Still PENDING_APPROVAL after the incorrect declines', function (done) {

        let param = {};

        getServices({provider: PROVIDER, name: SERVICE3_NAME}, function (err, res) {
            param.serviceId = res.body.services[0].id;
            param.owner = OWNER;
            getIdentityUseRequests(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.PENDING_APPROVAL);
                done();
            });
        });
    });

    it('SUCCESS -> Request goes from PENDING_APPROVAL to DECLINED', function (done) {

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
            param.owner = OWNER;
                getIdentityUseRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.DECLINED);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(REASON).to.be.eq(REASON_FOR_DECLINE_1024_GOOD);
                    done();
                });
            });
    });

    it('FAILURE -> Request is already DECLINED', function (done) {

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

    it('FAILURE -> Approve Identity Use Request -> Request is already DECLINED', function (done) {

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

    it('FAILURE -> Cancel Identity Use Request -> Request is already DECLINED', function (done) {

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

    it('FAILURE -> End Identity Use Request -> Request is already DECLINED', function (done) {

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
});

describe('Cancel Identity Use Request', function () {

    it('FAILURE -> Request is PENDING_APPROVAL, action is made by the PROVIDER instead of the OWNER', function (done) {

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

    it('SUCCESS -> Request goes from PENDING_APPROVAL to CANCELED', function (done) {

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
            param.owner = OWNER;
                getIdentityUseRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('identity_use_requests').to.have.length(1);
                    node.expect(res.body.identity_use_requests[0]).to.have.property(STATUS).to.be.eq(constants.identityUseRequestStatus.CANCELED);
                    done();
                });
            });
    });

    it('FAILURE -> Decline Identity Use Request -> Request is already CANCELED', function (done) {

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

    it('FAILURE -> Approve Identity Use Request -> Request is already CANCELED', function (done) {

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

    it('FAILURE -> Cancel Identity Use Request -> Request is already CANCELED', function (done) {

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

    it('FAILURE -> End Identity Use Request -> Request is already CANCELED', function (done) {

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
});

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

    it('FAILURE -> Create Identity Use Request - Service is INACTIVE', function (done) {

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

    it('Create Identity Use Request -> For the sixth service', function (done) {

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
        param.values = [{type : 'identity_card', value:'HHH5'}];

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

    it('FAILURE -> Approve Identity Use Request -> Request is in PENDING_APPROVAL, but the Service is INACTIVE', function (done) {

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

    it('Create Identity Use Request -> For the seventh service', function (done) {

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
        param.values = [{type : 'identity_card', value:'HHH7'}];

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

    it('Approve Identity Use Request -> Request goes from Pending Approval to ACTIVE', function (done) {

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

    it('FAILURE -> End Identity Use Request -> Request is ACTIVE, but the Service is INACTIVE', function (done) {

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

    it('Create Identity Use Request -> For the eighth service', function (done) {

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
        param.values = [{type : 'identity_card', value:'HHH8'}];

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

    it('FAILURE -> Decline Identity Use Request -> Request is in PENDING_APPROVAL, but the Service is INACTIVE', function (done) {

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

    it('Create Identity Use Request -> For the ninth service', function (done) {

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

    it('FAILURE -> Cancel Identity Use Request - Request is in PENDING_APPROVAL, but the Service is INACTIVE', function (done) {

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
    request.asset.service.description = param.description ? param.description : DESCRIPTION_VALUE;
    request.asset.service.provider = param.provider ? param.provider : PROVIDER;
    request.asset.service.attributeTypes = ['identity_card'];
    request.asset.service.validations_required = param.validations ? param.validations : CUSTOM_VALIDATIONS;

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
    if (params.owner && params.serviceId) {
        url += '?owner=' + '' + params.owner + '&serviceId=' + '' + params.serviceId;
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
