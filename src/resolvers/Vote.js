async function link(parent, _args, context, _info) {
    return context.prisma.vote.findOne({ where: { id: parent.id } }).link();
}

async function user(parent, _args, context, _info) {
    return context.prisma.vote.findOne({ where: { id: parent.id } }).user();
}

module.exports = { link, user };
