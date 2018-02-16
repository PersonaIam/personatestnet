'use strict';

var pgp = require('pg-promise');

var IdentitySql = {

    getIdFragments: 'SELECT ARRAY_AGG("id") AS "ids" FROM identity WHERE "owner" = ${address}'
};

module.exports = IdentitySql;