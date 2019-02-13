'use strict';

module.exports = {
	activeDelegates: 51,
	maximumVotes: 1,
	addressLength: 208,
	blockHeaderLength: 248,
	confirmationLength: 77,
	epochTime: new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0)),
	fees:{
		send: 10000000,
		vote: 100000000,
		secondsignature: 500000000,
		delegate: 2500000000,
		multisignature: 500000000,
		register: 10000000,
		verify: 10000000,
		createattribute: 4,
		updateattribute: 3,
		attributevalidationrequest: 2,
        attributevalidationrequestapprove: 1,
        attributevalidationrequestdecline: 1,
        attributevalidationrequestnotarize: 1,
        attributevalidationrequestreject: 1,
        attributevalidationrequestcancel: 1,
		attributeshare: 1,
		attributeshareapproval: 1,
		attributeconsume: 1,
		reward:1,
		startrewardround:1,
		updaterewardround:1,
		createservice:1,
        inactivateservice:1,
        identityuserequest : 1,
        identityuserequestapprove : 1,
        identityuserequestdecline : 1,
        identityuserequestend : 1,
        identityuserequestcancel : 1,
	},
	feeStart: 1,
	feeStartVolume: 10000 * 100000000,
	fixedPoint : Math.pow(10, 8),
	forgingTimeOut: 3060, // 102 blocks / 2 rounds
	maxAddressesLength: 208 * 128,
	maxAmount: 100000000,
	maxClientConnections: 100,
	maxConfirmations : 77 * 100,
	maxPayloadLength: 2 * 1024 * 1024,
	maxRequests: 10000 * 12,
	maxSignaturesLength: 196 * 256,
	maxTxsPerBlock: 50,
	blocktime: 8,
	numberLength: 100000000,
	requestLength: 104,
	rewards: {
		milestones: [
			800000000, // Initial Reward
			400000000, // Milestone 1
			200000000, // Milestone 2
			100000000  // Milestone 3
		],
		offset: 100,   // Start rewards at block, ie 7 days after net start
		distance: 7889400, // Distance between each milestone - 7889400 = 2 years
	},
	signatureLength: 196,
	totalAmount: 6677610400000000,
    startBlockHeightForRewardSplitting: 3000000,
    unconfirmedTransactionTimeOut: 10800, // 1080 blocks,

	// business related constants
	MONTHS_FOR_ACTIVE_VALIDATION : 12, // The number of months for which a validation remains active ( is taken into consideration when determining the status of the attribute )
    FIRST_NOTARIZATION_BATCH_SIZE : 7, // The size of the validation "batch" considered for determining the active/inactive status of an attribute if no 3 notarizations in a row can be obtained
    MIN_NOTARIZATIONS_IN_A_ROW : 3, // The number of notarizations in a row that "delete" existing red flags
    MIN_RED_FLAGS_IN_A_ROW_FOR_REJECTED : 3, // The maximum number of red flags (REJECTED validations with no subsequent COMPLETED validations) for the attribute to not immediately be rejected
	REWARD_FAUCET : 'LMs6hQAcRYmQk4vGHgE2PndcXWZxc2Du3w',
    REWARD_FAUCET_KEY : '025dfd3954bf009a65092cfd3f0ba718d0eb2491dd62c296a1fff6de8ccd4afed6',
    REWARD_ROUND_INTERVAL : 1, // TBD 1 hour in milliseconds

    shareStatus : {
        UNAPPROVED : 0,
        APPROVED : 1,
        COMPLETED : 2
    },
    validationRequestStatus : {
        PENDING_APPROVAL : 'PENDING_APPROVAL',
        IN_PROGRESS : 'IN_PROGRESS',
        DECLINED : 'DECLINED',
        COMPLETED : 'COMPLETED',
        REJECTED: 'REJECTED',
        CANCELED : 'CANCELED'
    },
    validationRequestActions : {
        DECLINE : 'DECLINE',
        APPROVE : 'APPROVE',
        NOTARIZE : 'NOTARIZE',
        REJECT : 'REJECT',
        CANCEL : 'CANCEL'
    },
    validationRequestValidatorActions : {
        DECLINE : 'DECLINE',
        APPROVE : 'APPROVE',
        NOTARIZE : 'NOTARIZE',
        REJECT : 'REJECT',
    },
    validationRequestOwnerActions : {
        CANCEL : 'CANCEL'
    },
    validationType : {
        FACE_TO_FACE : 'FACE_TO_FACE',
        REMOTE : 'REMOTE'
    },
    serviceStatus : {
        ACTIVE : 'ACTIVE',
        INACTIVE : 'INACTIVE'
    },

    identityUseRequestStatus : {
        PENDING_APPROVAL : 'PENDING_APPROVAL',
        ACTIVE : 'ACTIVE',
        DECLINED : 'DECLINED',
        ENDED : 'ENDED',
        CANCELED : 'CANCELED'
    },
    identityUseRequestActions : {
        APPROVE : 'APPROVE',
        DECLINE : 'DECLINE',
        END : 'END',
        CANCEL : 'CANCEL'
    },
    identityUseRequestProviderActions : {
        APPROVE : 'APPROVE',
        DECLINE : 'DECLINE'
    },
    identityUseRequestOwnerActions : {
        END : 'END',
        CANCEL : 'CANCEL'
    },

    enrolmentCreditAddress: 'Thq2jDtsuQLUGNvfYiNwGALQLAbmUupvRB',
};
