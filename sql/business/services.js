'use strict';

let ServicesSql = {
    sortFields: [
        'id',
        'provider',
        'name',
        'description',
        'timestamp',
    ],

    insertAttributesForService: 'INSERT INTO service_attributes ("service_name","service_provider","attribute_type") ' +
    'SELECT ${service_name}, ${service_provider}, name from attribute_types',
    updateServiceStatus:'UPDATE services SET "status" = ${status} where "provider" = ${provider} AND name = ${name}',
    getServicesForProvider:'SELECT * FROM services where "provider" = ${provider} order by id',
    getServiceAttributeTypes:'SELECT sa.attribute_type FROM service_attributes sa ' +
    // 'JOIN services s on s.name = sa.service_name AND s.provider=sa.service_provider ' +
    'WHERE "service_name" = ${name} AND "service_provider" = ${provider}',

    getServicesFiltered: function (params) {
        return [
            'SELECT * FROM services ',
            (params.where.length ? 'WHERE ' + params.where.join(' AND ') : ''),
            (params.sortField ? 'ORDER BY ' + [params.sortField, params.sortMethod].join(' ') : '')
        ].filter(Boolean).join(' ');
    },
};


module.exports = {
    ServicesSql,
};
