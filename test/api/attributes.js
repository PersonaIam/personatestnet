'use strict';
/*jslint mocha:TRUE, expr:TRUE */

let node = require('./../node.js');
let sleep = require('sleep');
let messages = require('../../helpers/messages.js');
let constants = require('../../helpers/constants.js');
let slots = require('../../helpers/slots.js');
let moment = require('moment');
let xlsx = require('xlsx');

// TEST DATA

const APPLICANT = 'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';
const APPLICANT_2 = 'LgMN2A1vB1qSQeacnFZavtakCRtBFydzfe';

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

const VALIDATOR_SECRET = "mechanic excuse globe emerge hedgehog food knee shy burden digital copy online";
const VALIDATOR_PUBLIC_KEY = '022a09511647055f00f46d1546595fa5950349ffd8ac477d5684294ea107f4f84c';
const VALIDATOR = 'LNJJKBGmC1GZ89XbQ4nfRRwVCZiNig2H9M';

const ADDRESS_VALUE = 'Denver';
const NAME_VALUE = "JOE";
const SECOND_NAME_VALUE = "QUEEN";
const THIRD_ID_VALUE = "QUEENS";
const EMAIL = 'yeezy@gmail.com';
const FIRST_NAME = 'first_name';
const PHONE_NUMBER = 'phone_number';
const PHONE_NUMBER_VALUE = '345654321';
const BIRTH_PLACE = 'Calgary';
const NEW_ADDRESS = 'Edmonton';
const NEW_ADDRESS2 = 'Toronto';
const INCORRECT_ADDRESS = 'ABC';

const FACE_TO_FACE = 'FACE_TO_FACE';

// TEST UTILS

const SLEEP_TIME = 10001; // in milliseconds
const SUCCESS = 'success';
const ERROR = 'error';
const TRUE = true;
const FALSE = false;

let transactionList = [];
let ipfsTransaction = {};

let time = 0;

let reportData = [];

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
            node.expect(res.body).to.have.property('count').to.be.at.least(1);
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
        getAttribute(OWNER, 'address', function (err, res) {
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

    it('Create Attribute - Expirable type, expire timestamp is in the past', function (done) {

        let params = {};
        params.type = 'identity_card';
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
        getAttribute(OWNER, 'identity_card', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('QmNh1KGj4vndExrkT5AKV965zVJBbWBXbzVzmzpYXrsEoF');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('identity_card');
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
            node.expect(res.body).to.have.property('count').to.be.eq(0);
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
            node.expect(res.body).to.have.property('count').to.be.eq(1);
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
            param.type = 'identity_card';
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

    it('Get Attribute - ADDRESS', function (done) {
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

    it('Get Attributes - Multiple Results', function (done) {
        getAttributesForOwner(OWNER, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('count').to.be.eq(4);
            node.expect(res.body.attributes).to.have.length(4);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NAME_VALUE);        // first_name
            node.expect(res.body.attributes[3]).to.have.property('value').to.eq(ADDRESS_VALUE);     // address
            done();
        });
    });
});

describe('Update Attribute', function () {

    it('Update Attribute - Value stored in IPFS ( IDENTITY_CARD )', function (done) {

        getAttribute(OWNER, 'identity_card', function (err, res) {

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
            params.type = 'identity_card';
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
        getAttribute(OWNER, 'identity_card', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('QmWC2ELAX6vzYUaCpdSLmsGHAYjXC4EufortQ2dPBmMzsD');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('identity_card');
            node.expect(res.body.attributes[0]).to.have.property('timestamp').to.be.at.least(time);
            node.expect(res.body.attributes[0]).to.have.property('active').to.eq(false);
            done();
        });
    });

    it('Update Attribute - ( ADDRESS )', function (done) {

        getAttribute(OWNER, 'address', function (err, res) {

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

        getAttribute(OWNER, 'address', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_ADDRESS);
            node.expect(res.body.attributes[0]).to.have.property('expire_timestamp').to.eq(time + 200000);
            node.expect(res.body.attributes[0]).to.have.property('timestamp').to.be.at.least(time);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('address');
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

        getAttribute(OWNER, 'address', function (err, res) {

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

        getAttribute(OWNER, 'address', function (err, res) {

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

        getAttribute(OWNER, 'address', function (err, res) {
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

        getAttribute(OWNER, 'address', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq(NEW_ADDRESS2);
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('address');
            done();
        });
    });

    it('Create Attribute Share Request - Immediately after update ( attribute is inactive )', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
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

    it('Create Attribute Share Approval - Immediately after update ( attribute is inactive )', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.value = 'KLMN';
        param.type = 'address';
        param.applicant = APPLICANT;

        let request = createAttributeShareApproval(param);
        postApproveShareAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INACTIVE_ATTRIBUTE);
            done();
        });
    });

    it('Consume Attribute - Immediately after update ( attribute is inactive )', function (done) {

        let params = {};
        params.owner = OWNER;
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
})

describe('Update Attribute Associations', function () {

    it('Update Associations - Document to Attribute association ( IDENTITY_CARD -> FIRST_NAME )', function (done) {

        getAttribute(OWNER, 'identity_card', function (err, identityCardData) {

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

        getAttribute(OWNER, 'identity_card', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('associations');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('identity_card');
            done();
        });
    });

    it('Get Attribute - After association was made, check Attribute is still not documented, and is associated( IDENTITY_CARD is not active yet, but the association exists )', function (done) {
        getAttribute(OWNER, 'first_name', function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('count').to.be.eq(1);
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
    //     getAttribute(OWNER, 'identity_card', function (err, identityCardData) {
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
    //     getAttribute(OWNER, 'identity_card', function (err, identityCardData) {
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

        getAttribute(OWNER, 'address', function (err, addressAttribute) {
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

        getAttribute(OWNER, 'address', function (err, addressAttribute) {
            let addressAttributeId = addressAttribute.body.attributes[0].id;

            getAttribute(OWNER, 'identity_card', function (err, identityCardData) {
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

    it('Consume Attribute - expired attribute', function (done) {

        let param = {};
        param.owner = OWNER;
        param.secret = SECRET;
        param.publicKey = PUBLIC_KEY;
        param.type = 'email';
        param.amount = 1;

        let request = createAttributeConsume(param);
        postConsumeAttribute(request, function (err, res) {
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

describe('Use Attribute with no validations', function () {

    it('Consume Attribute - no validations', function (done) {

        let params = {};
        params.owner = OWNER;
        params.type = FIRST_NAME;
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
        param.type = 'identity_card';

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
        param.type = 'identity_card';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.VALIDATOR_ALREADY_HAS_UNAPPROVED_VALIDATION_REQUEST_FOR_ATTRIBUTE);
            done();
        });
    });

    it('Create Attribute validation request - non existing attribute', function (done) {

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

    it('Create Attribute validation request - owner is validator', function (done) {

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

    it('Get Attribute validation request - 1 result, using all parameters', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
                done();
            });
        });
    });

    it('Get Attribute validation request - verify the status is PENDING_APPROVAL for newly created validation request', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.PENDING_APPROVAL);
                done();
            });
        });
    });

    it('Create Attribute validation request - attribute with no associations and which requires an associated document (ADDRESS)', function (done) {

        let param = {};
        param.owner = OWNER;
        param.validator = VALIDATOR;
        param.type = 'address';

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
            node.expect(res.body).to.have.property('count');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
            done();
        });
    });

    it('Get Attribute validation requests - with results, using attributeId', function (done) {

        let param = {};
        param.owner = OWNER;
        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;
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
    });

    it('Get Attribute validation requests - no results, using validator', function (done) {

        let param = {};
        param.validator = VALIDATOR_2;

        getAttributeValidationRequest(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
            done();
        });
    });

    it('Get Attribute validation requests - no results, using attributeId', function (done) {

        let param = {};
        param.owner = OWNER;

        getAttribute(OWNER, 'address', function (err, res) {
            param.attributeId = res.body.attributes[0].id;
            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
                node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
                done();
            });
        });

        it('Get Attribute validation requests - incorrect parameters, using only owner', function (done) {

            let param = {};
            param.owner = OWNER;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
                node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.INCORRECT_VALIDATION_PARAMETERS);
                done();
            });
        });

        it('Get Attribute validation requests - 2 incomplete requests, using validator', function (done) {

            let param = {};
            param.validator = VALIDATOR;

            getAttributeValidationRequests(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(2);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.eq(0);
                node.expect(res.body.attribute_validation_requests[1]).to.have.property('status').to.eq(0);
                done();
            });
        });

        it('Get Incomplete Attribute validation requests - 1 incomplete request, using attributeId', function (done) {

            let param = {};
            getAttribute(OWNER, 'identity_card', function (err, res) {
                param.attributeId = res.body.attributes[0].id;
                getAttributeValidationRequests(param, function (err, res) {
                    console.log(res.body);
                    node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                    node.expect(res.body).to.have.property('attribute_validation_requests');
                    node.expect(res.body).to.have.property('count').to.be.eq(1);
                    node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
                    node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.eq(0);
                    done();
                });
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

    // Notarize/Reject when PENDING_APPROVAL

    it('Notarize Attribute Validation Request - Request is still PENDING_APPROVAL', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            addToReportData(
                {   testName:"Notarize Attribute Validation Request - Request is still PENDING_APPROVAL",
                    expected: "ERROR",
                    errorMessage: messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS,
                }, function (err, res) {
                    done();
                });
        });
    });

    it('Get Attribute validation request - verify the status is still PENDING_APPROVAL after a PENDING_APPROVAL request is NOTARIZED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.PENDING_APPROVAL);
                done();
            });
        });
    });

    it('Reject Attribute Validation Request - Request is still PENDING_APPROVAL', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postRejectValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
            addToReportData(
                {   testName:"Reject Attribute Validation Request - Request is still PENDING_APPROVAL",
                    expected: "ERROR",
                    errorMessage: messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS,
                }, function (err, res) {
                    done();
                });
        });
    });

    it('Get Attribute validation request - verify the status is still PENDING_APPROVAL after a PENDING_APPROVAL request is REJECTED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.PENDING_APPROVAL);
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
        params.type = 'identity_card';
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

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.IN_PROGRESS);
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.IN_PROGRESS);
                done();
            });
        });
    });

    // Approve/Decline when IN_PROGRESS

    it('Approve Attribute Validation Request - Request exists and is already IN_PROGRESS', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postApproveValidationAttributeRequest(request, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
            node.expect(res.body).to.have.property(ERROR).to.be.eq(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
            addToReportData(
                {   testName:"Approve Attribute Validation Request - Request exists and is already in IN_PROGRESS",
                    expected: "ERROR",
                    errorMessage: messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL,
                }, function (err, res) {
                    done();
                });
        });
    });

    it('Get Attribute validation request - verify the status is still IN_PROGRESS after a IN_PROGRESS request is APPROVED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.IN_PROGRESS);
                done();
            });
        });
    });

    it('Decline Attribute validation request - Request exists and is already IN_PROGRESS', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;
        params.secret = VALIDATOR_SECRET;

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

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.IN_PROGRESS);
                done();
            });
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.DECLINED);
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.DECLINED);
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.DECLINED);
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.DECLINED);
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.DECLINED);
                done();
            });
        });
    });

    // Successful Notarization

    it('Notarize Attribute validation request - Request exists and is in IN_PROGRESS', function (done) {

        let unconfirmedBalance = 0;
        let balance = 0;
        getBalance(OWNER, function (err, res) {
            unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
            balance = parseInt(res.body.balance);
        });

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

        let request = createAnswerAttributeValidationRequest(params);
        postNotarizeValidationAttributeRequest(request, function (err, res) {
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

    it('Get Attribute validation request - verify the status is COMPLETED after a IN_PROGRESS request is NOTARIZED', function (done) {

        let param = {};
        param.validator = VALIDATOR;

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.COMPLETED);
                done();
            });
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.REJECTED);
                done();
            });
        });
    });

    // Actions on a COMPLETED validation request

    it('Decline Attribute validation request - Request exists and is already COMPLETED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;

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

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.COMPLETED);
                done();
            });
        });
    });

    it('Approve Attribute validation request - Request exists and is already COMPLETED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
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

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.COMPLETED);
                done();
            });
        });
    });

    it('Notarize Attribute validation request - Request exists and is already COMPLETED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;


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

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.COMPLETED);
                done();
            });
        });
    });

    it('Reject Attribute validation request - Request exists and is already COMPLETED', function (done) {

        let params = {};
        params.validator = VALIDATOR;
        params.owner = OWNER;
        params.type = 'identity_card';
        params.secret = VALIDATOR_SECRET;
        params.publicKey = VALIDATOR_PUBLIC_KEY;


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

        getAttribute(OWNER, 'identity_card', function (err, res) {
            param.attributeId = res.body.attributes[0].id;

            getAttributeValidationRequest(param, function (err, res) {
                console.log(res.body);
                node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
                node.expect(res.body).to.have.property('attribute_validation_requests');
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.COMPLETED);
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.REJECTED);
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.REJECTED);
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
                node.expect(res.body).to.have.property('count').to.be.eq(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
                node.expect(res.body.attribute_validation_requests[0]).to.have.property('status').to.be.eq(constants.validationRequestStatus.REJECTED);
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
        param.type = 'identity_card';
        param.owner = OWNER;

        getAttributeValidationScore(param, function (err, res) {
            console.log(res.body);
            node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
            node.expect(res.body).to.have.property('attribute_validations').to.be.eq(1);
            done();
        });
    });
});

describe('Generate Report', function () {

    it('Generate Report', function (done) {
        createReport('Report.xlsx', function (err, res) {
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

// it('Get completed attribute validation requests using validator', function (done) {
//
//     let param = {};
//     param.validator = VALIDATOR;
//
//     getAttributeValidationRequests(param, function (err, res) {
//         console.log(res.body);
//         node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//         node.expect(res.body).to.have.property('attribute_validation_requests');
//         node.expect(res.body).to.have.property('count');
//         node.expect(res.body.attribute_validation_requests[0]).to.have.property('chunk').to.eq(8);
//         done();
//     });
// });

// it('Get completed attribute validation requests using attribute', function (done) {
//
//     let param = {};
//     param.owner = OWNER;
//     param.type = FIRST_NAME;
//
//     getAttributeValidationRequests(param, function (err, res) {
//         console.log(res.body);
//         node.expect(res.body).to.have.property(SUCCESS).to.be.eq(TRUE);
//         node.expect(res.body).to.have.property('attribute_validation_requests');
//         node.expect(res.body).to.have.property('count');
//         node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator').to.eq(VALIDATOR);
//         done();
//     });
// });
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
//             node.expect(res.body).to.have.property('count');
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
//             node.expect(res.body).to.have.property('count');
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
//             node.expect(res.body).to.have.property('count');
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
//             node.expect(res.body).to.have.property('count');
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
//             node.expect(res.body).to.have.property('count');
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
//             node.expect(res.body).to.have.property('count');
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
//             node.expect(res.body).to.have.property('count').to.be.eq(1);
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
//             node.expect(res.body).to.have.property('count').to.be.eq(2);
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


function postAttributeShareRequest(params, done) {
    node.post('/api/attribute-shares/sharerequest', params, done);
}

function postApproveShareAttributeRequest(params, done) {
    node.post('/api/attribute-shares/approvesharerequest', params, done);
}

function postShareAttribute(params, done) {
    node.post('/api/attribute-shares/share', params, done);
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
    let url = '/api/attribute-validations/validationrequest';
    if (params.validator || params.attributeId) {
        url += '?';
    }
    if (params.validator) {
        url += '&validator=' + '' + params.validator;
    }
    if (params.attributeId) {
        url += '&attributeId=' + '' + params.attributeId;
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

// describe('Insufficient funds', function () {
//
//     it('Send an amount that cannot be used to create the attribute', function (done) {
//         let amountToSend = 1;
//         let expectedFee = node.expectedFee(amountToSend);
//
//         putTransaction({
//             senderPublicKey: PUBLIC_KEY,
//             secret: SECRET,
//             amount: amountToSend,
//             recipientId: OTHER_OWNER
//         }, function (err, res) {
//             transactionList.push({
//                 'sender': OWNER,
//                 'recipient': OTHER_OWNER,
//                 'grossSent': (amountToSend + expectedFee) / node.normalizer,
//                 'fee': expectedFee / node.normalizer,
//                 'netSent': amountToSend / node.normalizer,
//                 'txId': res.body.transactionId,
//                 'type': node.txTypes.SEND
//             });
//             done();
//         });
//     });
//
//     it('Create Attribute - The owner account has insufficient funds', function (done) {
//
//         let unconfirmedBalance = 0;
//         let balance = 0;
//         getBalance(OTHER_OWNER, function (err, res) {
//             unconfirmedBalance = parseInt(res.body.unconfirmedBalance);
//             balance = parseInt(res.body.balance);
//         });
//         console.log(balance);
//         console.log(unconfirmedBalance);
//         let param = {};
//         param.owner = OTHER_OWNER;
//         param.secret = OTHER_SECRET;
//         param.publicKey = OTHER_PUBLIC_KEY;
//         param.value = ADDRESS_VALUE;
//         param.type = 'address';
//
//         let request = createAttributeRequest(param);
//         postAttribute(request, function (err, res) {
//             console.log(res.body);
//             node.expect(res.body).to.have.property(SUCCESS).to.be.eq(FALSE);
//             node.expect(res.body).to.have.property(ERROR).to.contain('Account does not have enough PRSN: ' + OTHER_OWNER);
//             getBalance(OTHER_OWNER, function (err, res) {
//                 let unconfirmedBalanceAfter = parseInt(res.body.unconfirmedBalance);
//                 let balanceAfter = parseInt(res.body.balance);
//                 node.expect(balanceAfter === 1);
//                 node.expect(unconfirmedBalanceAfter === 1);
//             });
//             done();
//         });
//     });
// });
