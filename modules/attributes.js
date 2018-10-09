'use strict';

let Router = require('../helpers/router.js');
let OrderBy = require('../helpers/orderBy.js');
let schema = require('../schema/attributes.js');
let slots = require('../helpers/slots.js');
let sql = require('../sql/attributes.js');
let attributedHelper = require('../helpers/attributes.js');
let transactionTypes = require('../helpers/transactionTypes.js');
let messages = require('../helpers/messages.js');
let async = require('async');
let constants = require('../helpers/constants.js');
let _ = require('lodash')

// Private fields
let modules, library, self, __private = {}, shared = {};

__private.assetTypes = {};

// Constructor
function Attributes(cb, scope) {
    library = scope;
    self = this;

    let Attribute = require('../logic/attribute.js');
    __private.assetTypes[transactionTypes.CREATE_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.CREATE_ATTRIBUTE, new Attribute()
    );

    let AttributeValidationRequest = require('../logic/attributeValidationRequest.js');
    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_VALIDATION] = library.logic.transaction.attachAssetType(
        transactionTypes.REQUEST_ATTRIBUTE_VALIDATION, new AttributeValidationRequest()
    );

    let AttributeValidation = require('../logic/attributeValidation.js');
    __private.assetTypes[transactionTypes.VALIDATE_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.VALIDATE_ATTRIBUTE, new AttributeValidation()
    );

    let AttributeShareRequest = require('../logic/attributeShareRequest.js');
    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_SHARE] = library.logic.transaction.attachAssetType(
        transactionTypes.REQUEST_ATTRIBUTE_SHARE, new AttributeShareRequest()
    );

    let AttributeShare = require('../logic/attributeShare.js');
    __private.assetTypes[transactionTypes.SHARE_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.SHARE_ATTRIBUTE, new AttributeShare()
    );

    let AttributeShareApprove = require('../logic/attributeShareApprove.js');
    __private.assetTypes[transactionTypes.APPROVE_ATTRIBUTE_SHARE] = library.logic.transaction.attachAssetType(
        transactionTypes.APPROVE_ATTRIBUTE_SHARE, new AttributeShareApprove()
    );

    let AttributeConsume = require('../logic/attributeConsume.js');
    __private.assetTypes[transactionTypes.CONSUME_ATTRIBUTE] = library.logic.transaction.attachAssetType(
        transactionTypes.CONSUME_ATTRIBUTE, new AttributeConsume()
    );

    let AttributeActivate = require('../logic/attributeActivation.js');
    __private.assetTypes[transactionTypes.ATTRIBUTE_ACTIVATION] = library.logic.transaction.attachAssetType(
        transactionTypes.ATTRIBUTE_ACTIVATION, new AttributeActivate()
    );

    let RewardRound = require('../logic/rewardRound.js');
    __private.assetTypes[transactionTypes.RUN_REWARD_ROUND] = library.logic.transaction.attachAssetType(
        transactionTypes.RUN_REWARD_ROUND, new RewardRound()
    );

    let Reward = require('../logic/reward.js');
    __private.assetTypes[transactionTypes.REWARD] = library.logic.transaction.attachAssetType(
        transactionTypes.REWARD, new Reward()
    );

    let UpdateRewardRound = require('../logic/updateRewardRound.js');
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

    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_VALIDATION].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.VALIDATE_ATTRIBUTE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.REQUEST_ATTRIBUTE_SHARE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.SHARE_ATTRIBUTE].bind({
        modules: modules, library: library
    });

    __private.assetTypes[transactionTypes.APPROVE_ATTRIBUTE_SHARE].bind({
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

    __private.assetTypes[transactionTypes.ATTRIBUTE_ACTIVATION].bind({
        modules: modules, library: library
    });

};

Attributes.prototype.verify = function (req, cb) {
    // dummy verification
    return cb(null, '');
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
        'get /list': 'listAttributes',
        'get /': 'getAttribute',
        'get /types/list': 'listAttributeTypes',
        'get /types': 'getAttributeType',

        'post /validationrequest': 'requestAttributeValidation',
        'get /validationrequest': 'getAttributeValidationRequests',
        'get /validationrequest/completed': 'getCompletedAttributeValidationRequests',
        'get /validationrequest/incomplete': 'getIncompleteAttributeValidationRequests',

        'post /validation': 'validateAttribute',
        'get /validation': 'getAttributeValidations',

        'post /sharerequest': 'requestAttributeShare',
        'get /sharerequest': 'getRequestAttributeShare',

        'post /approvesharerequest': 'approveShareAttribute',

        'get /share': 'getShareAttribute',
        'post /share': 'shareAttribute',

        'post /consume': 'consumeAttribute',
        'get /consume': 'getAttributeConsumptions',

        'post /runrewardround': 'runRewardRound',
        'post /updaterewardround': 'updateRewardRound',

        'get /validationscore': 'getAttributeValidationScore',
        'post /activate': 'activateAttribute'
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


__private.getAttributesByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.type) {
        where.push('"type" = ${type}');
        params.type = filter.type;
    }

    if (filter.owner) {
        where.push('"owner" = ${owner}');
        params.owner = filter.owner;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributesSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'owner', 'type'].indexOf(sortField) > -1) {
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


    library.db.query(sql.AttributesSql.getAttributesFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributes = [];

        for (let i = 0; i < rows.length; i++) {
            attributes.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        data.attributes = attributes;
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    });
};

__private.getAttributeValidationRequestsByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.validator) {
        where.push('"validator" = ${validator}');
        params.validator = filter.validator;
    }

    if (filter.attribute_id) {
        where.push('"attribute_id" = ${attribute_id}');
        params.attribute_id = filter.attribute_id;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributeValidationRequestsSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'attribute_id', 'validator'].indexOf(sortField) > -1) {
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


    library.db.query(sql.AttributeValidationRequestsSql.getAttributeValidationRequestsFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributeValidationRequests = [];

        for (let i = 0; i < rows.length; i++) {
            attributeValidationRequests.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeValidationRequests = attributeValidationRequests;
        }
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    });
};

__private.getAttributeShareRequestsByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.applicant) {
        where.push('"applicant" = ${applicant}');
        params.applicant = filter.applicant;
    }

    if (filter.attribute_id) {
        where.push('"attribute_id" = ${attribute_id}');
        params.attribute_id = filter.attribute_id;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributeShareRequestsSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'attribute_id', 'applicant'].indexOf(sortField) > -1) {
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


    library.db.query(sql.AttributeShareRequestsSql.getAttributeShareRequestsFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributeShareRequests = [];

        for (let i = 0; i < rows.length; i++) {
            attributeShareRequests.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeShareRequests = attributeShareRequests;
        }
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    });
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

__private.getAttributeSharesByFilter = function (filter, cb) {
    let params = {}, where = [];

    if (filter.id >= 0) {
        where.push('"id" = ${id}');
        params.id = filter.id;
    }

    if (filter.applicant) {
        where.push('"applicant" = ${applicant}');
        params.applicant = filter.applicant;
    }

    if (filter.attribute_id) {
        where.push('"attribute_id" = ${attribute_id}');
        params.attribute_id = filter.attribute_id;
    }

    let orderBy = OrderBy(
        filter.orderBy, {
            sortFields: sql.AttributeSharesSql.sortFields,
            fieldPrefix: function (sortField) {
                if (['id', 'attribute_id', 'applicant'].indexOf(sortField) > -1) {
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

    library.db.query(sql.AttributeSharesSql.getAttributeSharesFiltered({
        where: where,
    }), params).then(function (rows) {
        let attributeShares = [];

        for (let i = 0; i < rows.length; i++) {
            attributeShares.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeShares = attributeShares;
        }
        data.count = count;
        return cb(null, data);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
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

__private.getAttributeType = function (filter, cb) {

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

__private.getAttributeValidationRequests = function (filter, cb) {

    library.db.query(sql.AttributeValidationRequestsSql.getAttributeValidationsRequestsForAttributeAndValidator,
        {attribute_id: filter.attribute_id, validator: filter.validator}).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data = rows;
            return cb(null, data);
        }

        return cb(null, null);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getAttributeValidationScore = function (filter, cb) {

    library.db.query(sql.AttributeValidationsSql.getAttributeValidationsForAttribute,
        {attribute_id: filter.attribute_id}).then(function (rows) {

        let attributeValidationScore = {};
        let score = 0;
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                score += rows[i].chunk;
            }

        }
        attributeValidationScore.score = score;
        return cb(null, attributeValidationScore);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getAttributeShareRequests = function (filter, cb) {

    library.db.query(sql.AttributeShareRequestsSql.getAttributeShareRequestsForAttributeAndApplicant,
        {attribute_id: filter.attribute_id, applicant: filter.applicant}).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data = rows;
            return cb(null, data);
        }

        return cb(null, null);
    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getAttributeValidationRequestsByQuery = function (filter, cb) {

    let param = {validator: '', type: '', owner: ''};
    if (filter.validator) {
        param.validator = filter.validator;
    } else {
        param.type = filter.type;
        param.owner = filter.owner;
    }

    library.db.query(filter.query,
        param).then(function (rows) {
        let attributeValidationRequests = [];
        for (let i = 0; i < rows.length; i++) {
            attributeValidationRequests.push(rows[i]);
        }
        let count = rows.length ? rows.length : 0;
        let data = {};
        if (count > 0) {
            data.attributeValidationRequests = attributeValidationRequests;
        }
        data.count = count;
        return cb(null, data);

    }).catch(function (err) {
        library.logger.error("stack", err.stack);
        return cb(err.message);
    })
};

__private.getAttributeValidationsForRequests = function (filter, cb) {

    library.db.query(sql.AttributeValidationsSql.getAttributeValidationForRequest,
        {requestIds: filter.requestIds}).then(function (rows) {

        let data = {};
        if (rows.length > 0) {
            data.count = rows.length;
            data.attribute_validations = rows;
            return cb(null, data);
        }

        return cb(null, null);
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
        {before: before, after: after})
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
                    })
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
            return __private.buildTransaction({
                    req: req,
                    keypair: keypair,
                    transactionType: transactionTypes.REWARD
                },
                cb);
        }, function (err) {
            console.log(err);
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

__private.addAttributeToIpfs = function (files, cb) {
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
                if (error) return cb(error);

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

__private.buildTransaction = function (params, cb) {

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

// Public methods (APIs)

shared.listAttributes = function (req, cb) {
    library.schema.validate(req.body, schema.listAttributes, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getAttributesByFilter(req.body, function (err, data) {
            if (err) {
                return cb(messages.ATTRIBUTES_LIST_FAIL);
            }

            return cb(null, {attributes: data.attributes, count: data.count});
        });
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

        __private.getAttributeType(req.body, function (err, data) {
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
        __private.getAttributesByFilter(req.body, function (err, data) {
            if (err) {
                return cb(messages.ATTRIBUTE_GET_FAIL);
            }

            if (data.count === 0) {
                return cb(null, {attributes : [], count : 0});
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
    library.schema.validate(req.body, schema.addAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }
        if (!req.body.asset || !req.body.asset.attribute) {
            return cb('Attribute is not provided. Nothing to create');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.attribute[0].owner)) {
            return cb('Owner address is incorrect');
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

        reqGetAttributeType.body.name = req.body.asset.attribute[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            const attributeDataType = data.attribute_type.data_type;
            const attributeDataName = data.attribute_type.name;
            const owner = req.body.asset.attribute[0].owner;

            let reqGetAttributesByFilter = req;

            reqGetAttributesByFilter.body.type = attributeDataName;
            reqGetAttributesByFilter.body.owner = owner;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err) {
                    return cb(err);
                }

                if (data.attributes && data.attributes.length > 0) {
                    return cb(messages.ATTRIBUTE_ALREADY_EXISTS);
                }

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

                            if (account.secondSignature && !req.body.secondSecret) {
                                return cb('Missing second passphrase');
                            }

                            let secondKeypair = null;

                            if (account.secondSignature) {
                                secondKeypair = library.crypto.makeKeypair(req.body.secondSecret);
                            }

                            /**
                             * Check if the desired attribute needs to be uploaded to IPFS; if so, add it to the
                             * IPFS network, and on the IPFS pin queue. Once the newly created transaction is forged,
                             * we'll need to remove the associated element from the IPFS pin queue
                             * */
                            async.auto({
                                isIPFSUploadRequired: function (callback) {
                                    const result = attributedHelper.isIPFSUploadRequired(attributeDataType);

                                    callback(null, result);
                                },
                                uploadToIpfs: ['isIPFSUploadRequired', function (results, callback) {
                                    const isIPFSUploadRequired = results.isIPFSUploadRequired;

                                    if (isIPFSUploadRequired) {
                                        const files = {
                                            path: `${attributeDataName}-${publicKey}`,
                                            content: req.body.asset.attribute[0].value,
                                        };

                                        __private.addAttributeToIpfs(files, function (err, res) {
                                            if (err) return callback(error, null);

                                            const {hash} = res;

                                            // Adjust the transaction asset body to contain the IPFS hash
                                            req.body.asset.attribute[0].value = hash;
                                            req.body.asset.attribute[0].owner = account.address;
                                            req.body.asset.attribute[0].attributeDataType = attributeDataType;

                                            return callback(null, {hash});
                                        });
                                    }
                                    else {
                                        callback(null, 'No Upload Required');
                                    }
                                }],
                            }, function (err) {
                                if (err) {
                                    return cb(err)

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

shared.requestAttributeValidation = function (req, cb) {
    library.schema.validate(req.body, schema.requestAttributeValidation, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.validation) {
            return cb('Validation is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.validation[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.validation[0].validator)) {
            return cb('Validator address is incorrect');
        }

        if (req.body.asset.validation[0].owner === req.body.asset.validation[0].validator) {
            return cb(messages.OWNER_IS_VALIDATOR_ERROR);
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
        reqGetAttributeType.body.name = req.body.asset.validation[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.validation[0].owner;
            reqGetAttributesByFilter.body.type = data.attribute_type.name;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err) {
                    return cb(err);
                }

                if (!data.attributes || data.attributes.length === 0) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }
                req.body.asset.validation[0].attribute_id = data.attributes[0].id;
                req.body.validator = req.body.asset.validation[0].validator;
                req.body.attribute_id = data.attributes[0].id;

                __private.getAttributeValidationRequests(req.body, function (err, attributeValidationRequests) {

                    if (err) {
                        return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
                    }

                    if (attributeValidationRequests) {
                        return cb(messages.VALIDATOR_ALREADY_HAS_VALIDATION_REQUEST);
                    }
                    __private.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.REQUEST_ATTRIBUTE_VALIDATION
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
};

shared.requestAttributeShare = function (req, cb) {
    library.schema.validate(req.body, schema.requestAttributeShare, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.share) {
            return cb('Share information is not provided');
        }
        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].applicant)) {
            return cb('Applicant address is incorrect');
        }


        if (req.body.asset.share[0].owner === req.body.asset.share[0].applicant) {
            return cb(messages.OWNER_IS_APPLICANT_ERROR);
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
        reqGetAttributeType.body.name = req.body.asset.share[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.share[0].owner;
            reqGetAttributesByFilter.body.type = data.attribute_type.name;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err) {
                    return cb(err);
                }
                if (!data.attributes || data.attributes.length === 0) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }
                req.body.asset.share[0].attribute_id = data.attributes[0].id;
                req.body.applicant = req.body.asset.share[0].applicant;
                req.body.attribute_id = data.attributes[0].id;

                __private.getAttributeShareRequests(req.body, function (err, attributeShareRequests) {

                    if (err || attributeShareRequests) {
                        return cb(messages.ATTRIBUTE_SHARE_REQUEST_ALREADY_EXISTS);
                    }

                    __private.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.REQUEST_ATTRIBUTE_SHARE
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
};

shared.validateAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.validateAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.validation) {
            return cb('Validation is not provided.');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.validation[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.validation[0].validator)) {
            return cb('Validator address is incorrect');
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
        reqGetAttributeType.body.name = req.body.asset.validation[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.validation[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.validation[0].type;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb('Cannot create validation request : ' + messages.ATTRIBUTE_NOT_FOUND);
                }
                req.body.attribute_id = data.attributes[0].id;
                req.body.validator = req.body.asset.validation[0].validator;

                __private.getAttributeValidationRequests(req.body, function (err, attributeValidationRequests) {

                    if (err || !attributeValidationRequests) {
                        return cb(messages.VALIDATOR_HAS_NO_VALIDATION_REQUEST);
                    }
                    req.body.asset.attributeValidationRequestId = attributeValidationRequests[0].id;

                    let ids = [];
                    attributeValidationRequests.forEach(i => ids.push(i.id));
                    req.body.requestIds = ids;

                    __private.getAttributeValidationsForRequests(req.body, function (err, attributeValidations) {

                        if (err || attributeValidations) {
                            return cb(messages.ATTRIBUTE_VALIDATION_ALREADY_MADE);
                        }

                        __private.buildTransaction({
                                req: req,
                                keypair: keypair,
                                transactionType: transactionTypes.VALIDATE_ATTRIBUTE
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

shared.approveShareAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.approveShareAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.share) {
            return cb('Share is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].applicant)) {
            return cb('Applicant address is incorrect');
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
        reqGetAttributeType.body.name = req.body.asset.share[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.share[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.share[0].type;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb('Cannot approve share attribute request : ' + messages.ATTRIBUTE_NOT_FOUND);
                }
                req.body.attribute_id = data.attributes[0].id;
                req.body.applicant = req.body.asset.share[0].applicant;

                __private.getAttributeShareRequests(req.body, function (err, attributeShareRequests) {

                    if (err || !attributeShareRequests) {
                        return cb(messages.ATTRIBUTE_APPROVAL_SHARE_WITH_NO_SHARE_REQUEST);
                    }

                    if (req.body.asset.share[0].action && attributeShareRequests[0].status === constants.shareStatus.APPROVED) {
                        return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_APPROVED);
                    }

                    if (req.body.asset.share[0].action && attributeShareRequests[0].status === constants.shareStatus.COMPLETED) {
                        return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_COMPLETED);
                    }

                    if (!req.body.asset.share[0].action && attributeShareRequests[0].status === constants.shareStatus.UNAPPROVED) {
                        return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_UNAPPROVED);
                    }

                    req.body.asset.attributeShareRequestId = attributeShareRequests[0].id;

                    __private.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.APPROVE_ATTRIBUTE_SHARE
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
};

shared.shareAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.shareAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.share) {
            return cb('Share is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].owner)) {
            return cb('Owner address is incorrect');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.share[0].applicant)) {
            return cb('Applicant address is incorrect');
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
        reqGetAttributeType.body.name = req.body.asset.share[0].type;
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.share[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.share[0].type;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err || !data.attributes) {
                    return cb('Cannot share attribute : ' + messages.ATTRIBUTE_NOT_FOUND);
                }
                req.body.attribute_id = data.attributes[0].id;
                req.body.applicant = req.body.asset.share[0].applicant;

                req.body.asset.attribute_id = data.attributes[0].id;

                __private.getAttributeShareRequests(req.body, function (err, attributeShareRequests) {

                    if (err || !attributeShareRequests) {
                        return cb(messages.ATTRIBUTE_SHARE_WITH_NO_SHARE_REQUEST);
                    }

                    if (attributeShareRequests[0].status === 0) {
                        return cb(messages.ATTRIBUTE_SHARE_WITH_NO_APPROVED_SHARE_REQUEST);
                    }

                    if (attributeShareRequests[0].status === 2) {
                        return cb(messages.ATTRIBUTE_APPROVAL_SHARE_ALREADY_COMPLETED);
                    }

                    req.body.asset.attributeShareRequestId = attributeShareRequests[0].id;

                    __private.buildTransaction({
                            req: req,
                            keypair: keypair,
                            transactionType: transactionTypes.SHARE_ATTRIBUTE
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
            return cb('Owner address is incorrect');
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
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.attribute[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.attribute[0].type;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err) {
                    return cb(err);
                }
                if (!data.attributes || data.attributes.length === 0) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }

                req.body.asset.attribute_id = data.attributes[0].id;
                req.body.recipientId = constants.REWARD_FAUCET;

                __private.buildTransaction({
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


shared.activateAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.activateAttribute, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!req.body.asset || !req.body.asset.attribute) {
            return cb('Attribute to be activated is not provided');
        }

        if (!library.logic.transaction.validateAddress(req.body.asset.attribute[0].owner)) {
            return cb('Owner address is incorrect');
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
        __private.getAttributeType(reqGetAttributeType.body, function (err, data) {
            if (err || !data.attribute_type) {
                return cb(messages.ATTRIBUTE_TYPE_NOT_FOUND);
            }
            let reqGetAttributesByFilter = req;
            reqGetAttributesByFilter.body.owner = req.body.asset.attribute[0].owner;
            reqGetAttributesByFilter.body.type = req.body.asset.attribute[0].type;

            __private.getAttributesByFilter(reqGetAttributesByFilter.body, function (err, data) {
                if (err) {
                    return cb(err);
                }
                if (!data.attributes || data.attributes.length === 0) {
                    return cb(messages.ATTRIBUTE_NOT_FOUND);
                }
                req.body.asset.attribute_id = data.attributes[0].id;

                __private.getAttributeValidationScore({
                        attribute_id: data.attributes[0].id
                    },
                    function (err, res) {

                        if (res.score < constants.VALIDATIONS_REQUIRED) {
                            return cb(messages.VALIDATION_SCORE_IS_TOO_LOW);
                        }

                        __private.buildTransaction({
                                req: req,
                                keypair: keypair,
                                transactionType: transactionTypes.ATTRIBUTE_ACTIVATION
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
};

shared.getRequestAttributeShare = function (req, cb) {
    library.schema.validate(req.body, schema.getRequestAttributeShare, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.applicant || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_SHARE_PARAMETERS);
        }

        __private.getAttributesByFilter(req.body, function (err, res1) {

            if (res1 && res1.attributes && req.body.type && req.body.owner) {
                req.body.attribute_id = res1.attributes[0].id;
            }

            if (res1 && !res1.attributes && req.body.type && req.body.owner) {
                return cb(messages.ATTRIBUTE_NOT_FOUND)
            }

            __private.getAttributeShareRequestsByFilter(req.body, function (err, res) {

                if (err || res.count === 0) {
                    return cb(messages.ATTRIBUTE_SHARE_REQUESTS_NOT_FOUND);
                }

                let resultData = {attribute_share_requests: res.attributeShareRequests, count: res.count};

                return cb(null, resultData);
            });
        });
    });
};

shared.getShareAttribute = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeShare, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.applicant || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_SHARE_PARAMETERS);
        }

        __private.getAttributesByFilter(req.body, function (err, res1) {

            if (res1 && res1.attributes && req.body.type && req.body.owner) {
                req.body.attribute_id = res1.attributes[0].id;
            }

            if (res1 && !res1.attributes && req.body.type && req.body.owner) {
                return cb(messages.ATTRIBUTE_NOT_FOUND)
            }

            __private.getAttributeSharesByFilter(req.body, function (err, res) {
                if (err || res.count === 0) {
                    return cb(messages.ATTRIBUTE_SHARES_NOT_FOUND);
                }

                let resultData = {attribute_shares: res.attributeShares, count: res.count};

                return cb(null, resultData);
            });
        });
    });
};

shared.getCompletedAttributeValidationRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getCompletedAttributeValidationRequests, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
        }

        req.body.query = sql.AttributeValidationRequestsSql.getCompletedAttributeValidationRequests;

        __private.getAttributeValidationRequestsByQuery(req.body, function (err, res) {
            if (err) {
                return cb(messages.ATTRIBUTE_VALIDATION_REQUESTS_FAIL);
            }

            if (res.count === 0) {
                return cb(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
            }

            let resultData = {attribute_validation_requests: res.attributeValidationRequests, count: res.count};

            return cb(null, resultData);
        });

    });
};

shared.getIncompleteAttributeValidationRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getIncompleteAttributeValidationRequests, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
        }

        req.body.query = sql.AttributeValidationRequestsSql.getIncompleteAttributeValidationRequests;

        __private.getAttributeValidationRequestsByQuery(req.body, function (err, res) {
            if (err) {
                return cb(messages.ATTRIBUTE_VALIDATION_REQUESTS_FAIL);
            }

            if (res.count === 0) {
                return cb(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
            }

            let resultData = {attribute_validation_requests: res.attributeValidationRequests, count: res.count};

            return cb(null, resultData);
        });
    });
};

shared.getAttributeValidationRequests = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeValidationRequests, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
        }

        req.body.query = sql.AttributeValidationRequestsSql.getAttributeValidationRequests;

        __private.getAttributeValidationRequestsByQuery(req.body, function (err, res) {
            if (err) {
                return cb(messages.ATTRIBUTE_VALIDATION_REQUESTS_FAIL);
            }

            if (res.count === 0) {
                return cb(messages.NO_ATTRIBUTE_VALIDATION_REQUESTS);
            }

            let resultData = {attribute_validation_requests: res.attributeValidationRequests, count: res.count};

            return cb(null, resultData);
        });
    });
};

shared.getAttributeValidations = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeValidations, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        if (!(req.body.validator || (req.body.type && req.body.owner))) {
            return cb(messages.INCORRECT_VALIDATION_PARAMETERS);
        }

        __private.getAttributesByFilter(req.body, function (err, res1) {

            if (res1 && (!res1.attributes || res1.attributes.length === 0)) {
                return cb(messages.ATTRIBUTE_NOT_FOUND)
            }

            if (res1 && res1.attributes && req.body.type && req.body.owner) {
                req.body.attribute_id = res1.attributes[0].id; // here
            }

            __private.getAttributeValidationRequestsByFilter(req.body, function (err, res) {

                if (!res.attributeValidationRequests || res.attributeValidationRequests.length === 0) {
                    return cb(messages.NO_ATTRIBUTE_VALIDATIONS_OR_REQUESTS);
                }

                let ids = [];
                res.attributeValidationRequests.forEach(i => ids.push(i.id));
                req.body.requestIds = ids;

                __private.getAttributeValidationsForRequests(req.body, function (err, res) {
                    if (!res) {
                        return cb(messages.NO_ATTRIBUTE_VALIDATIONS);
                    }

                    let resultData = {attribute_validations: res.attribute_validations, count: res.count};

                    return cb(null, resultData);
                });
            });
        });
    });
};


shared.getAttributeValidationScore = function (req, cb) {
    library.schema.validate(req.body, schema.getAttributeValidationScore, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        __private.getAttributesByFilter(req.body, function (err, result) {

            if (!result || result.attributes.length === 0) {
                return cb(messages.ATTRIBUTE_NOT_FOUND);
            }

            req.body.attribute_id = result.attributes[0].id;

            __private.getAttributeValidationScore(req.body, function (err, res) {
                if (!res) {
                    return cb(messages.NO_ATTRIBUTE_VALIDATIONS)
                }

                return cb(null, {attribute_validation_score: res.score});
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

        __private.getAttributesByFilter(req.body, function (err, res1) {

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
                        __private.buildTransaction({
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
                        __private.buildTransaction({
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


Attributes.prototype.getAttributeValidationScore = function (filter, cb) {
    return __private.getAttributeValidationScore(filter, cb);
};

// Export
module.exports = Attributes;
