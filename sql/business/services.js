'use strict';

let ServicesSql = {
    sortFields: [
        'id',
        'provider',
        'name',
        'description',
        'timestamp',
        'attribute_types',
        'nr_validations'
    ],

    updateServiceStatus:'UPDATE services SET "status" = ${status} WHERE "provider" = ${provider} AND name = ${name}',
    getServicesForProvider:'SELECT * FROM services where "provider" = ${provider} order by id',
    getServiceAttributeTypes:'SELECT attribute_types::json FROM services WHERE "provider" = ${provider} AND name = ${name}',

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
