const { GraphQLServer, PubSub } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');

// root type resolvers
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');

// type resolvers
const Link = require('./resolvers/Link');
const User = require('./resolvers/User');
const Vote = require('./resolvers/Vote');

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Link,
        User,
        Vote,
    },
    context: (request) => {
        return {
            ...request,
            prisma: new PrismaClient(),
            pubsub
        }
    },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
