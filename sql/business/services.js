'use strict';

let ServicesSql = {
    sortFields: [
        'id',
        'provider',
        'name',
        'description',
        'timestamp',
    ],

    updateServiceStatus:'UPDATE services SET "status" = ${status} where "provider" = ${provider} AND name = ${name}',
    getServicesForProvider:'SELECT * FROM services where "provider" = ${provider} order by id',

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
