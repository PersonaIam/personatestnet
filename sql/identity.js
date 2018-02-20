'use strict';

var pgp = require('pg-promise');

var IdentitySql = {

    getIdFragments: 'SELECT * FROM identity WHERE "owner" = ${address}',
    getVerifications: 'SELECT * FROM verifications WHERE "data" = ${id}',
    getVerificationFrom: 'SELECT * FROM verifications WHERE "data" = ${data} AND "verifier" = ${verifier}'
};

module.exports = IdentitySql;