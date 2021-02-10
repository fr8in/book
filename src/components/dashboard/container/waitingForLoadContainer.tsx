import WaitingForLoad from '../../trucks/waitingForLoad'
import { gql, useSubscription } from '@apollo/client'
import _ from 'lodash'
import { useState ,useContext} from 'react'
import filterContext from '../../../lib/filterContaxt'


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
          trucks(where: {truck_status: {name: {_eq: "Waiting for Load"}}, truck_no: {_ilike: $truck_no}, truck_type: {id: {_in: $truck_type}}, 
             partner: {partner_status: {name: {_eq: "Active"}}, dnd: {_neq: true}}}   ) {
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
  const {  dndCheck } = props
  const initial = { truckno: null}
  const [truckNo , setTruckNo] = useState(initial)
  const {state} = useContext(filterContext)

  const variables = {
    regions: (state.regions && state.regions.length > 0) ? state.regions : null,
    branches: (state.branches && state.branches.length > 0) ? state.branches : null,
    cities: (state.cities && state.cities.length > 0) ? state.cities : null,
    truck_type: (state.types && state.types.length > 0) ? state.types : null,
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
