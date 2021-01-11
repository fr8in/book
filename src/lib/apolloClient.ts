import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import { refreshToken } from './auth'
import { onError } from '@apollo/client/link/error'
import u from '../lib/util'
// import WebSocket from 'ws';

const { application_error } = u



const isBrowser = typeof window !== 'undefined'
const wsLink = isBrowser ? new WebSocketLink({
  uri: process.env.NEXT_PUBLIC_WS_CORE,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      await refreshToken(false)
      const token = await localStorage.getItem('token')
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

const changeSubscriptionToken = token => {
  if (wsLink.subscriptionClient.connectionParams.authToken === token) {
  wsLink.subscriptionClient.connectionParams.authToken = token
  wsLink.subscriptionClient.close()
  wsLink.subscriptionClient.connect()
}
}

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HTTP_CORE,
  credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
})
const authLink = setContext( async(_, { headers }) => {
  // get the authentication token from local storage if it exists
  await refreshToken(false)
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  if(token){
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }}
})

const concatedHttpLink = authLink.concat(httpLink)

const link = isBrowser ? split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
    )
  },
  wsLink,
  concatedHttpLink
) : concatedHttpLink

const errorLink = onError(({ graphQLErrors, networkError }) => {
    const networkErrorMessage = networkError && networkError.message ? networkError.message : null
    const graphqlErrorMessage = graphQLErrors && graphQLErrors.length > 0 && graphQLErrors[0].message ? graphQLErrors[0].message : null
      if ((networkError && networkErrorMessage.includes(application_error.JWT_TOKEN_EXPIRE_ERROR)) || 
      (graphQLErrors && graphqlErrorMessage.includes(application_error.JWT_TOKEN_EXPIRE_ERROR))) {
        refreshToken(false)
      }
})

const createApolloClient = (initialState, ctx) => {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: errorLink.concat(link),
    cache: new InMemoryCache().restore(initialState)
  })
}

export  { changeSubscriptionToken, createApolloClient}
