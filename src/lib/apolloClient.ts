import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
// import WebSocket from 'ws';

const isBrowser = typeof window !== 'undefined'
const wsLink = isBrowser ? new WebSocketLink({
  uri: 'ws://dev-fr8.southeastasia.azurecontainer.io/v1/graphql',
  options: {
    reconnect: true
  }
  // webSocketImpl: WebSocket
}) : null
console.log(' process.browser: ', process.browser)
const httpLink = new HttpLink({
  uri: process.env.CORE || 'http://dev-fr8.southeastasia.azurecontainer.io/v1/graphql',
  credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
})
const link = isBrowser ? split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
) : httpLink

export default function createApolloClient (initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link,
    cache: new InMemoryCache().restore(initialState)
  })
}
