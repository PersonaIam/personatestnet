'use strict';

let AttributesSql = {
    sortFields: [
        'id',
        'type',
        'value',
        'owner',
        'timestamp'
    ],

    getAttributesForOwner:'SELECT * FROM attributes where "owner" = ${owner}',

    updateAttribute: 'UPDATE attributes ' +
    ' SET value = ${value}, timestamp = ${timestamp}, expire_timestamp = ${expire_timestamp}, associations = ${associations}' +
    ' WHERE id = ${id}',
    deleteAttribute: 'DELETE FROM attributes WHERE "id" = ${id};',
    countByRowId: 'SELECT COUNT("id")::int FROM attributes',
    insert: 'INSERT INTO attributes ' +
    '("type", "value", "owner", "timestamp", "expire_timestamp") ' +
    'VALUES ' +
    '(${type}, ${value}, ${owner}, ${timestamp}, ${expire_timestamp}) RETURNING id,type,value,owner,expire_timestamp',

    getActiveAttributesForOwner : 'SELECT a.id,a.type,at.data_type from attributes a JOIN attribute_types at ON at.name = a.type ' +
    ' WHERE "owner" = ${owner} and a.id in (SELECT attribute_id ' +
    ' FROM attribute_validation_requests avr ' +
    ' WHERE avr.timestamp > ${after} AND avr.expire_timestamp > ${expirationAfter} ' +
    ' AND avr.timestamp > a.timestamp GROUP BY attribute_id HAVING COUNT(*)>= ${validations_required})',

    getAttributesFiltered: function (params) {
        return [
            'SELECT * FROM attributes ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    },
};

let AttributeTypesSql = {
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

let AttributeValidationRequestsSql = {
    sortFields: [
        'id',
        'attribute_id',
        'validator',
        'timestamp',
        'status',
        'type'
    ],
    getAttributeValidationsForAttributeAndStatus : 'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator ' +
    'FROM attribute_validation_requests avr JOIN attributes a ON a.id = avr.attribute_id ' +
    'WHERE "attribute_id" = ${attribute_id} AND "status" = ${status} AND avr.timestamp > a.timestamp',
    getAttributeValidationRequest: 'SELECT * FROM attribute_validation_requests WHERE "id" = ${id}',
    getAttributeValidationRequestsForAttribute: 'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator ' +
    'FROM attribute_validation_requests avr JOIN attributes a ON a.id = avr.attribute_id ' +
    'WHERE "attribute_id" = ${attributeId} AND avr.timestamp > a.timestamp',
    getAttributeValidationRequestsForValidator: 'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator ' +
    'FROM attribute_validation_requests avr JOIN attributes a ON a.id = avr.attribute_id ' +
    'WHERE "validator" = ${validator} AND avr.timestamp > a.timestamp',
    getAttributeValidationsRequestsForAttributeAndValidator: 'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator ' +
    'FROM attribute_validation_requests avr JOIN attributes a ON a.id = avr.attribute_id ' +
    'WHERE attribute_id = ${attributeId} AND "validator" = ${validator} AND avr.timestamp > a.timestamp',
    deleteAttributeValidationRequest: 'DELETE FROM attribute_validation_requests WHERE "id" = ${id}',
    countByRowId: 'SELECT COUNT("id")::int FROM attribute_validation_requests',
    updateValidationRequest : 'UPDATE attribute_validation_requests SET status = ${status} WHERE id = ${id}',
    updateValidationRequestWithType : 'UPDATE attribute_validation_requests SET status = ${status}, validation_type = ${validationType} WHERE id = ${id}',

    expireValidationsFromUpdate: function (params) {
        return [
            'UPDATE attribute_validation_requests ' +
            ' SET expire_timestamp = avr.timestamp FROM  attribute_validation_requests avr' +
            ' LEFT JOIN attributes a ON a.id = avr.attribute_id ' +
            ' WHERE a.id IN ( ' + params.ids.join(' , ')  + ');'

        ].filter(Boolean).join(' ');
    },

    getAttributeValidationRequestsFiltered: function (params) {
        return [
            'SELECT * FROM attribute_validation_requests ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    },
};

let AttributeShareRequestsSql = {

    sortFields: [
        'id',
        'attribute_id',
        'applicant',
        'status',
        'timestamp'
    ],

    updateShareRequest: 'UPDATE attribute_share_requests SET status = ${status} WHERE id = ${id}',
    getAttributeShareRequest: 'SELECT * FROM attribute_share_requests WHERE "id" = ${id}',
    getAttributeShareRequestsForAttribute: 'SELECT * FROM attribute_share_requests WHERE "attribute_id" = ${attribute_id}',
    getAttributeShareRequestsForApplicant: 'SELECT * FROM attribute_share_requests WHERE "applicant" = ${applicant}',
    getAttributeShareRequestsForAttributeAndApplicant:
        'SELECT * FROM attribute_share_requests WHERE "attribute_id" = ${attribute_id} AND "applicant" = ${applicant}',
    deleteAttributeShareRequest: 'DELETE FROM attribute_share_requests WHERE "id" = ${id}',
    countByRowId: 'SELECT COUNT("id")::int FROM attribute_share_requests',

    getAttributeShareRequestsFiltered: function (params) {
        return [
            'SELECT * FROM attribute_share_requests ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    }
};

let AttributeSharesSql = {

    sortFields: [
        'id',
        'attribute_id',
        'applicant',
        'timestamp'
    ],

    getAttributeShare: 'SELECT * FROM attribute_shares WHERE "id" = ${id}',
    getAttributeShareNoValue: 'SELECT id,attribute_id,applicant,timestamp FROM attribute_shares WHERE "id" = ${id}',
    countByRowId: 'SELECT COUNT("id")::int FROM attribute_shares',

    getAttributeSharesFiltered: function (params) {
        return [
            'SELECT id, attribute_id, applicant, timestamp FROM attribute_shares ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    }
};

let AttributeConsumptionsSql = {

    sortFields: [
        'id',
        'attribute_id',
        'timestamp',
        'amount'
    ],

    getAttributeConsumptions : 'SELECT * FROM attribute_consumptions WHERE "id" = ${id}',
    getLastReward : 'SELECT * FROM transactions WHERE "type" = ${type} order by timestamp DESC limit 1',
    getAttributeConsumptionsForRewardsMadeBetween : 'SELECT ac.id,ac.attribute_id,ac.amount,avr.validator,av.chunk FROM attribute_consumptions ac ' +
    'RIGHT OUTER JOIN attribute_validation_requests avr ON ac.attribute_id = avr.attribute_id ' +
    'WHERE ac.timestamp < ${before} AND ac.timestamp >= ${after} AND avr.timestamp < ac.timestamp AND avr.timestamp >= ac.timestamp-${offset}',
    countByRowId: 'SELECT COUNT("id")::int FROM attribute_consumptions',

    getAttributeConsumptionsFiltered: function (params) {
        return [
            'SELECT * FROM attribute_consumptions ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    }
};

let AttributeRewardsSql = {

    sortFields: [
        'id',
        'timestamp',
        'status'
    ],

    getLastRewardRound : 'SELECT * FROM reward_rounds order by "timestamp" DESC limit 1',
    getLastRewardRoundByStatus : 'SELECT * FROM reward_rounds WHERE "status" = ${status} order by "timestamp" DESC limit 1',
    countByRowId: 'SELECT COUNT("id")::int FROM reward_rounds',
    getConsumptionsBetween : 'SELECT "attribute_id","amount" from attribute_consumptions where "timestamp" BETWEEN ${after} AND ${before}',
    getRewardsBetween : 'SELECT * from transactions where "type" = ${type} AND "timestamp" BETWEEN ${after} AND ${before}',
};

let AttributeDocumentAssociationsSql = {

    sortFields: [
        'id',
        'timestamp',
        'attribute_id',
        'document_id'
    ],
    // this query is to be used by validation ( ready_to_be_validated state )
    // add expiration conditions (at least one non-expired document muse exist )
    isAttributeAssociatedWithAnyDocuments : 'SELECT * FROM attribute_document_associations WHERE "attribute_id" = ${attributeId} LIMIT 1',
    getAssociationsForAttribute : 'SELECT * FROM attribute_document_associations WHERE "attribute_id" = ${attributeId}',
    getAssociationsForDocument : 'SELECT * FROM attribute_document_associations WHERE "document_id" = ${documentId}',
    getAttributeDocumentAssociation : 'SELECT * FROM attribute_document_associations ' +
    'WHERE "attribute_id" = ${attributeId} AND "document_id" = ${documentId}',

    getAttributeDocumentAssociationsFiltered: function (params) {
        return [
            'SELECT * FROM attribute_document_associations ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    }
};

module.exports = {
    AttributeValidationRequestsSql,
    AttributeTypesSql,
    AttributesSql,
    AttributeShareRequestsSql,
    AttributeSharesSql,
    AttributeConsumptionsSql,
    AttributeRewardsSql,
    AttributeDocumentAssociationsSql,
};
