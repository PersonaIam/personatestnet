'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('../../node.js');
let sleep = require('sleep');
let messages = require('../../../helpers/messages.js');
let constants = require('../../../helpers/constants.js');
let slots = require('../../../helpers/slots.js');

// TEST DATA

const OWNER_FAUCET = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
const SECRET_FAUCET = "blade early broken display angry wine diary alley panda left spy woman";
const PUBLIC_KEY_FAUCET = '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6';

const OWNER = 'LMsaiMA7vf31LUoXMWcGvsMYQarphwN3Dg';
const SECRET = "deny produce panic uniform parade already strike rocket eye stove jump brand";
const PUBLIC_KEY = '035cd0cde241b253dcb38599bc9f670e13b7d07a286e6b91f4bedf3026a2c703ec';

const VALIDATOR = 'Le4rHsvdhEBYwPnLvkFfJs8p8uHHbZhEDo';
const VALIDATOR_SECRET = "music spirit double manual pool protect cheap peasant polar diesel left elevator";
const VALIDATOR_PUBLIC_KEY = '036385e52d625357e9a2d1430130d9109ab4ce3ef64e656480e1f41b5f93191e8d';

const VALIDATOR_2 = 'LQpEtWok1ceczUNRYUofJ3ho2AwsC98gPG';
const VALIDATOR_SECRET_2 = "uncle match engine innocent romance corn candy oblige kitchen planet another fatigue";
const VALIDATOR_PUBLIC_KEY_2 = '03d48a86be31c12780a3dea34642705ba90d60e3347b93dd3379e8de6d1e76e688';

const VALIDATOR_3 = 'LfUczrVGW9GKJs1T7CmHDPjGo2NKebrTcA';
const VALIDATOR_SECRET_3 = "wide journey leader very situate bar repair letter gold armor blush busy";
const VALIDATOR_PUBLIC_KEY_3 = '02501441eacbea23240895f833f4876409669c138590a303be563ac7608addf529';

const VALIDATOR_4 = 'LRshUEroH2bzKuKuTTNqrQDX8ceVXSQ7bz';
const VALIDATOR_SECRET_4 = "expect spawn grace scale comfort agent supreme artwork wheel table frequent front";
const VALIDATOR_PUBLIC_KEY_4 = '0395184dde3fbd18c20f2f878959194ef231dd02f8a07831eb2409c6b8564c1f67';

const VALIDATOR_5 = 'LdWqv58YhNYwn429k8mPChwW9z3jKgtowu';
const VALIDATOR_SECRET_5 = "clog case smile hair squeeze nominee valid cost tortoise unusual foil sail";
const VALIDATOR_PUBLIC_KEY_5 = '028affc0e41d164f998bc6c1f88d23069dd0c97a2170082281776c8f06dcac5d4e';

const VALIDATOR_6 = 'LQ8uNeoNXkqgD5NhpZWFe8tDAkf7EWay2k';
const VALIDATOR_SECRET_6 = "toss prison useful poverty cute blanket action neck foot tired portion dress";
const VALIDATOR_PUBLIC_KEY_6 = '03b343e5d5a9a5d859cd133492d2d4c595a860dbfe7ccb1ce20de46b5f74ad99ef';

const VALIDATOR_7 = 'LWGcebTpRFQi4GtcfMTM5YnHgW8d3fVu3P';
const VALIDATOR_SECRET_7 = "hand hurry venture door bridge edit silent cloth coral bird print kitchen";
const VALIDATOR_PUBLIC_KEY_7 = '0351b5d4c8248f945ab62029ba879e905c60711df80cf517dce21f5fb1b6e02ceb';

const VALIDATOR_8 = 'LXg5EpSY53chrT5PwkguVgQvcT252mNkog';
const VALIDATOR_SECRET_8 = "second level unit check reward build obey remind quarter shop salute topic";
const VALIDATOR_PUBLIC_KEY_8 = '029f5c1d73571903e972e08f2489deb08d1827c1f3a82477436f378fa3bbd09d1e';

const LAST_NAME = 'last_name';
const PHONE_NUMBER = 'phone_number';
const BIRTHPLACE = 'birthplace';
const ALIAS = 'alias';

const LAST_NAME_VALUE = 'Fowler';
const PHONE_NUMBER_VALUE = '0746666666';
const BIRTHPLACE_VALUE = 'London';
const NEW_BIRTHPLACE_VALUE = 'Birmingham';
const ALIAS_VALUE = 'Styx';
const NEW_ALIAS_VALUE = 'Spoons';

// RESULTS

const TRANSACTION_ID = 'transactionId';
const SUCCESS = 'success';
const ERROR = 'error';
const TRUE = true;
const FALSE = false;

// TEST UTILS

const SLEEP_TIME = 10001; // in milliseconds
let transactionList = [];

// TESTS

describe('SEND FUNDS', function () {

    // this test is only used to generate the public key for the owner account, it is not supposed to actually send the amount
    it('Send funds - placeholder to generate public key. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 10000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: OWNER
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
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

    it('Send funds - to the validator. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: VALIDATOR
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
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

    it('Send funds - to the second validator. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: VALIDATOR_2
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
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

    it('Send funds - to the third validator. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: VALIDATOR_3
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
                'recipient': VALIDATOR_3,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            done();
        });
    });

    it('Send funds - to the fourth validator. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: VALIDATOR_4
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
                'recipient': VALIDATOR_4,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            done();
        });
    });

    it('Send funds - to the fifth validator. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: VALIDATOR_5
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
                'recipient': VALIDATOR_5,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            done();
        });
    });

    it('Send funds - to the sixth validator. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: VALIDATOR_6
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
                'recipient': VALIDATOR_6,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            done();
        });
    });

    it('Send funds - to the seventh validator. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: VALIDATOR_7
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
                'recipient': VALIDATOR_7,
                'grossSent': (amountToSend + expectedFee) / node.normalizer,
                'fee': expectedFee / node.normalizer,
                'netSent': amountToSend / node.normalizer,
                'txId': res.body.transactionId,
                'type': node.txTypes.SEND
            });
            done();
        });
    });

    it('Send funds - to the eighth validator. ' +
        'EXPECTED : SUCCESS. RESULT : Funds are sent', function (done) {
        let amountToSend = 100000;
        let expectedFee = node.expectedFee(amountToSend);

        putTransaction({
            senderPublicKey: PUBLIC_KEY_FAUCET,
            secret: SECRET_FAUCET,
            amount: amountToSend,
            recipientId: VALIDATOR_8
        }, function (err, res) {
            transactionList.push({
                'sender': OWNER_FAUCET,
                'recipient': VALIDATOR_8,
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

describe('CREATE ATTRIBUTES', function () {

    it('Create an attribute (BIRTHPLACE). ' +
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

    it('Create an attribute (ALIAS). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.value = ALIAS_VALUE;
        param.type = ALIAS;

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

    it('Create an attribute (LAST_NAME). ' +
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

    it('Create an attribute (PHONE_NUMBER). ' +
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

});

describe('Use Case #1 : NNRRR - 2 Notarizations followed by 3 Rejections', function () {

    it('Create a validation request (BIRTHPLACE, VALIDATOR). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

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
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (BIRTHPLACE, VALIDATOR) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Create a validation request (BIRTHPLACE, VALIDATOR_2). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_2;
        param.type = BIRTHPLACE;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (BIRTHPLACE, VALIDATOR_2) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Create a validation request (BIRTHPLACE, VALIDATOR_3). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_3;
        param.type = BIRTHPLACE;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (BIRTHPLACE, VALIDATOR_3) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_3, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_3, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (BIRTHPLACE, VALIDATOR_4). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_4;
        param.type = BIRTHPLACE;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (BIRTHPLACE, VALIDATOR_4) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_4, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_4;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_4;
        params.publicKey = VALIDATOR_PUBLIC_KEY_4;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_4, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (BIRTHPLACE, VALIDATOR_5). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_5;
        param.type = BIRTHPLACE;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (BIRTHPLACE, VALIDATOR_5) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_5, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_5;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_5;
        params.publicKey = VALIDATOR_PUBLIC_KEY_5;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_5, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (BIRTHPLACE, VALIDATOR_6). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_6;
        param.type = BIRTHPLACE;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (BIRTHPLACE, VALIDATOR_6) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_6, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_6;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_6;
        params.publicKey = VALIDATOR_PUBLIC_KEY_6;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_6, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });
    });

    it('Create a validation request (BIRTHPLACE, VALIDATOR_7). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_7;
        param.type = BIRTHPLACE;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the details of an attribute (BIRTHPLACE) that has no validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 0 red flags and 0 yellow flags', function (done) {
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(BIRTHPLACE_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(0);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(0);
            done();
        });
    });

    // Notarizations (N) and Rejections (R) start here ...

    it('Notarize a validation request (BIRTHPLACE, VALIDATOR). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

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
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the details of an attribute (BIRTHPLACE) that has (N) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 0 red flags and 0 yellow flags', function (done) {
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(BIRTHPLACE_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(0);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(0);
            done();
        });
    });

    it('Notarize a validation request (BIRTHPLACE, VALIDATOR_2). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the details of an attribute (BIRTHPLACE) that has (NN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 0 red flags and 0 yellow flags', function (done) {
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(BIRTHPLACE_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(0);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(0);
            done();
        });
    });

    it('Reject a validation request (BIRTHPLACE, VALIDATOR_3). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_3, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_3, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (BIRTHPLACE) that has (NNR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 1 red flag and 1 yellow flag', function (done) {
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(BIRTHPLACE_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

    it('Reject a validation request (BIRTHPLACE, VALIDATOR_4). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_4, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_4;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_4;
        params.publicKey = VALIDATOR_PUBLIC_KEY_4;
        params.reason = 'reason';

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_4, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (BIRTHPLACE) that has (NNRR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 2 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(BIRTHPLACE_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(2);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('Reject a validation request (BIRTHPLACE, VALIDATOR_5). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_5, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_5;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_5;
        params.publicKey = VALIDATOR_PUBLIC_KEY_5;
        params.reason = 'reason';

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_5, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (BIRTHPLACE) that has (NNRRR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" true, 3 red flags and 3 yellow flags', function (done) {
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(BIRTHPLACE_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(3);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(3);
            done();
        });
    });

    // Unsuccessful actions after attribute becomes rejected

    it('As a VALIDATOR, I want to Notarize a validation request (BIRTHPLACE, VALIDATOR_6) for a rejected attribute. ' +
        'EXPECTED : FAILURE. ERROR : REJECTED_ATTRIBUTE' , function (done) {

        let params = {};
        params.validator = VALIDATOR_6;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_6;
        params.publicKey = VALIDATOR_PUBLIC_KEY_6;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REJECTED_ATTRIBUTE);
            done();
        });
    });

    it('As a VALIDATOR, I want to Reject a validation request (BIRTHPLACE, VALIDATOR_6) for a rejected attribute. ' +
        'EXPECTED : FAILURE. ERROR : REJECTED_ATTRIBUTE', function (done) {

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REJECTED_ATTRIBUTE);
            done();
        });
    });

    it('As a VALIDATOR, I want to Approve a PENDING_APPROVAL validation request (BIRTHPLACE, VALIDATOR_7) for a rejected attribute. ' +
        'EXPECTED : FAILURE. ERROR : REJECTED_ATTRIBUTE', function (done) {

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REJECTED_ATTRIBUTE);
            done();
        });
    });

    it('As a VALIDATOR, I want to Decline a PENDING_APPROVAL validation request (BIRTHPLACE, VALIDATOR_7) for a rejected attribute. ' +
        'EXPECTED : FAILURE. ERROR : REJECTED_ATTRIBUTE', function (done) {

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;
        params.reason = 'reason';

        let request = createAnswerAttributeValidationRequest(params);
        postDeclineValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REJECTED_ATTRIBUTE);
            done();
        });
    });

    it('As an OWNER, I want to Cancel a PENDING_APPROVAL validation request (BIRTHPLACE, VALIDATOR_7) for a rejected attribute. ' +
        'EXPECTED : FAILURE. ERROR : REJECTED_ATTRIBUTE', function (done) {

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;

        let request = createAnswerAttributeValidationRequest(params);
        postCancelValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REJECTED_ATTRIBUTE);
            done();
        });
    });

    it('As an OWNER, I want to Create a validation request (BIRTHPLACE, VALIDATOR_8) for a rejected attribute. ' +
        'EXPECTED : FAILURE. ERROR : REJECTED_ATTRIBUTE', function (done) {

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_8;
        param.type = BIRTHPLACE;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.REJECTED_ATTRIBUTE);
            done();
        });
    });

    // Now do an update

    it('Update an attribute (BIRTHPLACE). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        getAttribute(OWNER, BIRTHPLACE, function (err, res) {

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
            param.value = NEW_BIRTHPLACE_VALUE;
            let time = slots.getTime();
            param.expire_timestamp = time + 2000000;
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

    it('As a PUBLIC user, I want to Get the details of an attribute that was rejected with 3 red flags, then updated. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 0 red flags and 0 yellow flags', function (done) {
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_BIRTHPLACE_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(0);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(0);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get validation requests (BIRTHPLACE) for an attribute that was just updated. ' +
        'EXPECTED : SUCCESS. RESULT : 0 Results, existing validations happened before the last update', function (done) {

        let param = {};
        param.validator = VALIDATOR;
        param.owner = OWNER;
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            param.attributeId = res.body.attributes[0].id;
            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests').to.have.length(0);
                done();
            });
        });
    });

    // Now create a validation process all over again

    it('As an OWNER, I want to Create a validation request (BIRTHPLACE, VALIDATOR), for a recently updated attribute, even though a ' +
        'validation request was completed for this attribute prior to the last update. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

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
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a VALIDATOR, I want to Approve a validation request (BIRTHPLACE, VALIDATOR) that is PENDING_APPROVAL, for a recently updated attribute, ' +
        'even though a validation request was completed for this attribute prior to the last update. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a VALIDATOR, I want to Reject a validation request (BIRTHPLACE, VALIDATOR) that is IN_PROGRESS, for a recently updated attribute, ' +
        'even though a validation request was completed for this attribute prior to the last update. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = BIRTHPLACE;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute that was rejected with 3 red flags, then updated, the Rejected again. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 1 red flag and 1 yellow flag', function (done) {
        getAttribute(OWNER, BIRTHPLACE, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_BIRTHPLACE_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(BIRTHPLACE);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

});

describe('Use Case #2 : NRNRNNN - 4 Validations without a consensus followed by 3 Notarizations in a row', function () {

    it('Create a validation request (ALIAS, VALIDATOR). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (ALIAS, VALIDATOR) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Create a validation request (ALIAS, VALIDATOR_2). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_2;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (ALIAS, VALIDATOR_2) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Create a validation request (ALIAS, VALIDATOR_3). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_3;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (ALIAS, VALIDATOR_3) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_3, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_3, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (ALIAS, VALIDATOR_4). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_4;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (ALIAS, VALIDATOR_4) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_4, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_4;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_4;
        params.publicKey = VALIDATOR_PUBLIC_KEY_4;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_4, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (ALIAS, VALIDATOR_5). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_5;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (ALIAS, VALIDATOR_5) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_5, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_5;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_5;
        params.publicKey = VALIDATOR_PUBLIC_KEY_5;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_5, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (ALIAS, VALIDATOR_6). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_6;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (ALIAS, VALIDATOR_6) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_6, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_6;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_6;
        params.publicKey = VALIDATOR_PUBLIC_KEY_6;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_6, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (ALIAS, VALIDATOR_7). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_7;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (ALIAS, VALIDATOR_7) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_7, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_7, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    // Notarizations (N) and Rejections (R) start here ...

    it('Notarize a validation request (ALIAS, VALIDATOR). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Get the details of an attribute (ALIAS) that has (N) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 0 red flags and 0 yellow flags', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(0);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(0);
            done();
        });
    });

    it('Reject a validation request (ALIAS, VALIDATOR_2). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_2, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (ALIAS) that has (NR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 1 red flag and 1 yellow flag', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

    it('Notarize a validation request (ALIAS, VALIDATOR_3). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_3, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_3, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (ALIAS) that has (NRN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 1 red flag and 1 yellow flag', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

    it('Reject a validation request (ALIAS, VALIDATOR_4). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_4, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_4;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_4;
        params.publicKey = VALIDATOR_PUBLIC_KEY_4;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_4, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (ALIAS) that has (NRNR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 2 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(2);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('Notarize a validation request (ALIAS, VALIDATOR_5). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_5, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_5;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_5;
        params.publicKey = VALIDATOR_PUBLIC_KEY_5;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_5, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (ALIAS) that has (NRNRN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 2 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(2);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('Notarize a validation request (ALIAS, VALIDATOR_6). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_6, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_6;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_6;
        params.publicKey = VALIDATOR_PUBLIC_KEY_6;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_6, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (ALIAS) that has (NRNRNN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 2 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(2);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('Notarize a validation request (ALIAS, VALIDATOR_7). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_7, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_7, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (ALIAS) that has (NRNRNNN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 0 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(0);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('As an OWNER, I want to Create a validation request (ALIAS, VALIDATOR_8) for an attribute which has 3 Notarizations in a row. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_8;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a VALIDATOR, I want to Approve a validation request (ALIAS, VALIDATOR_8) for an attribute which has 3 Notarizations in a row. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_8, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_8;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET_8;
        params.publicKey = VALIDATOR_PUBLIC_KEY_8;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_8, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    // Now do an update

    it('Update an attribute (ALIAS). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        getAttribute(OWNER, ALIAS, function (err, res) {

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
            param.value = NEW_ALIAS_VALUE;
            let time = slots.getTime();
            param.expire_timestamp = time + 2000000;
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

    it('As a PUBLIC user, I want to Get the details of an attribute that was notarized 3 times in a row, then updated. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 0 red flags and 0 yellow flags', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(0);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(0);
            done();
        });
    });

    it('As a PUBLIC user, I want to Get validation requests (ALIAS, VALIDATOR) for an attribute that was just updated. ' +
        'EXPECTED : SUCCESS. RESULT : 0 Results, existing validations happened before the last update', function (done) {

        let param = {};
        param.validator = VALIDATOR;
        param.owner = OWNER;
        getAttribute(OWNER, ALIAS, function (err, res) {
            param.attributeId = res.body.attributes[0].id;
            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests').to.have.length(0);
                done();
            });
        });
    });

    // Now create a validation process all over again

    it('As an OWNER, I want to Create a validation request (ALIAS, VALIDATOR), for a recently updated attribute, even though a ' +
        'validation request was completed for this attribute prior to the last update. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = ALIAS;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a VALIDATOR, I want to Approve a validation request (ALIAS, VALIDATOR) that is PENDING_APPROVAL, for a recently updated attribute, ' +
        'even though a validation request was completed for this attribute prior to the last update. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a VALIDATOR, I want to Reject a validation request (ALIAS, VALIDATOR) that is IN_PROGRESS, for a recently updated attribute, ' +
        'even though a validation request was completed for this attribute prior to the last update. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = ALIAS;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute that was notarized 3 times in a row, then updated, the notarized again. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 0 red flags and 0 yellow flags', function (done) {
        getAttribute(OWNER, ALIAS, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_ALIAS_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(ALIAS);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

});

describe('Use Case #3 : RNNNRRR - Rejection followed by 3 Notarizations and 3 more Rejections', function () {

    it('Create a validation request (LAST_NAME, VALIDATOR). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = LAST_NAME;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (LAST_NAME, VALIDATOR) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Create a validation request (LAST_NAME, VALIDATOR_2). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_2;
        param.type = LAST_NAME;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (LAST_NAME, VALIDATOR_2) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Create a validation request (LAST_NAME, VALIDATOR_3). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_3;
        param.type = LAST_NAME;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (LAST_NAME, VALIDATOR_3) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_3, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_3, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (LAST_NAME, VALIDATOR_4). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_4;
        param.type = LAST_NAME;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (LAST_NAME, VALIDATOR_4) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_4, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_4;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_4;
        params.publicKey = VALIDATOR_PUBLIC_KEY_4;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_4, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (LAST_NAME, VALIDATOR_5). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_5;
        param.type = LAST_NAME;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (LAST_NAME, VALIDATOR_5) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_5, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_5;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_5;
        params.publicKey = VALIDATOR_PUBLIC_KEY_5;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_5, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (LAST_NAME, VALIDATOR_6). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_6;
        param.type = LAST_NAME;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (LAST_NAME, VALIDATOR_6) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_6, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_6;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_6;
        params.publicKey = VALIDATOR_PUBLIC_KEY_6;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_6, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (LAST_NAME, VALIDATOR_7). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_7;
        param.type = LAST_NAME;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (LAST_NAME, VALIDATOR_7) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_7, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_7, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    // Notarizations (N) and Rejections (R) start here ...

    it('Reject a validation request (LAST_NAME, VALIDATOR). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (LAST_NAME) that has (R) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 1 red flags and 1 yellow flags', function (done) {
        getAttribute(OWNER, LAST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(LAST_NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(LAST_NAME);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

    it('Notarize a validation request (LAST_NAME, VALIDATOR_2). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('As a PUBLIC user, I want to Get the details of an attribute (LAST_NAME) that has (RN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 1 red flag and 1 yellow flag', function (done) {
        getAttribute(OWNER, LAST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(LAST_NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(LAST_NAME);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

    it('Notarize a validation request (LAST_NAME, VALIDATOR_3). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_3, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_3, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (LAST_NAME) that has (RNN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 1 red flag and 1 yellow flag', function (done) {
        getAttribute(OWNER, LAST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(LAST_NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(LAST_NAME);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

    it('Notarize a validation request (LAST_NAME, VALIDATOR_4). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_4, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_4;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_4;
        params.publicKey = VALIDATOR_PUBLIC_KEY_4;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_4, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (LAST_NAME) that has (RNNN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 0 red flags and 1 yellow flag', function (done) {
        getAttribute(OWNER, LAST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(LAST_NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(LAST_NAME);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(0);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

    it('Reject a validation request (LAST_NAME, VALIDATOR_5). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_5, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_5;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_5;
        params.publicKey = VALIDATOR_PUBLIC_KEY_5;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_5, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (LAST_NAME) that has (RNNNR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 1 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, LAST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(LAST_NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(LAST_NAME);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('Reject a validation request (LAST_NAME, VALIDATOR_6). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_6, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_6;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_6;
        params.publicKey = VALIDATOR_PUBLIC_KEY_6;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_6, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (LAST_NAME) that has (RNNNRR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" true, "rejected" false, 2 red flags and 3 yellow flags', function (done) {
        getAttribute(OWNER, LAST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(LAST_NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(LAST_NAME);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(2);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(3);
            done();
        });
    });

    it('Reject a validation request (LAST_NAME, VALIDATOR_7). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_7, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = LAST_NAME;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_7, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (LAST_NAME) that has (RNNNRRR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" true, 3 red flags and 4 yellow flags', function (done) {
        getAttribute(OWNER, LAST_NAME, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(LAST_NAME_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(LAST_NAME);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(3);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(4);
            done();
        });
    });

});

describe('Use Case #4 : RRNNRNR - No 3 Consecutive Notarizations in the first 7 Validations', function () {

    it('Create a validation request (PHONE_NUMBER, VALIDATOR). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = PHONE_NUMBER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (PHONE_NUMBER, VALIDATOR) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Create a validation request (PHONE_NUMBER, VALIDATOR_2). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_2;
        param.type = PHONE_NUMBER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (PHONE_NUMBER, VALIDATOR_2) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Create a validation request (PHONE_NUMBER, VALIDATOR_3). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_3;
        param.type = PHONE_NUMBER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (PHONE_NUMBER, VALIDATOR_3) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_3, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_3, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (PHONE_NUMBER, VALIDATOR_4). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_4;
        param.type = PHONE_NUMBER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (PHONE_NUMBER, VALIDATOR_4) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_4, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_4;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_4;
        params.publicKey = VALIDATOR_PUBLIC_KEY_4;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_4, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (PHONE_NUMBER, VALIDATOR_5). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_5;
        param.type = PHONE_NUMBER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (PHONE_NUMBER, VALIDATOR_5) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_5, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_5;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_5;
        params.publicKey = VALIDATOR_PUBLIC_KEY_5;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_5, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (PHONE_NUMBER, VALIDATOR_6). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_6;
        param.type = PHONE_NUMBER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (PHONE_NUMBER, VALIDATOR_6) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_6, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_6;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_6;
        params.publicKey = VALIDATOR_PUBLIC_KEY_6;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_6, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    it('Create a validation request (PHONE_NUMBER, VALIDATOR_7). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR_7;
        param.type = PHONE_NUMBER;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
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

    it('Approve a validation request (PHONE_NUMBER, VALIDATOR_7) that is in PENDING_APPROVAL. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_7, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_7, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestapprove);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestapprove);
            });
            done();
        });

    });

    // Notarizations (N) and Rejections (R) start here ...

    it('Reject a validation request (LAST_NAME, VALIDATOR). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('Get the details of an attribute (PHONE_NUMBER) that has (R) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 1 red flag and 1 yellow flag', function (done) {
        getAttribute(OWNER, PHONE_NUMBER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(PHONE_NUMBER_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(PHONE_NUMBER);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(1);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(1);
            done();
        });
    });

    it('Reject a validation request (LAST_NAME, VALIDATOR_2). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_2, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_2;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_2;
        params.publicKey = VALIDATOR_PUBLIC_KEY_2;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_2, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (PHONE_NUMBER) that has (RR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 2 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, PHONE_NUMBER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(PHONE_NUMBER_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(PHONE_NUMBER);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(2);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('Notarize a validation request (PHONE_NUMBER, VALIDATOR_3). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_3, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_3;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_3;
        params.publicKey = VALIDATOR_PUBLIC_KEY_3;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_3, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (PHONE_NUMBER) that has (RRN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 2 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, PHONE_NUMBER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(PHONE_NUMBER_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(PHONE_NUMBER);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(2);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('Notarize a validation request (PHONE_NUMBER, VALIDATOR_4). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_4, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_4;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_4;
        params.publicKey = VALIDATOR_PUBLIC_KEY_4;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_4, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (PHONE_NUMBER) that has (RRNN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 2 red flags and 2 yellow flags', function (done) {
        getAttribute(OWNER, PHONE_NUMBER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(PHONE_NUMBER_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(PHONE_NUMBER);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(2);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(2);
            done();
        });
    });

    it('Reject a validation request (PHONE_NUMBER, VALIDATOR_5). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_5, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_5;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_5;
        params.publicKey = VALIDATOR_PUBLIC_KEY_5;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_5, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (PHONE_NUMBER) that has (RRNNR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 3 red flags and 3 yellow flags', function (done) {
        getAttribute(OWNER, PHONE_NUMBER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(PHONE_NUMBER_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(PHONE_NUMBER);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(3);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(3);
            done();
        });
    });

    it('Notarize a validation request (PHONE_NUMBER, VALIDATOR_6). ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID' , function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_6, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_6;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_6;
        params.publicKey = VALIDATOR_PUBLIC_KEY_6;
        params.validationType = constants.validationType.FACE_TO_FACE;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_6, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestdecline);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestdecline);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (PHONE_NUMBER) that has (RRNNRN) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" false, 3 red flags and 3 yellow flags', function (done) {
        getAttribute(OWNER, PHONE_NUMBER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(PHONE_NUMBER_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(PHONE_NUMBER);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(3);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(3);
            done();
        });
    });

    it('Reject a validation request (PHONE_NUMBER, VALIDATOR_7. ' +
        'EXPECTED : SUCCESS. RESULT : Transaction ID', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(VALIDATOR_7, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR_7;
        params.owner = OWNER;
        params.type = PHONE_NUMBER;
        params.secret = VALIDATOR_SECRET_7;
        params.publicKey = VALIDATOR_PUBLIC_KEY_7;
        params.reason = "reason";

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property(TRANSACTION_ID);
            sleep.msleep(SLEEP_TIME);
            getBalance(VALIDATOR_7, function (err, res) {
                let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
                let balanceAfter = parseInt(res.body.balance);
                node.expect(balance - balanceAfter === constants.fees.attributevalidationrequestreject);
                node.expect(unconfirmedBalance - unconfirmedBalanceAfter === constants.fees.attributevalidationrequestreject);
            });
            done();
        });
    });

    it('As a PUBLIC user, I want to Get the details of an attribute (PHONE_NUMBER) that has (RRNNRNR) validations. ' +
        'EXPECTED : SUCCESS. RESULT : 1 Result, with "active" false, "rejected" true, 4 red flags and 4 yellow flags', function (done) {
        getAttribute(OWNER, PHONE_NUMBER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(PHONE_NUMBER_VALUE);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq(PHONE_NUMBER);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(FALSE);
            node.expect(res.body.attributes[0]).to.have.property('rejected').to.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('redFlags').to.eq(4);
            node.expect(res.body.attributes[0]).to.have.property('yellowFlags').to.eq(4);
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
    request.asset.attribute[0].type = param.type ? param.type : LAST_NAME;
    request.asset.attribute[0].owner = param.owner ? param.owner : OWNER;
    request.asset.attribute[0].value = param.value ? param.value : LAST_NAME_VALUE;
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
    if (param.type) {
        request.asset.validation[0].type = param.type;
    }
    if (param.attributeId) {
        request.asset.validation[0].attributeId = param.attributeId;
    }
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
    request.asset.validation[0].owner = param.owner ? param.owner : OWNER;
    request.asset.validation[0].validator = param.validator ? param.validator : VALIDATOR;
    if (param.type) {
        request.asset.validation[0].type = param.type;
    }
    if (param.attributeId) {
        request.asset.validation[0].attributeId = param.attributeId;
    }
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

    if (params.attributeId) {
        url += '&attributeId=' + '' + params.attributeId;
    }
    node.get(url, done);

}

function getBalance(address, done) {
    node.get('/api/accounts/getBalance?address=' + address, done);
}

function putTransaction(params, done) {
    node.put('/api/transactions', params, done);
}


