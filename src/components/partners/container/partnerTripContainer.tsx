import { gql, useSubscription } from '@apollo/client'
import TripsByStages from '../../trips/tripsByStages'
import get from 'lodash/get'

const PARTNER_TRIP_QUERY = gql`
subscription partner_trip($cardcode: String, $trip_status_value: [String!]) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    trips(where: {trip_status: {name: {_in: $trip_status_value}}}) {
      id
      order_date
      created_at
      source {
        name
      }
      truck{
        truck_no
        truck_type{
          name
        }
      }
      destination {
        name
      }
      customer{
        name
        cardcode
      }
      source_in
      trip_status {
        name
      }
    }
  }
}`

const PartnerTripContainer = (props) => {
  const { cardcode, trip_status } = props
  const { loading, error, data } = useSubscription(
    PARTNER_TRIP_QUERY,
    {
      variables: {
        cardcode: cardcode,
        trip_status_value: trip_status
      }
    }
  )

  console.log('PartnerTripContainer Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const trips = get(_data, 'partner[0].trips', [])

  return (
    <TripsByStages trips={trips} loading={loading} partnerPage />
  )
}

export default PartnerTripContainer
