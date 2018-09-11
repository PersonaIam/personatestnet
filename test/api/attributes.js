'use strict';
/*jslint mocha:true, expr:true */

let node = require('./../node.js');
let sleep = require('sleep');

const validator = 'LiVgpba3pzuyzMd47BYbXiNAoq9aXC4JRv';


describe('GET Attribute type', function () {

    it('Attribute type', function (done) {
        getAttributeTypeByName('name', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attribute_type).to.have.property('id');
            node.expect(res.body.attribute_type).to.have.property('data_type');
            node.expect(res.body.attribute_type).to.have.property('name').to.be.eq('name');
            node.expect(res.body.attribute_type.id).to.be.at.least(1);
            done();
        });
    });
});

describe('GET Non existing attribute type', function () {

    it('Non existing attribute type', function (done) {
        getAttributeTypeByName('weight', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Failed to get attribute type : Attribute type does not exist');
            done();
        });
    });
});

describe('POST Create new attribute ( name )', function () {

    it('Create new attribute ( name )', function (done) {
        let request = createAttributeRequest();

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(10000);
            done();
        });
    });
});


describe('GET Existing attribute (name)', function () {

    it('Existing attribute (name)', function (done) {
        getAttribute('LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ', 'name', function (err, res) {
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


describe('GET Non existing attribute (address)', function () {

    it('Non existing attribute (address)', function (done) {
        getAttribute('LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ', 'address', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.eq('No attributes were found');
            done();
        });
    });
});

describe('POST Create attribute (name) for different owner', function () {

    it('Create attribute (name) for different owner', function (done) {

        let param = {};
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
        param.value = 'QUEEN';

        let request = createAttributeRequest(param);

        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(10000);
            done();
        });
    });
});


describe('GET All existing attributes for owner', function () {

    it('All existing attributes for owner', function (done) {
        getAttributesForOwner('LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes).to.have.length(1);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('JOE');
            done();
        });
    });
});

describe('POST Create a different attribute ( address )', function () {

    it('Create a different attribute ( address )', function (done) {

        let param = {};
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
        param.value = 'Denver';
        param.type = 'address';

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('transactionId');
            sleep.msleep(10000);
            done();
        });
    });
});

describe('POST Create an attribute with non existing attribute type', function () {

    it('Create an attribute with non existing attribute type', function (done) {

        let param = {};
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
        param.value = 'none';
        param.type = 'no_such_attribute';

        let request = createAttributeRequest(param);
        postAttribute(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            done();
        });
    });
});

describe('GET Existing attribute (address)', function () {

    it('Existing attribute (address)', function (done) {
        getAttribute('LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w', 'address', function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('value').to.eq('Denver');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.eq('address');

            done();
        });
    });
});


describe('GET All existing attributes for owner', function () {

    it('All existing attributes for owner', function (done) {
        getAttribute('LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w', null, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body.attributes).to.have.length(2);

            node.expect(res.body.attributes[0]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('owner').to.eq('LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w');
            node.expect(res.body.attributes[0]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[0]).to.have.property('type').to.be.a('string');

            node.expect(res.body.attributes[1]).to.have.property('owner').to.be.a('string');
            node.expect(res.body.attributes[1]).to.have.property('value').to.be.a('string');
            node.expect(res.body.attributes[1]).to.have.property('type').to.be.a('string');

            let values = [];
            values[0] = res.body.attributes[0].value;
            values[1] = res.body.attributes[1].value;
            node.expect(values.indexOf('Denver') > -1);
            node.expect(values.indexOf('QUEEN') > -1);

            let types = [];
            types[0] = res.body.attributes[0].type;
            types[1] = res.body.attributes[1].type;
            node.expect(types.indexOf('address') > -1);
            node.expect(types.indexOf('name') > -1);


            done();
        });
    });
});

describe('GET List of attributes', function () {

    function getAttributes(done) {
        node.get('/api/attributes/list', done);
    }

    it('List of attributes', function (done) {
        getAttributes(function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('count').to.be.eq(3);
            done();
        });
    });
});


describe('POST Create an attribute validation request', function () {

    it('Create an attribute validation request', function (done) {

        let param = {};
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
        param.validator = validator;
        param.type = 'name';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            sleep.msleep(10000);
            done();
        });
    });
});

describe('POST Create same attribute validation request', function () {

    it('Create same attribute validation request', function (done) {

        let param = {};
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';

        param.validator = validator;
        param.type = 'name';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            done();
        });
    });
});

describe('GET Attribute validation request', function () {

    it('Attribute validation request', function (done) {

        let param = {};
        param.validator = validator;

        getAttributeValidationRequest(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validation_requests');
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('attribute_id').to.be.at.least(1);
            node.expect(res.body.attribute_validation_requests[0]).to.have.property('validator');
            // node.expect(res.body.attribute_validation_requests[0]).to.have.property('completed').to.be.eq(0);
            done();
        });
    });
});

describe('POST Create attribute validation request for non existing attribute', function () {

    it('Create attribute validation request for non existing attribute', function (done) {

        let param = {};
        param.owner = 'LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ';
        param.type = 'address';
        param.validator = validator;

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Attribute does not exist. Cannot create validation request');
            done();
        });
    });
});

describe('POST Create attribute validation request for existing attribute with owner as validator', function () {

    it('Create attribute validation request for existing attribute with owner as validator', function (done) {

        let param = {};
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
        param.type = 'address';
        param.validator = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';

        let request = createAttributeValidationRequest(param);
        postAttributeValidationRequest(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Owner cannot be the validator of his own attribute');
            done();
        });
    });
});

describe('POST Create an attribute validation', function () {

    it('Create an attribute validation ', function (done) {

        let param = {};
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
        param.type = 'name';
        param.validator = validator;

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            sleep.msleep(10000);
            done();
        });
    });
});


describe('POST Create an attribute validation for non existing attribute validation request', function () {

    it('Create an attribute validation for non existing attribute validation request ', function (done) {

        let param = {};
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';
        param.validator = validator;
        param.type = 'address';

        let request = createAttributeValidation(param);
        postAttributeValidation(request, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(false);
            node.expect(res.body).to.have.property('error').to.be.eq('Validator does not have any validation request to complete for this attribute');
            done();
        });
    });
});


describe('GET Attribute validations for validator ', function () {

    it('Attribute validation - validator', function (done) {

        let param = {};
        param.validator = validator;

        getAttributeValidation(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validations');
            node.expect(res.body.attribute_validations[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('attribute_validation_request_id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('chunk');
            node.expect(res.body.attribute_validations[0]).to.have.property('timestamp');
            done();
        });
    });
});


describe('GET Attribute validations for attribute ', function () {

    it('Attribute validation - attribute', function (done) {

        let param = {};
        param.type = "name";
        param.owner = 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w';

        getAttributeValidation(param, function (err, res) {
            node.expect(res.body).to.have.property('success').to.be.eq(true);
            node.expect(res.body).to.have.property('attribute_validations');
            node.expect(res.body.attribute_validations[0]).to.have.property('id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('attribute_validation_request_id').to.be.at.least(1);
            node.expect(res.body.attribute_validations[0]).to.have.property('chunk');
            node.expect(res.body.attribute_validations[0]).to.have.property('timestamp');
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
    request.secret = param.secret ? param.secret : "blade early broken display angry wine diary alley panda left spy woman";
    request.publicKey = param.publicKey ? param.publicKey : "025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6";
    request.asset = {};
    request.asset.attribute = [];
    request.asset.attribute[0] = {};
    request.asset.attribute[0].type = param.type ? param.type : "name";
    request.asset.attribute[0].owner = param.owner ? param.owner : "LXe6ijpkATHu7m2aoNJnvt6kFgQMjEyQLQ";
    request.asset.attribute[0].value = param.value ? param.value : "JOE";
    return request;
}

function createAttributeValidationRequest(param) {

    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : "blade early broken display angry wine diary alley panda left spy woman";
    request.publicKey = param.publicKey ? param.publicKey : "025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6";
    request.asset = {};
    request.asset.validation = [];
    request.asset.validation[0] = {};
    request.asset.validation[0].type = param.type ? param.type : "name";
    request.asset.validation[0].owner = param.owner ? param.owner : "LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w";
    request.asset.validation[0].validator = param.validator ? param.validator : validator;
    return request;
}

function createAttributeValidation(param) {

    let request = {};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : "blade early broken display angry wine diary alley panda left spy woman";
    request.publicKey = param.publicKey ? param.publicKey : "025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6";
    request.asset = {};
    request.asset.validation = [];
    request.asset.validation[0] = {};
    request.asset.validation[0].type = param.type ? param.type : "name";
    request.asset.validation[0].owner = param.owner ? param.owner : "LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w";
    request.asset.validation[0].validator = param.validator ? param.validator : validator;
    return request;
}

function getAttributeTypeByName(name, done) {
    node.get('/api/attributes/types?name=' + name, done);
}

function postAttribute(params, done) {
    node.post('/api/attributes', params, done);
}

function postAttributeValidationRequest(params, done) {
    node.post('/api/attributes/validationrequest', params, done);
}
function postAttributeValidation(params, done) {
    node.post('/api/attributes/validation', params, done);
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
    let url = '/api/attributes/validationrequest';
    if (params.validator || params.attribute_id) {
        url += '?';
    }
    if (params.validator) {
        url += '&validator=' + '' + params.validator;
    }
    if (params.attribute_id) {
        url += '&attribute_id=' + '' + params.attribute_id;
    }
    node.get(url, done);

}

function getAttributeValidation(params, done) {
    let url = '/api/attributes/validation';
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
    node.get(url, done);

}

