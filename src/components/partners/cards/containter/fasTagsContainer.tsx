import FasTag from '../fasTags'
import { gql, useSubscription } from '@apollo/client'

export const FASTAG_SUBSCRIPTION = gql`
subscription partner_fastag_tag {
  fastag_tag
  {
    id
    tagId
    deviceId
    companyId    
    truck {
      id
      truck_no
    }
    partner {
      id
      cardcode
      name
    }
    balance
    tag_status {
      id
      status
    }
  }
}
`
const FasTags = () => {
  const { loading, error, data } = useSubscription(
    FASTAG_SUBSCRIPTION
  )
  console.log('FastagContainer Error', error)

  var fastag = []
  if (!loading) {
    fastag = data.fastag_tag
  }

  return (
    <FasTag fastag={fastag} />
  )
}
export default FasTags
