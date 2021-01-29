
import { gql, useQuery, useMutation, useSubscription} from '@apollo/client'


const GET_TOKEN = gql`
query getToken($ref_id: Int!, $process: String!) {
    token(ref_id: $ref_id, process: $process)
  }
`




const IciciIncomingTransfer = () => {
let ref_id = ''
    const { data } = useQuery(GET_TOKEN, {
        fetchPolicy: 'network-only',
        variables: {
          ref_id: ref_id,
          process: 'INCOMING_OUTGOING_TRANSFER'
        }
      })

  return (
          <>

          </>
  )
}

export default IciciIncomingTransfer
