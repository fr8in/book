import WaitingForLoad from '../../trucks/waitingForLoad'
import { gql, useSubscription } from '@apollo/client'
import _ from 'lodash'

const DASHBOARD_TRUCK_QUERY = gql`
subscription dashboard_trips($regions: [Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $truck_no: String) {
  region(where: {id: {_in: $regions}}) {
    id
    branches(where: {id: {_in: $branches}}) {
      id
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        cities {
          id
          trucks(where: {truck_status: {name: {_eq: "Waiting for Load"}}, truck_no: {_ilike: $truck_no}, truck_type: {id:{_in: $truck_type}}}) {
            id
            truck_no
            truck_type {
              id
              name
            }
            partner {
              id
              cardcode
              name
              partner_advance_percentage {
                id
                name
              }
              partner_memberships {
                membership_type_id
              }
              partner_users(where: {is_admin: {_eq: true}}) {
                mobile
              }
            }
            city {
              id
              name
            }
            driver {
              mobile
            }
            tat
            last_comment{
              description
            }
          }
        }
      }
    }
  }
}
`
const WaitingForLoadContainer = (props) => {
  const { filters } = props
  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
    truck_type: (filters.types && filters.types.length > 0) ? filters.types : null,
    truck_no: null
  }
  const { loading, data, error } = useSubscription(DASHBOARD_TRUCK_QUERY, { variables })
  console.log('WaitingForLoadContainer error', error)

  let trucks = []
  if (!loading) {
    const newData = { data }
    trucks = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks').value()
  }
  return (
    <WaitingForLoad trucks={trucks} loading={loading} />
  )
}

export default WaitingForLoadContainer
