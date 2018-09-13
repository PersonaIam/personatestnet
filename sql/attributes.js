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

var AttributeValidationRequestsSql = {
    sortFields: [
        'id',
        'attribute_id',
        'validator',
        'timestamp'
    ],

    getAttributeValidationRequest: 'SELECT * FROM attribute_validation_requests WHERE "id" = ${id}',

    getAttributeValidationRequestsForAttribute: 'SELECT * FROM attribute_validation_requests WHERE "attribute_id" = ${attribute_id}',

    getAttributeValidationRequestsForValidator: 'SELECT * FROM attribute_validation_requests WHERE "validator" = ${validator}',

    getAttributeValidationsRequestsForAttributeAndValidator :
        'SELECT * FROM attribute_validation_requests WHERE "attribute_id" = ${attribute_id} AND "validator" = ${validator}',

    getCompletedAttributeValidationRequests: 'SELECT * FROM attribute_validation_requests avr ' +
    'RIGHT OUTER JOIN attribute_validations av ON avr.id=av.attribute_validation_request_id ' +
    'WHERE avr.validator = ${validator} OR avr.attribute_id = (SELECT id from attributes a where a.type = ${type} and a.owner = ${owner})',

    getIncompleteAttributeValidationRequests: 'SELECT * FROM attribute_validation_requests avr ' +
    'WHERE (avr.validator = ${validator} OR avr.attribute_id = (SELECT id from attributes a where a.type = ${type} and a.owner = ${owner})) ' +
    'AND id NOT IN (SELECT attribute_validation_request_id from attribute_validations)',

    // getCompletedAttributeValidationRequestsForAttribute: 'SELECT * FROM attribute_validation_requests avr ' +
    // 'RIGHT OUTER JOIN attribute_validations av ON avr.id=av.attribute_validation_request_id WHERE avr.attribute_id = ${attribute_id}',
    //
    // getIncompleteAttributeValidationRequestsForAttribute: 'SELECT * FROM attribute_validation_requests avr ' +
    // 'WHERE avr.attribute_id = ${attribute_id} and id NOT IN (SELECT attribute_validation_request_id from attribute_validations)',

    deleteAttributeValidationRequest: 'DELETE FROM attribute_validation_requests WHERE "id" = ${id}',

    countByRowId: 'SELECT COUNT("id")::int FROM attribute_validation_requests',

    getAttributeValidationRequestsFiltered: function (params) {
        return [
            'SELECT * FROM attribute_validation_requests ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    },
};

var AttributeValidationsSql = {
    sortFields: [
        'id',
        'attribute_validation_request_id',
        'chunk',
        'timestamp',
        'expireTimestamp'
    ],

    getAttributeValidation: 'SELECT * FROM attribute_validations WHERE "id" = ${id}',

    getAttributeValidationList: 'SELECT * FROM attribute_validations WHERE "id" IN ${attribute_ids}',

    getAttributeValidationForRequest: 'SELECT * FROM attribute_validations WHERE "attribute_validation_request_id" = ANY(${requestIds}::int[])',

    deleteAttributeValidation: 'DELETE FROM attribute_validations WHERE "id" = ${id}',

    countByRowId: 'SELECT COUNT("id")::int FROM attribute_validations'

};

module.exports =  { AttributeValidationRequestsSql, AttributeTypesSql, AttributesSql, AttributeValidationsSql }  ;
