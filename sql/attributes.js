'use strict';

var AttributesSql = {
    sortFields: [
        'id',
        'type',
        'value',
        'owner',
        'timestamp'
    ],

    deleteAttribute: 'DELETE FROM attributes WHERE "id" = ${id};',

    countByRowId: 'SELECT COUNT("id")::int FROM attributes',

    insert: 'INSERT INTO attributes ' +
    '("type", "value", "owner", "timestamp", "active") ' +
    'VALUES ' +
    '(${type}, ${value}, ${owner}, ${timestamp}, ${active}) RETURNING id,type,value,owner,active',

    update: 'UPDATE attributes ' +
    'SET ("value", "timestamp", "active") = (${value}, ${timestamp}, ${active}) ' +
    'WHERE "owner" = ${owner} AND "type" = ${type} RETURNING id, owner, type, value;',

    getAttributesFiltered: function (params) {
        return [
            'SELECT * FROM attributes ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    },

};

var AttributeTypesSql = {
    sortFields: [
        'id',
        'name',
        'data_type',
        'validation',
        'options'
    ],

    insert: 'INSERT INTO attribute_types ("name", "data_type","validation","options") VALUES ' +
    '(${name}, ${data_type}, ${validation}, ${options}) RETURNING id,name,data_type',

    getAttributeType: 'SELECT * FROM attribute_types WHERE "id" = ${id}',

    getAttributeTypeByName: 'SELECT * FROM attribute_types WHERE "name" = ${name}',

    getAttributeDataType: 'SELECT name,data_type FROM attribute_types WHERE "id" = ${id}',

    getAttributeOptions: 'SELECT options FROM attribute_types WHERE "id" = ${id}',

    deleteAttributeType: 'DELETE FROM attribute_types WHERE "id" = ${id};',

    countByRowId: 'SELECT COUNT("id")::int FROM attribute_types',

    getAttributeTypesList: function () {
        return [
            'SELECT id, name, data_type, validation, options FROM attribute_types'
        ].filter(Boolean).join(' ');
    },

};

var AttributeValidationsSql = {
    sortFields: [
        'id',
        'attribute_id',
        'validator',
        'chunk',
        'timestamp'
    ],

    getAttributeValidation: 'SELECT * FROM attribute_validations WHERE "id" = ${id}',

    getAttributeValidations: 'SELECT * FROM attribute_validations WHERE "attribute_id" = ${id}',

    getAttributeValidationsMadeBy : 'SELECT * FROM attribute_validations WHERE "validator" = ${validator}',

    deleteAttributeValidation: 'DELETE FROM attribute_validations WHERE "id" = ${id};',

    countByRowId: 'SELECT COUNT("id")::int FROM attribute_validations'

};

module.exports =  { AttributeValidationsSql, AttributeTypesSql, AttributesSql }  ;
