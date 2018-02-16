'use strict';

var pgp = require('pg-promise');

var IdentitySql = {

    getIdFragments: 'SELECT * FROM identity WHERE "owner" = ${address}'
};

module.exports = IdentitySql;