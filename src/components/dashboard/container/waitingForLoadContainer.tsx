import WaitingForLoad from '../../trucks/waitingForLoad'
import { gql, useSubscription } from '@apollo/client'
import _ from 'lodash'

const DASHBOARD_TRUCK_QUERY = gql`
subscription waiting_for_load($regions: [Int!], $branches: [Int!], $cities: [Int!], $where:truck_bool_exp) {
  region(where: {id: {_in: $regions}}) {
    id
    branches(where: {id: {_in: $branches}}) {
      id
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        cities {
          id
          trucks(where:$where ) {
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
  const { filters, dndCheck } = props
 
const where = {
  _and: [
  {truck_status: {name: {_eq: "Waiting for Load"}}}, 
    {partner:{partner_status:{name:{"_eq":"Active"}}}},
   {truck_type: (filters.types && filters.types.length > 0) ? filters.types : null},
   {truck_no: {_ilike:  null}}
  ], _or:[{ partner:{dnd:{_neq:true}}},{truck_type: {id:{_nin: [25,27]}}}]
}
const dndWhere = {
  _and: [
  {truck_status: {name: {_eq: "Waiting for Load"}}}, 
    {partner:{partner_status:{name:{"_eq":"Active"}}}},
    {truck_type: (filters.types && filters.types.length > 0) ? filters.types : null},
    {truck_no: {_ilike:  null}}
  ], _or:[{ partner:{dnd:{_neq:null}}}]
}
  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
    where: dndCheck === true ? dndWhere : where
  }
  const { loading, data, error } = useSubscription(DASHBOARD_TRUCK_QUERY, { variables })

 
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
