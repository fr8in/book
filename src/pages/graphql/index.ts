// Imports: GraphQL
import { ApolloServer, makeExecutableSchema } from 'apollo-server-micro'

// import { createContext, EXPECTED_OPTIONS_KEY } from 'dataloader-sequelize'
// consts: GraphQL TypeDefs & Resolvers
import organization from './1-organization'
import query from './0-query'
import trip from './4-trip'

// GraphQL: Schema
const apolloServer = new ApolloServer({
  introspection: true,
  schema: makeExecutableSchema({ typeDefs: [query.typeDefs, organization.typeDefs, trip.typeDefs],resolvers:[organization.resolvers,trip.resolvers] }),
  tracing: true,
  cacheControl: {
    defaultMaxAge: 120
  },
  mocks: false,
  mockEntireSchema: false,
  // context(req: Request) {
  //   // For each request, create a DataLoader context for Sequelize to use
  //   const dataloaderContext = createContext(sequelize)

  //   // Using the same EXPECTED_OPTIONS_KEY, store the DataLoader context
  //   // in the global request context
  //   return { [EXPECTED_OPTIONS_KEY]: dataloaderContext }
  // },
})
// Exports
export default apolloServer.createHandler({ path: '/api/graphql' })

export const config = {
  api: {
    bodyParser: false,
  },
}
