function info() {
    return `This is the API of a Hackernews Clone`;
}

async function feed(_parent, args, context, _info) {
    const where = args.filter
        ? {
            OR: [
                { description: { contains: args.filter } },
                { url: { contains: args.filter } },
            ],
        }
        : {};

    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
    });

    const count = await context.prisma.link.count({ where })

    return { links, count };
}

async function link(_parent, args, context, _info) {
    const link = await context.prisma.link.findOne({
        where: { id: ++args.id }
    });
    return link;
}

module.exports = { info, feed, link };
