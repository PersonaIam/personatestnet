'use strict';
/*jslint mocha:true, expr:true */

let node = require('./../node.js');

function postAttributeType(params, done) {
    node.post('/api/attributes/types', params, done);
}

function getAttributeTypeByName(name, done) {
    node.get('/api/attributes/types?name=' + name, done);
}

function postAttribute(params, done) {
    getAttributeTypeByName(params.name, function (err, res) {
        params.type = res.body.attribute_type.name;
        node.post('/api/attributes', params, done);
    });
}

function putAttribute(params, done) {
    getAttributeTypeByName(params.name, function (err, res) {
        params.type = res.body.attribute_type.name;
        node.put('/api/attributes', params, done);
    });
}

function getAttribute(owner, typeName, done) {
    getAttributeTypeByName(typeName, function (err, res) {
        let type;
        if (res.body.attribute_type) {
            type = '' + res.body.attribute_type.name;
        }
        let url = '/api/attributes?owner=' + owner;
        if (type) {
            url+= '&type=' + '' + type;
        }
        node.get(url, done);
    });

}

describe('POST Create new Attribute Type', function () {

    it('create attribute type', function (done) {
        postAttributeType({'name': 'name', 'data_type': 'string', 'validation' : 'length > 2', 'options' : 'firstname surname'}, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_type');
            node.expect(res.body.attribute_type).to.have.property('id').to.be.at.least(1);
            done();
        });
    });
});

describe('POST Create new Attribute Type - Missing name', function () {

    it('create attribute type - missing name', function (done) {
        postAttributeType({'data_type': 'string'}, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Missing required property: name');
            done();
        });
    });
});

describe('POST Create new Attribute Type - Missing data type', function () {

    it('create attribute type - missing data type', function (done) {
        postAttributeType({'name': 'name'}, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Missing required property: data_type');
            done();
        });
    });
});

describe('POST Create existing Attribute Type', function () {

    it('create attribute type', function (done) {
        postAttributeType({'name': 'name', 'data_type': 'string'}, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            done();
        });
    });
});

describe('POST Create other Attribute Type', function () {

    it('create attribute type', function (done) {
        postAttributeType({'name': 'address', 'data_type': 'string'}, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            done();
        });
    });
});


describe('GET attribute type', function () {

    it('GET attribute type', function (done) {
        getAttributeTypeByName('name', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attribute_type).to.have.property('id');
            node.expect(res.body.attribute_type).to.have.property('name').to.be.eq('name');
            done();
        });
    });
});

describe('GET non existing attribute type', function () {

    it('GET attribute type', function (done) {
        getAttributeTypeByName('weight', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Failed to get attribute type : Attribute type does not exist');
            done();
        });
    });
});

describe('POST Create new attribute ( name )', function () {

    it('create attribute', function (done) {

        postAttribute({
            'owner': 'TwU3KrjnaT1mNNaHAzY97VRwHxYVYq1b8N',
            'value': 'JOE',
            'name': 'name',
            'timestamp': 1,
            'secret':'place arrange potato piano mixture reflect mixture alpha identify unfair rural artwork'
        }, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            done();
        });
    });
});


describe('GET existing attribute (name)', function () {

    it('using known attribute should be ok', function (done) {
        getAttribute(node.gAccount.address, 'name', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('JOE');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('name');
            done();
        });
    });
});


describe('GET non existing attribute (address)', function () {

    it('using known attribute should be ok', function (done) {
        getAttribute(node.gAccount.address, 'address', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.eq('No attributes were found');
            done();
        });
    });
});


describe('GET all existing attributes for owner', function () {

    it('using known attribute should be ok', function (done) {
        getAttribute(node.gAccount.address, null, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes).to.have.length(1);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('JOE');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('name');
            done();
        });
    });
});

describe('PUT Update attribute ( name )', function () {

    it('create attribute', function (done) {

        putAttribute({
            'owner': 'TwU3KrjnaT1mNNaHAzY97VRwHxYVYq1b8N',
            'value': 'JOEY',
            'name': 'name',
            'timestamp': 2,
            'secret':'place arrange potato piano mixture reflect mixture alpha identify unfair rural artwork'
        }, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute');
            node.expect(res.body.attribute).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute).to.have.property('type').to.be.eq('name');
            node.expect(res.body.attribute).to.have.property('value').to.be.eq('JOEY');
            done();
        });
    });
});

describe('GET existing attribute after update (name)', function () {

    it('using known attribute should be ok', function (done) {
        getAttribute(node.gAccount.address, 'name', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('JOEY');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('name');
            done();
        });
    });
});


describe('POST Create different attribute ( address )', function () {

    it('create attribute', function (done) {

        postAttribute({
            'owner': 'TwU3KrjnaT1mNNaHAzY97VRwHxYVYq1b8N',
            'value': 'Chicago',
            'name': 'address',
            'timestamp': 2,
            'secret':'place arrange potato piano mixture reflect mixture alpha identify unfair rural artwork'
        }, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute').to.be.a('object');
            node.expect(res.body.attribute).to.have.property('id').to.be.at.least(1);
            done();
        });
    });
});

describe('GET existing attribute (address)', function () {

    it('using known attribute should be ok', function (done) {
        getAttribute(node.gAccount.address, 'address', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('Chicago');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('address');

            done();
        });
    });
});


describe('GET all existing attributes for owner', function () {

    it('using known attribute should be ok', function (done) {
        getAttribute(node.gAccount.address, null, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes).to.have.length(2);

            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('JOEY');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('name');

            node.expect(res.body.attributes[1]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[1]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[1]).to.have.property('value').to.eq('Chicago');
            node.expect(res.body.attributes[1]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[1]).to.have.property('type').to.eq('address');
            done();
        });
    });
});

describe('POST Create existing attribute ( address )', function () {

    it('create attribute', function (done) {

        postAttribute({
            'owner': 'TwU3KrjnaT1mNNaHAzY97VRwHxYVYq1b8N',
            'value': 'Detroit',
            'name': 'address',
            'timestamp': 3,
            'secret':'place arrange potato piano mixture reflect mixture alpha identify unfair rural artwork'
        }, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('attribute already exists');
            done();
        });
    });
});

describe('GET list of attributes', function () {

    function getAttributes (done) {
        node.get('/api/attributes/list', done);
    }

    it('get all attributes', function (done) {
        getAttributes(function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('count').to.be.eq(2);
            done();
        });
    });
});

