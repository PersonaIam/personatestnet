'use strict';

let AttributesSql = {
    sortFields: [
        'id',
        'type',
        'value',
        'owner',
        'timestamp'
    ],

    getAttributesForOwner:'SELECT * FROM attributes where "owner" = ${owner} order by id',
    getAttributeById:'SELECT * FROM attributes where "id" = ${id}',
    updateAttribute: 'UPDATE attributes ' +
    ' SET value = ${value}, timestamp = ${timestamp}, expire_timestamp = ${expire_timestamp}, associations = ${associations}' +
    ' WHERE id = ${id}',
    deleteAttribute: 'DELETE FROM attributes WHERE "id" = ${id};',
    countByRowId: 'SELECT COUNT("id")::int FROM attributes',
    insert: 'INSERT INTO attributes ' +
    '("type", "value", "owner", "timestamp", "expire_timestamp") ' +
    'VALUES ' +
    '(${type}, ${value}, ${owner}, ${timestamp}, ${expire_timestamp}) RETURNING id,type,value,owner,expire_timestamp',

    getAttributesWithValidationDetails :
    'SELECT a.id,a.type,at.data_type,avra.action,avra.timestamp from attributes a ' +
    ' JOIN attribute_types at ON at.name = a.type ' +
    ' JOIN attribute_validation_requests avr ON avr.attribute_id = a.id ' +
    ' JOIN attribute_validation_request_actions avra on avra.attribute_validation_request_id = avr.id ' +
    ' WHERE avra.timestamp > ${since} ' +                                   // checks that the notarization took place after the "since" timestamp
    ' AND (a.expire_timestamp > ${now} OR a.expire_timestamp IS NULL) ' +   // checks that the attribute is not expired
    ' AND avra.action = ANY(${action}) AND avr.status = ANY(${status}) ' +  // checks the action and status
    ' AND avra.timestamp > a.timestamp AND "owner" = ${owner} ' +
    ' ORDER BY a.id, avra.timestamp',

    getAttributesFiltered: function (params) {
        return [
            'SELECT * FROM attributes ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            'ORDER BY id'
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
    getAttributeValidationRequest: 'SELECT * FROM attribute_validation_requests WHERE "id" = ${id}',
    getAttributeValidationsForAttributeAndStatus :
    'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator,avr.validation_type,avr.reason,avr.timestamp as timestamp,avra.timestamp as last_update_timestamp ' +
    'FROM attribute_validation_requests avr ' +
    'JOIN attributes a ON a.id = avr.attribute_id ' +
    'LEFT OUTER JOIN attribute_validation_request_actions avra ON avr.id = avra.attribute_validation_request_id AND avra.timestamp = (SELECT MAX(timestamp) from attribute_validation_request_actions avra1 WHERE avra1.attribute_validation_request_id = avr.id) ' +
    'WHERE "attribute_id" = ${attribute_id} AND "status" = ${status} AND avr.timestamp > a.timestamp AND avr.timestamp > ${timespan}',
    getAttributeValidationsForOwnerAndStatus :
    'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator,avr.validation_type,avr.reason,avr.timestamp as timestamp,avra.timestamp as last_update_timestamp ' +
    'FROM attribute_validation_requests avr ' +
    'JOIN attributes a ON a.id = avr.attribute_id ' +
    'LEFT OUTER JOIN attribute_validation_request_actions avra ON avr.id = avra.attribute_validation_request_id AND avra.timestamp = (SELECT MAX(timestamp) from attribute_validation_request_actions avra1 WHERE avra1.attribute_validation_request_id = avr.id) ' +
    'WHERE "owner" = ${owner} AND "status" = ${status} AND avr.timestamp > a.timestamp AND avr.timestamp > ${timespan}',
    getAttributeValidationRequestsForAttribute:
    'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator,avr.validation_type,avr.reason,avr.timestamp as timestamp,avra.timestamp as last_update_timestamp ' +
    'FROM attribute_validation_requests avr ' +
    'JOIN attributes a ON a.id = avr.attribute_id ' +
    'LEFT OUTER JOIN attribute_validation_request_actions avra ON avr.id = avra.attribute_validation_request_id AND avra.timestamp = (SELECT MAX(timestamp) from attribute_validation_request_actions avra1 WHERE avra1.attribute_validation_request_id = avr.id) ' +
    'WHERE "attribute_id" = ${attributeId} AND avr.timestamp > a.timestamp',
    getAttributeValidationRequestsForAttributeAndValidator:
    'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator,avr.validation_type,avr.reason,avr.timestamp as timestamp,avra.timestamp as last_update_timestamp ' +
    'FROM attribute_validation_requests avr ' +
    'JOIN attributes a ON a.id = avr.attribute_id ' +
    'LEFT OUTER JOIN attribute_validation_request_actions avra ON avr.id = avra.attribute_validation_request_id AND avra.timestamp = (SELECT MAX(timestamp) from attribute_validation_request_actions avra1 WHERE avra1.attribute_validation_request_id = avr.id) ' +
    'WHERE "attribute_id" = ${attributeId} AND "validator" = ${validator} AND avr.timestamp > a.timestamp',
    getAttributeValidationRequestsForOwner:
    'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator,avr.validation_type,avr.reason,avr.timestamp as timestamp,avra.timestamp as last_update_timestamp ' +
    'FROM attribute_validation_requests avr ' +
    'JOIN attributes a ON a.id = avr.attribute_id ' +
    'LEFT OUTER JOIN attribute_validation_request_actions avra ON avr.id = avra.attribute_validation_request_id AND avra.timestamp = (SELECT MAX(timestamp) from attribute_validation_request_actions avra1 WHERE avra1.attribute_validation_request_id = avr.id) ' +
    'WHERE "owner" = ${owner} AND avr.timestamp > a.timestamp',
    getAttributeValidationRequestsForValidator:
    'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator,avr.validation_type,avr.reason,avr.timestamp as timestamp,avra.timestamp as last_update_timestamp ' +
    'FROM attribute_validation_requests avr ' +
    'JOIN attributes a ON a.id = avr.attribute_id ' +
    'LEFT OUTER JOIN attribute_validation_request_actions avra ON avr.id = avra.attribute_validation_request_id AND avra.timestamp = (SELECT MAX(timestamp) from attribute_validation_request_actions avra1 WHERE avra1.attribute_validation_request_id = avr.id) ' +
    'WHERE "validator" = ${validator} AND avr.timestamp > a.timestamp',
    getAttributeValidationRequestsForOwnerAndValidator:
    'SELECT a.owner,a.type,avr.id,avr.attribute_id,avr.status,avr.validator,avr.validation_type,avr.reason,avr.timestamp as timestamp,avra.timestamp as last_update_timestamp ' +
    'FROM attribute_validation_requests avr ' +
    'JOIN attributes a ON a.id = avr.attribute_id ' +
    'LEFT OUTER JOIN attribute_validation_request_actions avra ON avr.id = avra.attribute_validation_request_id AND avra.timestamp = (SELECT MAX(timestamp) from attribute_validation_request_actions avra1 WHERE avra1.attribute_validation_request_id = avr.id) ' +
    'WHERE owner = ${owner} AND "validator" = ${validator} AND avr.timestamp > a.timestamp',
    deleteAttributeValidationRequest: 'DELETE FROM attribute_validation_requests WHERE "id" = ${id}',
    countByRowId: 'SELECT COUNT("id")::int FROM attribute_validation_requests',
    updateValidationRequest : 'UPDATE attribute_validation_requests SET status = ${status} WHERE id = ${id}',
    updateValidationRequestWithType : 'UPDATE attribute_validation_requests SET status = ${status}, validation_type = ${validationType} WHERE id = ${id}',
    updateValidationRequestWithReason : 'UPDATE attribute_validation_requests SET status = ${status}, reason = ${reason} WHERE id = ${id}',

    expireValidationsFromUpdate: function (params) {
        return [
            'UPDATE attribute_validation_requests ' +
            ' SET expire_timestamp = avr.timestamp FROM  attribute_validation_requests avr' +
            ' LEFT JOIN attributes a ON a.id = avr.attribute_id ' +
            ' WHERE a.id IN ( ' + params.ids.join(' , ')  + ');'

        ].filter(Boolean).join(' ');
    }
};

let IdentityUseRequestsSql = {

    sortFields: [
        'id',
        'attribute_id',
        'service_id',
        'status',
        'reason',
        'timestamp'
    ],

    getIdentityUseRequestsByServiceId :
    'SELECT iur.owner,s.attribute_types,s.name,s.provider,s.description,iur.timestamp,iur.id,iur.status,iur.reason,iur.attributes,s.status as service_status ' +
    'FROM identity_use_requests iur ' +
    'JOIN services s ON s.id = iur.service_id ' +
    'WHERE "service_id" = ${service_id}',

    getIdentityUseRequestsByServiceNameAndProvider :
    'SELECT iur.owner,s.attribute_types,s.name,s.provider,s.description,iur.timestamp,iur.id,iur.status,iur.reason,iur.attributes,s.status as service_status ' +
    'FROM identity_use_requests iur ' +
    'JOIN services s ON s.id = iur.service_id ' +
    'WHERE s.name = ${service_name} AND s.provider = ${service_provider}',

    getIdentityUseRequestsByServiceProvider :
    'SELECT iur.owner,s.attribute_types,s.name,s.provider,s.description,iur.timestamp,iur.id,iur.status,iur.reason,iur.attributes,s.status as service_status ' +
    'FROM identity_use_requests iur ' +
    'JOIN services s ON s.id = iur.service_id ' +
    'WHERE s.provider = ${service_provider}',

    getIdentityUseRequestsByOwner :
    'SELECT iur.owner,s.attribute_types,s.name,s.provider,s.description,iur.timestamp,iur.id,iur.status,iur.reason,iur.attributes,s.status as service_status ' +
    'FROM identity_use_requests iur ' +
    'JOIN services s ON s.id = iur.service_id ' +
    'WHERE iur.owner = ${owner}',

    getIdentityUseRequestsByServiceAndOwner :
    'SELECT iur.owner,s.attribute_types,s.name,s.provider,s.description,iur.timestamp,iur.id,iur.status,iur.reason,iur.attributes,s.status as service_status ' +
    'FROM identity_use_requests iur ' +
    'JOIN services s ON s.id = iur.service_id ' +
    'WHERE iur.owner = ${owner} AND s.id = ${service_id}',

    getAnsweredValidationRequestsForIdentityUseRequest :
    'SELECT avr.id,avr.attribute_id,avr.validator,avr.status,avr.validation_type,a.type from attribute_validation_requests avr ' +
    'JOIN attributes a ON avr.attribute_id = a.id ' +
    'JOIN identity_use_requests iur ON iur.owner = a.owner ' +
    'JOIN attribute_validation_request_actions avra ON avra.attribute_validation_request_id = avr.id ' +
    'WHERE iur.owner = ${owner} AND iur.service_id = ${service_id} AND (avra.action = \'NOTARIZE\' OR avra.action = \'REJECT\')',

    updateIdentityUseRequest : 'UPDATE identity_use_requests SET status = ${status} WHERE id = ${id}',
    updateIdentityUseWithReason : 'UPDATE identity_use_requests SET status = ${status}, reason = ${reason} WHERE id = ANY(${id})',
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
    AttributeConsumptionsSql,
    AttributeRewardsSql,
    AttributeDocumentAssociationsSql,
    IdentityUseRequestsSql
};
