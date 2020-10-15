import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import { refreshToken } from './auth'
// import WebSocket from 'ws';

const isBrowser = typeof window !== 'undefined'
const wsLink = isBrowser ? new WebSocketLink({
  uri: process.env.NEXT_PUBLIC_WS_CORE,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      refreshToken()
      const token = await localStorage.getItem('token')
      console.log('token', token)
      if (token) {
        return {
          headers: {
            authorization: token ? `Bearer ${token}` : ''
          }
        }
      }
    }
  }
  // webSocketImpl: WebSocket
}) : null
console.log(' process.browser: ', process.browser)
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HTTP_CORE,
  credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
})
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  refreshToken()
  const token = localStorage.getItem('token')
  console.log('token', token)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
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
    link: authLink.concat(link),
    cache: new InMemoryCache().restore(initialState)
  })
}
