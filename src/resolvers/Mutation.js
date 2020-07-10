const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { APP_SECRET, getUserId } = require('../utils')
const { SUB_KEYS } = require('../utils');

async function postLink(_parent, args, context, _info) {
    const userId = getUserId(context);
    const newLink = await context.prisma.link.create({
        data: {
            description: args.description,
            url: args.url,
            postedBy: { connect: { id: userId } },
        },
    });
    context.pubsub.publish(SUB_KEYS.NEW_LINK, { newLink });
    return newLink;
}

async function updateLink(_parent, args, context, _info) {
    const userId = getUserId(context);
    const link = await context.prisma.link.update({
        where: { id: args.id },
        data: {
            description: args.description,
            url: args.url,
            postedBy: { connect: { id: userId } },
        }
    });
    return link;
}

async function deleteLink(_parent, args, context, _info) {
    getUserId(context);
    const link = await context.prisma.link.delete({
        where: { id: args.id },
    });
    return link;
}

async function signup(_parent, args, context, _info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({ data: { ...args, password } });
    const token = jwt.sign({userId: user.id}, APP_SECRET);

    return { token, user };
}

async function login(_parent, args, context, _info) {
    const user = await context.prisma.user.findOne({ where: { email: args.email } });
    if (!user) {
        throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return { token, user };
}

async function vote(_parent, args, context, _info) {
    const userId = getUserId(context);

    // check if vote already exists
    const existingVote = await context.prisma.vote.findOne({
        where: {
            linkId_userId: {
                linkId: ++args.linkId,
                userId: userId
            }
        }
    });

    if (existingVote) {
        throw new Error(`Already voted for link: ${args.linkId}`);
    }

    const newVote = context.prisma.vote.create({
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: Number(args.linkId) } },
        }
      })
    context.pubsub.publish(SUB_KEYS.NEW_VOTE, { newVote });

    return newVote;
}

module.exports = { postLink, updateLink, deleteLink, signup, login, vote };
