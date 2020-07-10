async function links(parent, _args, context, _info) {
    return await context.prisma.user.findOne({ where: { id: parent.id } }).links();
}

async function votes(parent, _args, context, _info) {
    return await context.prisma.user.findOne({ where: { id: parent.id } }).votes();
}

module.exports = { links, votes };
