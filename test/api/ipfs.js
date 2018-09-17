'use strict';
/*jslint mocha:true, expr:true */

let node = require('./../node.js');
let sleep = require('sleep');

const MOCK_CONTENT = 'Some random content';
const MOCK_PATH = 'Some random path';
const IPFS_HASH = 'QmWGUMu49SATrkw91squUT9XAwNsTHCkfE4qkTFGQn4Nu6';

describe('POST incorrect request', function () {
    it('Incorrect req', function (done) {
        let data = {
            files: {},
        };

        addToIpfs(data, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);

            node.expect(res.body).to.have.property('error').to.be.a('string');
            done();
        });
    });
});

describe('POST /api/ipfs', function () {

    it('using valid data should be ok', function (done) {
        let data = {
          files: {
              path: MOCK_PATH,
              content: MOCK_CONTENT,
          },
        };

        addToIpfs(data, function (err, res) {
            node.expect(res).to.have.property('body').to.be.a('object');
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('hash').to.be.a('string');
            node.expect(res.body).to.have.property('hash').to.eq(IPFS_HASH);

            done();
        });
    });
});

describe('GET /api/ipfs/fileByHash', function () {

    it('Should return file from IPFS', function (done) {
        getFileByHash(IPFS_HASH, function (err, res) {
            node.expect(res).to.have.property('body').to.be.a('object');
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('fileData').to.be.a('string');
            node.expect(res.body.fileData === MOCK_CONTENT);

            done();
        });
    });
});




function addToIpfs (data, done) {
    node.post('/api/ipfs', data, done);
}

function getFileByHash (hash, done) {
    node.get(`/api/ipfs/fileByHash?hash=${hash}`, done);
}
