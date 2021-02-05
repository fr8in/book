import WaitingForLoad from '../../trucks/waitingForLoad'
import { gql, useSubscription } from '@apollo/client'
import _ from 'lodash'
import { useState } from 'react'

const DASHBOARD_TRUCK_QUERY = gql`
subscription waiting_for_load($regions: [Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $truck_no: String, $dnd: Boolean) {
  region(where: {id: {_in: $regions}, branches: {id:{_in:$branches}}}) {
    id
    branches(where: {id: {_in: $branches}}) {
      id
      name
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        cities(where: {trucks: {id: {_is_null: false}}}) {
          id
          name
          trucks(where: {truck_status: {name: {_eq: "Waiting for Load"}}, truck_no: {_ilike: $truck_no}, truck_type: {id: {_in: $truck_type}}, partner: {partner_status: {name: {_eq: "Active"}}}, _or: [{partner: {dnd: {_neq: $dnd}}}, {truck_type: {id: {_nin: [25, 27]}}}]}) {
            id
            truck_no
            truck_type {
              id
              name
              code
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
            last_comment {
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
  const initial = { truckno: null}
  const [truckNo , setTruckNo] = useState(initial)

  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
    truck_type: (filters.types && filters.types.length > 0) ? filters.types : null,
    truck_no: truckNo.truckno ? `%${truckNo.truckno}%` : null,
    dnd: dndCheck === true ? false : true
  }
  const { loading, data, error } = useSubscription(DASHBOARD_TRUCK_QUERY, { variables })
  
  const onTruckNoSearch = (value) => {
    setTruckNo({ ...truckNo, truckno: value })
  }

  let trucks = []
  let branches = []
  if (!loading) {
    const newData = { data }
    trucks = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks').value()
    branches = _.chain(newData).flatMap('region').flatMap('branches').value()
  }
  return (
    <WaitingForLoad trucks={trucks} branches={branches} loading={loading} onTruckNoSearch={onTruckNoSearch} truckNo={truckNo}/>
  )
}

export default WaitingForLoadContainer
