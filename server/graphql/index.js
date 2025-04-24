const { createHandler } = require('graphql-http/lib/use/express');
const { schema, root } = require('./schema');

const graphqlHandler = createHandler({
  schema,
  rootValue: root,
  graphiql: true, 
});

module.exports = graphqlHandler;
