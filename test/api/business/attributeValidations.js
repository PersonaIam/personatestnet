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

const VALIDATOR = 'LNJJKBGmC1GZ89XbQ4nfRRwVCZiNig2H9M';
const VALIDATOR_SECRET = "mechanic excuse globe emerge hedgehog food knee shy burden digital copy online";
const VALIDATOR_PUBLIC_KEY = '022a09511647055f00f46d1546595fa5950349ffd8ac477d5684294ea107f4f84c';
const VALIDATOR_2 = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';
const VALIDATOR_SECRET_2 = "isolate spoil weekend protect swallow trap brown cross message patient public reward";
const VALIDATOR_PUBLIC_KEY_2 = '032699280d1527ed944131ac488fe264a80617b0acc9305fe0d40c61b9a1b924f9';

const VALIDATOR_3 = 'Ld9UMYSCaY6r6WFq7xQByULqyyA1S8NvKN';

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
const INCORRECT_ADDRESS = 'ABC';
const INCORRECT_VALIDATION_TYPE = 'INCORRECT_VALIDATION_TYPE';

const REASON_FOR_DECLINE_1024_GOOD =
    '1000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';
const REASON_FOR_DECLINE_1025_TOO_LONG =
    '10000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';
const REASON_FOR_REJECT_1024_GOOD =
    '1000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';
const REASON_FOR_REJECT_1025_TOO_LONG =
    '10000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';

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

    it('Create Attribute - Non file type, with associations', function (done) {

        let params = {};
        params.associations = [1];
        let request = createAttributeRequest(params);

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_ASSOCIATIONS_FOR_NON_FILE_TYPE);

            done();
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

    it('Get Attribute - IDENTITY_CARD - attribute is inactive, with 1 request in PENDING_APPROVAL', function (done) {
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

    it('Create Attribute validation request - incorrect owner address', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.type = FIRST_NAME;
        params.owner = INCORRECT_ADDRESS;

        let request = createAttributeValidationRequest(params);

        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.eq('Owner address is incorrect');
            done();
        });
    });

    it('Create Attribute validation request - incorrect validator address', function (done) {

        let params = {};
        params.validator = INCORRECT_ADDRESS;
        params.type = FIRST_NAME;
        params.owner = OWNER;

        let request = createAttributeValidationRequest(params);

        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.eq('Validator address is incorrect');
            done();
        });
    });

    it('Create Attribute validation request - active validation request already exists', function (done) {

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = IDENTITY_CARD;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATOR_ALREADY_HAS_PENDING_APPROVAL_VALIDATION_REQUEST_FOR_ATTRIBUTE);
            done();
        });
    });

    it('Create Attribute validation request - non existing attribute', function (done) {

        let param = {};
        param.owner = OTHER_OWNER;
        param.secret = OTHER_SECRET;
        param.publicKey = OTHER_PUBLIC_KEY;
        param.type = ADDRESS;
        param.validator = VALIDATOR;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_NOT_FOUND);
            done();
        });
    });

    it('Create Attribute validation request - owner is validator', function (done) {

        let param = {};
        param.owner = OWNER;
        param.type = ADDRESS;
        param.validator = OWNER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.OWNER_IS_VALIDATOR_ERROR);
            done();
        });
    });

    it('Get Attribute validation request - 1 result, using validator and attributeId', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                done();
            });
        });
    });

    it('Get Attribute validation request - verify the status is PENDING_APPROVAL for newly created validation request', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.PENDING_APPROVAL);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                done();
            });
        });
    });

    it('Create Attribute validation request - attribute with no associations and which requires an associated document (ADDRESS)', function (done) {

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = ADDRESS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_WITH_NO_ASSOCIATIONS_CANNOT_BE_VALIDATED);
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
});

describe('Get Attribute validation requests', function () {

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

    it('Get Attribute validation requests - with results, using attributeId', function (done) {

        let param = {};
        param.owner = OWNER;
        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            param.attributeId = res.body.attributes[0].id;
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

    it('Get Attribute validation requests - no results, using validator', function (done) {

        let param = {};
        param.validator = VALIDATOR_3;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
            node.expect(res.body).to.have.property('attribute_validation_requests').to.have.length(0);
            done();
        });
    });

    it('Get Attribute validation requests - no results, using attributeId', function (done) {

        let param = {};
        param.owner = OWNER;

        getAttribute(OWNER, ADDRESS, function (err, res) {
            param.attributeId = res.body.attributes[0].id;
            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property(COUNT).to.be.eq(0);
                node.expect(res.body).to.have.property('attribute_validation_requests').to.have.length(0);
                done();
            });
        });
    });

    it('Get Attribute validation requests - correct parameters, using only owner', function (done) {

        let param = {};
        param.owner = OWNER;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(COUNT).to.be.eq(5);
            node.expect(res.body).to.have.property('attribute_validation_requests').to.have.length(5);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.eq(null);
            done();
        });
    });

    it('Get Attribute validation requests - 4 PENDING_APPROVAL requests, using validator', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttributeValidationRequests(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body).to.have.property(COUNT).to.be.eq(4);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.eq(constants.validationRequestStatus.PENDING_APPROVAL);
            node.expect(res.body.attribute_validation_requests[1]).to.have.property('status').to.eq(constants.validationRequestStatus.PENDING_APPROVAL);
            node.expect(res.body.attribute_validation_requests[2]).to.have.property('status').to.eq(constants.validationRequestStatus.PENDING_APPROVAL);
            node.expect(res.body.attribute_validation_requests[3]).to.have.property('status').to.eq(constants.validationRequestStatus.PENDING_APPROVAL);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.eq(null);
            done();
        });
    });

    it('Get Incomplete Attribute validation requests - 2 incomplete requests, using attributeId', function (done) {

        let param = {};
        getAttribute(OWNER, IDENTITY_CARD, function (err, res) {
            param.attributeId = res.body.attributes[0].id;
            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property(COUNT).to.be.eq(2);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.eq(constants.validationRequestStatus.PENDING_APPROVAL);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.eq(null);
                done();
            });
        });
    });

});

describe('Approve/Decline/Notarize/Reject attribute validation request', function () {

    it('Approve Attribute validation request - Approver is the owner, not the validator', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'email';
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR);
            done();
        });
    });

    it('Decline Attribute validation request - Decliner is the owner, not the validator', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'email';
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;
        params.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postDeclineValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR);
            done();
        });
    });

    it('Cancel Attribute validation request - Canceller is the validator, not the owner', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postCancelValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR);
            done();
        });
    });

    // Notarize/Reject when PENDING_APPROVAL

    it('Notarize Attribute Validation Request - Request is still PENDING_APPROVAL', function (done) {

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
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still PENDING_APPROVAL after a PENDING_APPROVAL request is NOTARIZED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.PENDING_APPROVAL);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.eq(null);
                done();
            });
        });
    });

    it('Reject Attribute Validation Request - Request is still PENDING_APPROVAL', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still PENDING_APPROVAL after a PENDING_APPROVAL request is REJECTED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.PENDING_APPROVAL);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('type');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('owner');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.eq(null);
                done();
            });
        });
    });

    // Successful Approve

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
            done();
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
            done();
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

    it('Notarize Attribute validation request - Action is made by the owner, not the validator', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR);
            done();
        });
    });

    it('Reject Attribute validation request - Action is made by the owner, not the validator', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR);
            done();
        });
    });

    // Approve/Decline when IN_PROGRESS

    it('Approve Attribute Validation Request - Request exists and is already IN_PROGRESS', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });

    });

    it('Get Attribute validation request - verify the status is still IN_PROGRESS after a IN_PROGRESS request is APPROVED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Decline Attribute validation request - Request exists and is already IN_PROGRESS', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postDeclineValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still IN_PROGRESS after a IN_PROGRESS request is DECLINED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Cancel Attribute validation request - Request exists and is already IN_PROGRESS', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;
        params.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postCancelValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still IN_PROGRESS after a IN_PROGRESS request is CANCELLED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Decline Attribute validation request - Request exists and is in PENDING_APPROVAL, but reason is too long', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_DECLINE_1025_TOO_LONG;

        let request = createAnswerAttributeValidationRequest(params);
        postDeclineValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REASON_TOO_BIG_DECLINE);
            done();
        });
    });

    it('Decline Attribute validation request - Request exists and is in PENDING_APPROVAL, but no reason is specified', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postDeclineValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.DECLINE_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON);
            done();
        });
    });

    // Successful Decline

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

    // Successful cancel

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

    // Actions on a DECLINED validation request

    it('Decline Attribute validation request - Request exists and is already DECLINED', function (done) {

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
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still DECLINED after a DECLINED request is DECLINED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });

    });

    it('Approve Attribute validation request - Request exists and is already DECLINED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'email';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;


        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still DECLINED after a DECLINED request is APPROVED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Notarize Attribute validation request - Request exists and is already DECLINED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'email';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still DECLINED after a DECLINED request is NOTARIZED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Reject Attribute validation request - Request exists and is already DECLINED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'email';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1024_GOOD;


        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still DECLINED after a DECLINED request is REJECTED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Cancel Attribute validation request - Request exists and is already DECLINED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'email';
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1024_GOOD;


        let request = createAnswerAttributeValidationRequest(params);
        postCancelValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still DECLINED after a DECLINED request is CANCELLED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Notarize Attribute validation request - Request exists and is in IN_PROGRESS, but validation type is missing', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.MISSING_VALIDATION_TYPE);
            done();
        });
    });

    it('Notarize Attribute validation request - Request exists and is in IN_PROGRESS, but validation type is incorrect', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.validationType = INCORRECT_VALIDATION_TYPE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_VALIDATION_TYPE);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still IN_PROGRESS after a IN_PROGRESS request is incorrectly NOTARIZED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    // Successful Notarization

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

    it('Get Attribute - After last notarization - becomes active ( IDENTITY_CARD )', function (done) {
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

    it('Reject Attribute validation request - Request exists and is in IN_PROGRESS, but reason is too long', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1025_TOO_LONG;

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REASON_TOO_BIG_REJECT);
            done();
        });
    });

    it('Reject Attribute validation request - Request exists and is in IN_PROGRESS, but no reason is specified', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REJECT_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON);
            done();
        });
    });

    // Successful Reject

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

    // Actions on a COMPLETED validation request

    it('Decline Attribute validation request - Request exists and is already COMPLETED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postDeclineValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still COMPLETED after a COMPLETED request is DECLINED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Approve Attribute validation request - Request exists and is already COMPLETED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;


        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still COMPLETED after a COMPLETED request is APPROVED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Notarize Attribute validation request - Request exists and is already COMPLETED', function (done) {

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
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still COMPLETED after a COMPLETED request is NOTARIZED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Reject Attribute validation request - Request exists and is already COMPLETED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still COMPLETED after a COMPLETED request is REJECTED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Cancel Attribute validation request - Request exists and is already COMPLETED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = IDENTITY_CARD;
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postCancelValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still COMPLETED after a COMPLETED request is CANCELLED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    // Actions on a REJECTED validation request

    it('Reject Attribute validation request - Request exists and is already REJECTED', function (done) {

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
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still REJECTED after a REJECTED request is REJECTED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Approve Attribute validation request - Request exists and is already REJECTED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still REJECTED after a REJECTED request is APPROVED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Notarize Attribute validation request - Request exists and is already REJECTED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still REJECTED after a REJECTED request is NOTARIZED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Cancel Attribute validation request - Request exists and is already REJECTED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'phone_number';
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postCancelValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still REJECTED after a REJECTED request is CANCELLED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('timestamp').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    // Actions on a CANCELLED validation request

    it('Approve Attribute validation request - Request exists and is already CANCELLED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still CANCELLED after a CANCELLED request is APPROVED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Decline Attribute validation request - Request exists and is already CANCELLED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;
        params.reason = REASON_FOR_DECLINE_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postDeclineValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still CANCELLED after a CANCELLED request is DECLINED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Notarize Attribute validation request - Request exists and is already CANCELLED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still CANCELLED after a CANCELLED request is NOTARIZED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Reject Attribute validation request - Request exists and is already CANCELLED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = REASON_FOR_REJECT_1024_GOOD;

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still CANCELLED after a CANCELLED request is REJECTED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

    it('Cancel Attribute validation request - Request exists and is already CANCELLED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = SECRET;
        params.publicKey = PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postCancelValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            done();
        });
    });

    it('Get Attribute validation request - verify the status is still CANCELLED after a CANCELLED request is CANCELLED', function (done) {

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
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('last_update_timestamp').to.be.at.least(1);
                done();
            });
        });
    });

});

describe('GET Attribute validation score', function () {

    it('Get Attribute validation score - no validations', function (done) {

        let param = {};
        param.type = "address";
        param.owner = OWNER;

        getAttributeValidationScore(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validations').to.be.eq(0);
            done();
        });
    });

    it('Get Attribute validation score - with validations', function (done) {

        let param = {};
        param.type = IDENTITY_CARD;
        param.owner = OWNER;

        getAttributeValidationScore(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validations').to.be.eq(2);
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


