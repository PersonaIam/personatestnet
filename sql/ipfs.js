'use strict';

var IpfsSql = {
    deleteHash: 'DELETE FROM ipfs_pin_queue WHERE "id" = ${id};',

    insert: 'INSERT INTO ipfs_pin_queue ' +
    '("ipfs_hash", "timestamp") ' +
    'VALUES ' +
    '(${ipfsHash},  ${timestamp}) ON CONFLICT DO NOTHING RETURNING id,ipfs_hash ',

    getHashFromQueue: 'SELECT id,ipfs_hash FROM ipfs_pin_queue WHERE "ipfs_hash" = ${ipfsHash}',
};

module.exports =  { IpfsSql }  ;
