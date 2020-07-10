const { SUB_KEYS } = require('../utils');

const newLink = {
    subscribe: (_parent, _args, context, _info) => context.pubsub.asyncIterator(SUB_KEYS.NEW_LINK),
};

const newVote = {
    subscribe: (_parent, _args, context, _info) => context.pubsub.asyncIterator(SUB_KEYS.NEW_VOTE),
};

module.exports = { newLink , newVote };
