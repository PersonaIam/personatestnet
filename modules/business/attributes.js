'use strict';

let Router = require('../../helpers/router.js');
let OrderBy = require('../../helpers/orderBy.js');
let schema = require('../../schema/business/attributes.js');
let slots = require('../../helpers/slots.js');
let moment = require('moment');
let sql = require('../../sql/business/attributes.js');
let attributedHelper = require('../../helpers/attributes.js');
let transactionTypes = require('../../helpers/transactionTypes.js');
let messages = require('../../helpers/messages.js');
let async = require('async');
let constants = require('../../helpers/constants.js');
let _ = require('lodash');

// Private fields
let modules, library, self, __private = {}, shared = {};

__private.assetTypes = {};

// Constructor
function Attributes(cb, scope) {
    library = scope;
    self = this;

    let Attribute = require('../../logic/attribute.js');
    __private.assetTypes[transactionTypes.CREATE_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.CREATE_ATTRIBUTE, new Attribute()
    );

    let AttributeUpdate = require('../../logic/attributeUpdate.js');
    __private.assetTypes[transactionTypes.UPDATE_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.UPDATE_ATTRIBUTE, new AttributeUpdate()
    );

    let AttributeConsume = require('../../logic/attributeConsume.js');
    __private.assetTypes[transactionTypes.CONSUME_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.CONSUME_ATTRIBUTE, new AttributeConsume()
    );

    let RewardRound = require('../../logic/rewardRound.js');
    __private.assetTypes[transactionTypes.RUN_REWARD_ROUND] = library.logic.transaction.attachAssetType(
        transactionTypes.RUN_REWARD_ROUND, new RewardRound()
    );

    let Reward = require('../../logic/reward.js');
    __private.assetTypes[transactionTypes.REWARD] = library.logic.transaction.attachAssetType(
        transactionTypes.REWARD, new Reward()
    );

    let UpdateRewardRound = require('../../logic/updateRewardRound.js');
    __private.assetTypes[transactionTypes.UPDATE_REWARD_ROUND_TO_COMPLETE] = library.logic.transaction.attachAssetType(
        transactionTypes.UPDATE_REWARD_ROUND_TO_COMPLETE, new UpdateRewardRound()
    );


    return cb(null, self);
}

//
//__EVENT__ `onAttachPublicApi`

//
Attributes.prototype.onAttachPublicApi = function () {
    __private.attachApi();
};

// Events
//
//__EVENT__ `onBind`

//
Attributes.prototype.onBind = function (scope) {
    modules = scope;

    __private.assetTypes[transactionTypes.CREATE_ATTRIBUTE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.UPDATE_ATTRIBUTE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.CONSUME_ATTRIBUTE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.RUN_REWARD_ROUND].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.UPDATE_REWARD_ROUND_TO_COMPLETE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.REWARD].bind({
        modules: modules, library: library
    });

};

// Private methods
__private.attachApi = function () {
    let router = new Router();

    router.use(function (req, res, next) {
        if (modules) {
            return next();
        }
        res.status(500).send({success: false, error: messages.BLOCKCHAIN_LOADING});
    });

    router.map(shared, {
        'post /': 'addAttribute',
        'get /': 'getAttribute',
        'get /types/list': 'listAttributeTypes',
        'get /types': 'getAttributeType',
        'put /': 'updateAttribute',

        'post /consume': 'consumeAttribute',
        'get /consume': 'getAttributeConsumptions',

        'post /runrewardround': 'runRewardRound',
        'post /updaterewardround': 'updateRewardRound',
    });

    router.use(function (req, res, next) {
        res.status(500).send({success: false, error: messages.API_ENDPOINT_NOT_FOUND});
    });

    library.network.app.use('/api/attributes', router);
    library.network.app.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }
        library.logger.error(' API error ' + req.url, err);
        res.status(500).send({success: false, error: 'API error: ' + err.message});
    });
};

Attributes.getAttributesByFilter = function (filter, cb) {

    if (!filter.owner) {
        return cb(messages.MISSING_OWNER_ADDRESS);
    }

    library.db.query(sql.AttributesSql.getAttributesForOwner, {owner: filter.owner}).then(function (rows) {
        let attributes = [];
        for (let i = 0; i < rows.length; i++) {
            attributes.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        if (count === 0) {
            return cb(null, {count: 0, attributes: []});
        }
        let data = {};

        let ownerAttributes = attributes;
        attributes = filter.type ? attributes.filter(a => a.type === filter.type) : attributes;
        attributes = filter.id ? attributes.filter(a => a.id === filter.id) : attributes;

        function isAttributeRejectedWithMaxConsecutiveRedFlags(attribute) {
            return attribute.redFlagsLast >= constants.MIN_RED_FLAGS_IN_A_ROW_FOR_REJECTED
        }

        function isAttributeRejectedWithNoMinNotarizationsInARowInFirstBatch(attributeDetails, id) {
            let attributeDetailsLocal = attributeDetails.filter(attribute => attribute.id = id).slice(0, constants.FIRST_NOTARIZATION_BATCH_SIZE)
            return attributeDetailsLocal.length >= constants.FIRST_NOTARIZATION_BATCH_SIZE && !hasMinNotarizationsInARow(attributeDetailsLocal)
        }

        function hasMinNotarizationsInARow(attributeDetails) {
            let score = 0;
            let result = false;
            attributeDetails.forEach(detail => {
                if (detail.action === constants.validationRequestValidatorActions.NOTARIZE) {
                    score++;
                }
                if (detail.action === constants.validationRequestValidatorActions.REJECT) {
                    score = 0;
                }
                if (score === constants.MIN_NOTARIZATIONS_IN_A_ROW) {
                    result = true;
                }
            });
            return result;
        }

        function isFirstValidationANotarizationInFirstBatch(attributeDetails, id) {
            let attributeDetailsLocal = attributeDetails.filter(attribute => attribute.id = id);
            let attributeDetail = attributeDetailsLocal.slice(0, 1);
            return attributeDetail[0].action === constants.validationRequestValidatorActions.NOTARIZE;
        }

        function getNumberOfRedFlags(attributeDetails, id) {
            let attributeDetailsLocal = attributeDetails.filter(attribute => attribute.id = id);
            let score = 0;
            let redFlags = 0;
            attributeDetailsLocal.forEach(detail => {
                if (detail.action === constants.validationRequestValidatorActions.NOTARIZE) {
                    score++;
                }
                if (detail.action === constants.validationRequestValidatorActions.REJECT) {
                    redFlags++;
                    score = 0;
                }
                if (score === constants.MIN_NOTARIZATIONS_IN_A_ROW) {
                    redFlags = 0;
                }
            });
            return redFlags;
        }

        library.db.query(sql.AttributesSql.getAttributesWithValidationDetails, {
            oneYearSinceNow: slots.getTime(moment().subtract(1, 'year')),
            now: slots.getTime(),
            owner: filter.owner,
            status: [constants.validationRequestStatus.COMPLETED, constants.validationRequestStatus.REJECTED],
            action: [constants.validationRequestValidatorActions.NOTARIZE, constants.validationRequestValidatorActions.REJECT]
        })
            .then(function (attributeDetails) {
                let yellowFlags = [];
                let redFlags = [];
                attributeDetails.forEach(adu => {
                    adu.rejected = false;
                    adu.yellowFlags = attributeDetails
                        .filter(ad => ad.id === adu.id && ad.action === constants.validationRequestValidatorActions.REJECT)
                        .length;
                    adu.redFlagsLast = attributeDetails
                        .filter(ad => ad.id === adu.id)
                        .slice(-1 * constants.MIN_RED_FLAGS_IN_A_ROW_FOR_REJECTED) // get last elements, to check for rejections
                        .filter(ad => ad.action === constants.validationRequestValidatorActions.REJECT)
                        .length;
                    adu.completed = attributeDetails.filter(ad => ad.id === adu.id && ad.action === constants.validationRequestValidatorActions.NOTARIZE).length
                });
                attributes.forEach(attribute => {
                    attribute.active = false;
                    attribute.yellowFlags = 0;
                    attribute.redFlags = 0;
                    attribute.rejected = false;
                    let attributeDetailsFiltered = attributeDetails.filter(a => a.id === attribute.id);
                    if (attributeDetailsFiltered && attributeDetailsFiltered.length > 0) {
                        let attributeDetailsElement = attributeDetailsFiltered[0];
                        attribute.yellowFlags = attributeDetailsElement.yellowFlags;
                        attribute.redFlags = getNumberOfRedFlags(attributeDetailsFiltered, attributeDetailsElement.id);
                        attribute.rejected =
                            isAttributeRejectedWithMaxConsecutiveRedFlags(attributeDetailsElement) ||
                            isAttributeRejectedWithNoMinNotarizationsInARowInFirstBatch(attributeDetailsFiltered, attributeDetailsElement.id);
                        attribute.active =
                            !attribute.rejected &&
                            ( isFirstValidationANotarizationInFirstBatch(attributeDetailsFiltered, attributeDetailsElement.id) ||
                              hasMinNotarizationsInARow(attributeDetailsFiltered, attributeDetailsElement.id));
                        attribute.completed = attributeDetailsElement.completed;
                    }
                    attribute.documented = ownerAttributes.filter(a => a.associations && a.associations.includes(attribute.id)).length > 0;
                });
                data.attributes = attributes;
                data.count = attributes.length;
                return cb(null, data);
            })
    })
};

__private.getAttributeConsumptionsByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.attribute_id) {
        where.push('"attribute_id" = ${attribute_id}');
        params.attribute_id = filter.attribute_id;
    }

    if (filter.before) {
        where.push('"timestamp" < ${before}');
        params.before = filter.before;
    }

    if (filter.after) {
        where.push('"timestamp" > ${after}');
        params.after = filter.after;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributeSharesSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'attribute_id', 'timestamp'].indexOf(sortField) > -1) {
                    return sortField;
                } else {
                    return sortField;
                }
            }
        }
    );

    if (orderBy.error) {
        return cb(orderBy.error);
    }

    library.db.query(sql.AttributeConsumptionsSql.getAttributeConsumptionsFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributeConsumptions = [];

        for (let i = 0; i < rows.length; i++) {
            attributeConsumptions.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeConsumptions = attributeConsumptions;
        }
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    });
};

__private.checkAssociations = function (filter, cb) {

    let attributeFilter = filter.asset.attribute[0];
    if (!attributeFilter.associations) {
        return cb(null);
    }
    if (attributeFilter.associations && attributeFilter.associations.length === 0) {
        return cb(messages.EMPTY_ASSOCIATIONS_ARRAY);
    }
    library.db.query(sql.AttributesSql.getAttributesForOwner, {owner: filter.asset.attribute[0].owner}).then(function (data) {
        __private.listAttributeTypes({}, function (err, attributeTypes) {
            let attributeFileTypesNames = attributeTypes.attribute_types.filter(i => i.data_type === 'file').map(o => o.name);
            if (!filter.asset.attribute[0].attributeId) { // newly created attribute
                if (!attributeFileTypesNames.includes(attributeFilter.type)) {
                    return cb(messages.ASSOCIATIONS_NOT_SUPPORTED_FOR_NON_FILE_TYPES);
                }
            } else {
                let originalType = data.filter(i => i.id === filter.asset.attribute[0].attributeId)[0].type;

                if (!attributeFileTypesNames.includes(originalType)) {
                    return cb(messages.ATTRIBUTE_ASSOCIATION_BASE_ATTRIBUTE_NOT_A_FILE);
                }
            }

            let dataAttributeIds = data.map(attribute => attribute.id);
            let diffOwners = false;
            attributeFilter.associations.forEach(function(association) {
                if (!dataAttributeIds.includes(association)) {
                    diffOwners = true;
                }
            });
            if (diffOwners) {
                return cb(messages.ATTRIBUTE_ASSOCIATION_DIFFERENT_OWNERS)
            } else {
                return cb(null)
            }
        });

    }).catch(function (err) {
        console.log(err)
    });
};

__private.listAttributeTypes = function (filter, cb) {

    library.db.query(sql.AttributeTypesSql.getAttributeTypesList({}), {}).then(function (rows) {
        let count = rows.length ? rows.length : 0;
        let attribute_types = [];

        for (let i = 0; i < rows.length; i++) {
            attribute_types.push(rows[i]);
        }
        let data = {
            attribute_types: attribute_types,
            count: count
        };

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

Attributes.getAttributeType = function (filter, cb) {

    library.db.query(sql.AttributeTypesSql.getAttributeTypeByName, {name: filter.name}).then(function (rows) {
        let data = {};
        if (rows.length > 0) {
            data = {
                attribute_type: rows[0]
            };
        } else {
            return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND)
        }

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getLastRewardRound = function (filter, cb) {

    library.db.query(sql.AttributeRewardsSql.getLastRewardRound,
        {}).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data.rewardRound = rows[0];
        }

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getLastCompletedRewardRound = function (filter, cb) {

    library.db.query(sql.AttributeRewardsSql.getLastRewardRoundByStatus,
        {status: 'COMPLETE'}).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data.rewardRound = rows[0];
        }

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getUnrewardedConsumptionCalculation = function (filter, cb) {

    let unrewardedAttributeConsumptions = [];
    const after = filter.after;
    const before = filter.before;

    library.db.query(sql.AttributeConsumptionsSql.getAttributeConsumptionsForRewardsMadeBetween,
        {before: before, after: after, offset: moment.duration(1, 'y').asMilliseconds()})
        .then(function (attributeConsumptionsForRewards) {

            library.db.query(sql.AttributeRewardsSql.getRewardsBetween,
                {
                    before: before,
                    after: after,
                    type: transactionTypes.REWARD
                }).then(function (rewardTransactions) {

                let rewards = rewardTransactions.map(tr => {
                    return tr.rawasset;
                });
                attributeConsumptionsForRewards.forEach(i => {
                    let rewardsForConsumption = rewards.filter(r => r.consumption_id === i.id && r.recipient === i.validator);
                    if (!rewardsForConsumption || rewardsForConsumption.length === 0) {
                        let validationsForConsumption = attributeConsumptionsForRewards.filter(k => k.id === i.id);
                        let sumOfChunksForConsumption = validationsForConsumption.reduce(function (a, b) {
                            return a + b.chunk;
                        }, 0);
                        unrewardedAttributeConsumptions.push({
                            recipient: i.validator,
                            amount: (i.amount * i.chunk / sumOfChunksForConsumption),
                            consumption_id: i.id
                        });
                    }
                });
                return cb(null, {unrewardedAttributeConsumptions: unrewardedAttributeConsumptions});

            });

        }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.distributeRewards = function (req, cb) {

    __private.getUnrewardedConsumptionCalculation(req, function (err, res) {

        async.eachSeries(res.unrewardedAttributeConsumptions, function (reward, cb) {
            // generate a keypair for each reward transaction
            let keypair;
            if (!req.body.signature) {
                keypair = library.crypto.makeKeypair(req.body.secret);
            }
            if (keypair && req.body.publicKey) {
                if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                    return cb(messages.INVALID_PASSPHRASE);
                }
            }

            req.body.asset = {
                recipient: reward.recipient,
                amount: reward.amount,
                consumption_id: reward.consumption_id
            };
            req.body.amount = reward.amount;
            req.body.recipientId = reward.recipient;
            req.body.timestamp = slots.getTime();
            return Attributes.buildTransaction({
                    req: req,
                    keypair: keypair,
                    transactionType: transactionTypes.REWARD
                },
                cb);
        }, function (err) {
            return cb(err);
        });
    });
};

__private.createAttributeType = function (filter, cb) {
    let params = {};
    params.name = filter.name;
    params.data_type = filter.data_type;
    params.validation = filter.validation;
    params.options = filter.options;

    library.db.query(sql.AttributeTypesSql.insert, params).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data = {
                attribute_type: rows[0]
            };
        }

        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.addAttributeToIpfs = function (data, callback) {

    /**
     * Check if the desired attribute needs to be uploaded to IPFS; if so, add it to the
     * IPFS network, and on the IPFS pin queue. Once the newly created transaction is forged,
     * we'll need to remove the associated element from the IPFS pin queue
     * */
    async.auto({
        isIPFSUploadRequired: function (callback) {
            const result = attributedHelper.isIPFSUploadRequired(data.attributeDataType);
            callback(null, result);
        },
        uploadToIpfs: ['isIPFSUploadRequired', function (results, callback) {

            const isIPFSUploadRequired = results.isIPFSUploadRequired;
            if (isIPFSUploadRequired) {
                const files = {
                    path: `${data.attributeDataName}-${data.publicKey}`,
                    content: data.value,
                };
                __private.uploadToIpfs(files, function (err, res) {
                    if (err) return callback(err, null);
                    let {hash} = res;
                    return callback(null, {hash});
                });
            }
            else {
                callback(null, 'No Upload Required');
            }
        }],
    }, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(null, result.uploadToIpfs.hash);
    });
};

Attributes.addAttributeToIpfs = function (data, callback) {

    /**
     * Check if the desired attribute needs to be uploaded to IPFS; if so, add it to the
     * IPFS network, and on the IPFS pin queue. Once the newly created transaction is forged,
     * we'll need to remove the associated element from the IPFS pin queue
     * */
    async.auto({
        isIPFSUploadRequired: function (callback) {
            const result = attributedHelper.isIPFSUploadRequired(data.attributeDataType);
            callback(null, result);
        },
        uploadToIpfs: ['isIPFSUploadRequired', function (results, callback) {

            const isIPFSUploadRequired = results.isIPFSUploadRequired;
            if (isIPFSUploadRequired) {
                const files = {
                    path: `${data.attributeDataName}-${data.publicKey}`,
                    content: data.value,
                };
                __private.uploadToIpfs(files, function (err, res) {

                    if (err) return callback(err, null);
                    let {hash} = res;
                    return callback(null, {hash});
                });
            }
            else {
                callback(null, 'No Upload Required');
            }
        }],
    }, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(null, result.uploadToIpfs.hash);
    });
};


/**
 * Add attribute data to IPFS
 *
 * In order to keep IPFS documents alive, only seeded peers will upload to IPFS. Uploading a file on the IPFS network,
 * creates a local copy of the file on the machine that initiates the upload request.
 *
 * Our upload mechanism is defined as:
 * 1. Find a random seed that is able to upload to IPFS
 * 2. Send the file associated with the attribute to this random seed
 *
 * */

__private.uploadToIpfs = function (files, cb) {
    modules.peers.getRandomSeed(function (error, res) {
        if (error) return cb('An error occurred while getting random seed');

        const {peer} = res;

        modules.transport.requestFromPeer(
            peer,
            {
                url: '/api/ipfs',
                method: 'POST',
                data: {files}
            },
            function (error, response) {
                if (error) {
                    return cb(error);
                }

                if (response.body && response.body.success) {
                    const {hash, path} = response.body;

                    return cb(null, {hash, path});
                }
                else {
                    return cb(messages.IPFS_UPLOAD_FAIL);
                }
            },
        );
    });
};

Attributes.buildTransaction = function (params, cb) {

    let req = params.req;
    let keypair = params.keypair;
    let transactionType = params.transactionType;

    modules.accounts.getAccount({publicKey: req.body.publicKey}, function (err, requester) {
        if (err) {
            return cb(err);
        }
        if (!requester) {
            return cb('Requester not found');
        }

        if (req.body.multisigAccountPublicKey && req.body.multisigAccountPublicKey !== keypair.publicKey.toString('hex')) {
            // TODO
        } else {
            modules.accounts.setAccountAndGet({publicKey: req.body.publicKey}, function (err, account) {
                if (err) {
                    return cb(err);
                }

                if (!account || !account.publicKey) {
                    return cb('Account not found');
                }
                if (account.secondSignature && !req.body.secondSecret) {
                    return cb('Missing second passphrase');
                }
                let secondKeypair = null;
                if (account.secondSignature) {
                    secondKeypair = library.crypto.makeKeypair(req.body.secondSecret);
                }
                let transaction;
                try {
                    transaction = library.logic.transaction.create({
                        type: transactionType,
                        amount: req.body.amount,
                        recipientId: req.body.recipientId,
                        requester: requester,
                        sender: account,
                        asset: req.body.asset,
                        keypair: keypair,
                        secondKeypair: secondKeypair,
                        signature: req.body.signature,
                        timestamp: req.body.timestamp
                    });
                    transaction.id = library.logic.transaction.getId(transaction);
                    if (req.body.asset) {
                        transaction.asset = req.body.asset;
                    }

                } catch (e) {
                    return cb(e.toString());
                }

                library.bus.message("transactionsReceived", [transaction], "api", function (err, transactions) {
                    if (err) {
                        return cb(err, transaction);
                    }
                    return cb(null, {transactionId: transactions[0].id});
                });

            });
        }
    });
};


shared.listAttributeTypes = function (req, cb) {

    library.schema.validate(req.body, schema.listAttributeTypes, function (err) {
        if (err) {
            return cb(err[0].message);
        }
        __private.listAttributeTypes({}, function (err, data) {
            if (err) {
                return cb(messages.ATTRIBUTE_TYPES_LIST_FAIL);
            }
            return cb(null, {attribute_types: data.attribute_types, count: data.count});
        });
    });
};

Attributes.listAttributeTypes = function (req, cb) {

    __private.listAttributeTypes({}, function (err, data) {
        if (err) {
            return cb(messages.ATTRIBUTE_TYPES_LIST_FAIL);
        }
        return cb(null, {attribute_types: data.attribute_types, count: data.count});
    });
};

// not exposed as API

shared.createAttributeType = function (req, cb) {
    library.schema.validate(req.body, schema.createAttributeType, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.createAttributeType(req.body, function (err, data) {
            if (err) {
                return cb(messages.ATTRIBUTE_TYPE_CREATE_FAIL);
            }
            return cb(null, {attribute_type: data.attribute_type});
        });
    });
};

shared.getAttributeType = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeType, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        Attributes.getAttributeType(req.body, function (err, data) {
            if (err) {
                return cb(err);
            }

            return cb(null, {attribute_type: data.attribute_type});
        });
    });
};

shared.getAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.getAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }
        Attributes.getAttributesByFilter(req.body, function (err, data) {
            if (err) {
                return cb(messages.ATTRIBUTE_GET_FAIL);
            }

            if (data.count === 0) {
                return cb(null, {attributes: [], count: 0});
            }

            let resultData = {attributes: data.attributes};
            if (data.count > 0) {
                resultData.count = data.count;
            }
            return cb(null, resultData);
        });
    });
};

shared.addAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }
        if (!req.body.asset || !req.body.asset.attribute) {
            return cb('Attribute is not provided. Nothing to create');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.attribute[0].owner)) {
            return cb(messages.INVALID_OWNER_ADDRESS);
        }

        let keypair;

        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb(messages.INVALID_PASSPHRASE);
            }
        }

        let reqGetAttributeType = req;
        const publicKey = req.body.publicKey;

        __private.checkAssociations(req.body, function (err) {

            if (err) {
                return cb(err);
            }
            reqGetAttributeType.body.name = req.body.asset.attribute[0].type;
            Attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
                if (err || !data.attribute_type) {
                    return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
                }

                if (data.attribute_type.options && JSON.parse(data.attribute_type.options).expirable === true) {
                    if (!req.body.asset.attribute[0].expire_timestamp) {
                        return cb(messages.EXPIRE_TIMESTAMP_REQUIRED);
                    }

                    if (req.body.asset.attribute[0].expire_timestamp < slots.getTime()) {
                        return cb(messages.EXPIRE_TIMESTAMP_IN_THE_PAST);
                    }
                }

                const attributeDataType = data.attribute_type.data_type;
                const attributeDataName = data.attribute_type.name;
                const owner = req.body.asset.attribute[0].owner;

                let reqGetAttributesByFilter = req;

                reqGetAttributesByFilter.body.type = attributeDataName;
                reqGetAttributesByFilter.body.owner = owner;

                modules.accounts.getAccount({publicKey}, function (err, requester) {
                    if (err) {
                        return cb(err);
                    }

                    if (!requester) {
                        return cb('Requester not found');
                    }

                    if (req.body.multisigAccountPublicKey && req.body.multisigAccountPublicKey !== keypair.publicKey.toString('hex')) {
                        // TODO
                    } else {
                        modules.accounts.setAccountAndGet({publicKey}, function (err, account) {
                            if (err) {
                                return cb(err);
                            }

                            if (!account || !account.publicKey || !account.address) {
                                return cb(messages.ACCOUNT_NOT_FOUND);
                            }

                            if (account.address !== owner) {
                                return cb(messages.SENDER_IS_NOT_OWNER);
                            }

                            if (account.secondSignature && !req.body.secondSecret) {
                                return cb('Missing second passphrase');
                            }

                            let secondKeypair = null;

                            if (account.secondSignature) {
                                secondKeypair = library.crypto.makeKeypair(req.body.secondSecret);
                            }

                            __private.addAttributeToIpfs(
                                {
                                    attributeDataType: attributeDataType, attributeDataName: attributeDataName,
                                    value: req.body.asset.attribute[0].value, publicKey: publicKey
                                },
                                function (err, hash) {
                                    if (err) {
                                        return cb(err)
                                    }
                                    if (attributedHelper.isIPFSUploadRequired(attributeDataType)) {
                                        // Adjust the transaction asset body to contain the IPFS hash
                                        req.body.asset.attribute[0].value = hash;
                                        req.body.asset.attribute[0].owner = account.address;
                                        req.body.asset.attribute[0].attributeDataType = attributeDataType;
                                    }

                                    let transaction;

                                    try {
                                        transaction = library.logic.transaction.create({
                                            type: transactionTypes.CREATE_ATTRIBUTE,
                                            amount: 0,
                                            requester: requester,
                                            sender: account,
                                            asset: req.body.asset,
                                            keypair: keypair,
                                            secondKeypair: secondKeypair,
                                            signature: req.body.signature
                                        });

                                        transaction.id = library.logic.transaction.getId(transaction);
                                    } catch (e) {
                                        return cb(e.toString());
                                    }

                                    library.bus.message("transactionsReceived", [transaction], "api", function (err, transactions) {
                                        if (err) {
                                            return cb(err, transaction);
                                        }
                                        return cb(null, {transactionId: transactions[0].id});
                                    });
                                });
                        });
                    }
                });
            });
        });
    });
};

shared.updateAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.attributeOperation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.attribute) {
            return cb('Attribute is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.attribute[0].owner)) {
            return cb(messages.INVALID_OWNER_ADDRESS);
        }

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb(messages.INVALID_PASSPHRASE);
            }
        }

        __private.checkAssociations(req.body, function (err) {

            if (err) {
                return cb(err);
            }

            Attributes.getAttributesByFilter({
                owner: req.body.asset.attribute[0].owner,
                id: req.body.asset.attribute[0].attributeId
            }, function (err, data) {
                if (err || !data || data.attributes.length === 0) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND_FOR_UPDATE);
                }

                if ((!req.body.asset.attribute[0].value || req.body.asset.attribute[0].value === data.attributes[0].value) &&
                    (!req.body.asset.attribute[0].expire_timestamp || req.body.asset.attribute[0].expire_timestamp === data.attributes[0].expire_timestamp) &&
                    (!req.body.asset.attribute[0].associations || req.body.asset.attribute[0].associations === data.attributes[0].associations)) {
                    return cb(null, {message: messages.NOTHING_TO_UPDATE});
                }

                Attributes.getAttributeType({name: data.attributes[0].type}, function (err, attributeType) {
                    if (err || !attributeType.attribute_type) {
                        return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
                    }

                    if (attributeType.attribute_type.options && JSON.parse(attributeType.attribute_type.options).expirable === true) {
                        if (!req.body.asset.attribute[0].expire_timestamp) {
                            return cb(messages.EXPIRE_TIMESTAMP_REQUIRED);
                        }

                        if (req.body.asset.attribute[0].expire_timestamp < slots.getTime()) {
                            return cb(messages.EXPIRE_TIMESTAMP_IN_THE_PAST);
                        }
                    }
                    const publicKey = req.body.publicKey;
                    modules.accounts.getAccount({publicKey}, function (err, requester) {
                        if (err) {
                            return cb(err);
                        }

                        if (!requester) {
                            return cb('Requester not found');
                        }

                        if (req.body.multisigAccountPublicKey && req.body.multisigAccountPublicKey !== keypair.publicKey.toString('hex')) {
                            // TODO
                        } else {
                            modules.accounts.setAccountAndGet({publicKey}, function (err, account) {
                                if (err) {
                                    return cb(err);
                                }

                                if (!account || !account.publicKey) {
                                    return cb(messages.ACCOUNT_NOT_FOUND);
                                }

                                if (account.address !== req.body.asset.attribute[0].owner) {
                                    return cb(messages.SENDER_IS_NOT_OWNER);
                                }

                                if (account.secondSignature && !req.body.secondSecret) {
                                    return cb('Missing second passphrase');
                                }

                                let secondKeypair = null;

                                if (account.secondSignature) {
                                    secondKeypair = library.crypto.makeKeypair(req.body.secondSecret);
                                }

                                __private.addAttributeToIpfs(
                                    {
                                        attributeDataType: attributeType.attribute_type.data_type,
                                        attributeDataName: attributeType.name,
                                        value: req.body.asset.attribute[0].value,
                                        publicKey: req.body.publicKey
                                    },
                                    function (err, hash) {
                                        if (err) {
                                            return cb(err)
                                        }
                                        if (attributedHelper.isIPFSUploadRequired(attributeType.attribute_type.data_type)) {
                                            // Adjust the transaction asset body to contain the IPFS hash
                                            req.body.asset.attribute[0].value = hash;
                                            req.body.asset.attribute[0].owner = account.address;
                                            req.body.asset.attribute[0].attributeDataType = attributeType.attribute_type.data_type;
                                        }
                                        Attributes.buildTransaction({
                                                req: req,
                                                keypair: keypair,
                                                transactionType: transactionTypes.UPDATE_ATTRIBUTE
                                            },
                                            function (err, resultData) {
                                                if (err) {
                                                    return cb(err);
                                                }
                                                return cb(null, resultData);
                                            });
                                    });
                            });
                        }
                    });
                });
            });
        });
    });
};

shared.consumeAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.consumeAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.attribute) {
            return cb('Attribute to be shared is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.attribute[0].owner)) {
            return cb(messages.INVALID_OWNER_ADDRESS);
        }

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb(messages.INVALID_PASSPHRASE);
            }
        }

        let reqGetAttributeType = req;
        reqGetAttributeType.body.name = req.body.asset.attribute[0].type;
        Attributes.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.attribute[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.attribute[0].type;

            Attributes.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err) {
                    return cb(err);
                }
                if (!data.attributes || data.attributes.length === 0) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }

                if (data.attributes[0].expire_timestamp && data.attributes[0].expire_timestamp < slots.getTime()) {
                    return cb(messages.EXPIRED_ATTRIBUTE);
                }

                if (!data.attributes[0].active) {
                    return cb(messages.INACTIVE_ATTRIBUTE);
                }

                req.body.asset.attribute_id = data.attributes[0].id;
                req.body.recipientId = constants.REWARD_FAUCET;
                Attributes.buildTransaction({
                        req: req,
                        keypair: keypair,
                        transactionType: transactionTypes.CONSUME_ATTRIBUTE
                    },
                    function (err, resultData) {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null, resultData);
                    });
            });
        });
    });
};

shared.getAttributeConsumptions = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeConsumption, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.type && req.body.owner)) {
            return cb('The attribute (type and owner information) must be provided');
        }

        Attributes.getAttributesByFilter(req.body, function (err, res1) {

            if (res1 && res1.attributes && req.body.type && req.body.owner) {
                req.body.attribute_id = res1.attributes[0].id;
            }

            if (!req.body.attribute_id) {
                return cb(messages.ATTRIBUTE_NOT_FOUND);
            }

            __private.getAttributeConsumptionsByFilter(req.body, function (err, res) {

                if (err) {
                    return cb(err);
                }
                let attributeConsumptions = res.attributeConsumptions ? res.attributeConsumptions : [];
                return cb(null, {attributeConsumptions: attributeConsumptions, count: res.count});
            });
        });
    });
};

shared.getLastRewardRound = function (req, cb) {
    library.schema.validate(req.body, schema.getLastRewardRound, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getLastRewardRound(req.body, function (err, res) {

            if (err) {
                return cb(err);
            }

            return cb(null, {reward: res.reward});
        });

    });
};

shared.runRewardRound = function (req, cb) {
    library.schema.validate(req.body, schema.runRewardRound, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        let transactions = modules.transactionPool.getUnconfirmedTransactionList(true);
        transactions.forEach(i => {
            if (i.type === transactionTypes.RUN_REWARD_ROUND) {
                return cb('A Reward Round is already in progress');
            }
            if (i.type === transactionTypes.UPDATE_REWARD_ROUND_TO_COMPLETE) {
                return cb('An Update Reward Round is in progress. Try again later.');
            }
        });

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb(messages.INVALID_PASSPHRASE);
            }
        }

        let currentTimestamp = slots.getTime();

        __private.getLastRewardRound({}, function (err, res) {
            if (res && res.rewardRound && currentTimestamp - res.rewardRound.timestamp < constants.REWARD_ROUND_INTERVAL) {
                return cb(messages.REWARD_ROUND_TOO_SOON);
            }

            __private.getLastCompletedRewardRound({}, function (err, rescompleted) {

                let startTimestamp = rescompleted && rescompleted.rewardRound && rescompleted.rewardRound.timestamp ? rescompleted.rewardRound.timestamp : 0;

                __private.getAttributeConsumptionsByFilter({
                    before: currentTimestamp,
                    after: startTimestamp
                }, function (err, result) {
                    if (!result.attributeConsumptions) {
                        return cb(messages.NO_CONSUMPTIONS_FOR_REWARD_ROUND);
                    }
                    req.before = currentTimestamp;
                    req.after = startTimestamp;

                    let reqForDistribute = _.cloneDeep(req);

                    let keypair;
                    if (!req.body.signature) {
                        keypair = library.crypto.makeKeypair(req.body.secret);
                    }
                    if (keypair && req.body.publicKey) {
                        if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                            return cb(messages.INVALID_PASSPHRASE);
                        }
                    }

                    __private.distributeRewards(reqForDistribute, function (err, res) {
                        if (err) {
                            return cb(err);
                        }
                        Attributes.buildTransaction({
                                req: req,
                                keypair: keypair,
                                timestamp: currentTimestamp,
                                transactionType: transactionTypes.RUN_REWARD_ROUND
                            },
                            function (err, resultData) {
                                if (err) {
                                    return cb(err);
                                }
                                return cb(null, resultData);
                            });
                    });
                });
            });
        });
    });
};

shared.updateRewardRound = function (req, cb) {
    library.schema.validate(req.body, schema.updateRewardRound, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        let transactions = modules.transactionPool.getUnconfirmedTransactionList(true);
        transactions.forEach(i => {
            if (i.type === transactionTypes.RUN_REWARD_ROUND) {
                return cb('Reward Round already in progress');
            }
            if (i.type === transactionTypes.UPDATE_REWARD_ROUND_TO_COMPLETE) {
                return cb('Update Reward Round already in progress');
            }
        });

        let keypair;
        if (!req.body.signature) {
            keypair = library.crypto.makeKeypair(req.body.secret);
        }
        if (keypair && req.body.publicKey) {
            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                return cb(messages.INVALID_PASSPHRASE);
            }
        }

        let currentTimestamp = slots.getTime();

        __private.getLastRewardRound({}, function (err, res) {
            if (res && res.rewardRound && currentTimestamp - res.rewardRound.timestamp < constants.REWARD_ROUND_INTERVAL) {
                return cb(messages.REWARD_ROUND_TOO_SOON);
            }

            if (res && res.rewardRound && res.rewardRound.status === 'COMPLETE') {
                return cb(null, {message: messages.REWARD_ROUND_WITH_NO_UPDATE});
            }

            __private.getLastCompletedRewardRound({}, function (err, res) {

                let lastRewardRoundTimestamp = res && res.rewardRound && res.rewardRound.timestamp ? res.rewardRound.timestamp : 0;

                __private.getUnrewardedConsumptionCalculation({
                    before: lastRewardRoundTimestamp,
                    after: 0
                }, function (err, result) {
                    if (!result.unrewardedAttributeConsumptions || result.unrewardedAttributeConsumptions.length === 0) {

                        let keypair;
                        if (!req.body.signature) {
                            keypair = library.crypto.makeKeypair(req.body.secret);
                        }
                        if (keypair && req.body.publicKey) {
                            if (keypair.publicKey.toString('hex') !== req.body.publicKey) {
                                return cb(messages.INVALID_PASSPHRASE);
                            }

                        }
                        Attributes.buildTransaction({
                                req: req,
                                keypair: keypair,
                                timestamp: currentTimestamp,
                                transactionType: transactionTypes.UPDATE_REWARD_ROUND_TO_COMPLETE
                            },
                            function (err, result) {
                                if (err) {
                                    return cb(err);
                                }
                                return cb(null, result);
                            });
                    }
                });
            });
        });
    });
};

// Export
module.exports = Attributes;
