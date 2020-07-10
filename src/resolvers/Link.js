async function postedBy(parent, _args, context, _info) {
    return await context.prisma.link.findOne({ where: { id: parent.id } }).postedBy();
}

async function votes(parent, _args, context, _info) {
    return await context.prisma.link.findOne({ where: { id: parent.id } }).votes();
}

module.exports = { postedBy, votes };
