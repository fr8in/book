import WaitingForLoad from '../../trucks/waitingForLoad'
import { gql, useSubscription ,useQuery } from '@apollo/client'
import _, { get } from 'lodash'
import { useState ,useContext} from 'react'
import {filterContext} from '../../../context'
import isEmpty from 'lodash/isEmpty'

const DASHBOARD_TRUCK_QUERY = gql`
subscription waiting_for_load($regions: [Int!],$active_category:[Int!],$speed:[Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $truck_no: String, $dnd: Boolean) {
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
          trucks(where: {truck_status: {name: {_eq: "Waiting for Load"}}, truck_no: {_ilike: $truck_no}, truck_type: {id: {_in: $truck_type}},dnd:{_neq:$dnd}
             partner: {active_category_id:{_in:$active_category} ,avg_km_speed_category_id:{_in:$speed}, partner_status: {name: {_eq: "Active"}}}}   ) {
            id
            truck_no
            dnd
            trips(order_by: {created_at: desc}, limit: 1) {
              created_at
              driver {
                mobile
              }
            }
            truck_type {
              id
              name
              code
            }
            partner {
              id
              cardcode
              name
              avg_km
              avg_km_speed_category_id
              active_category_id
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

const PARTNERS_ACTIVE_QUERY = gql`
query partner_active_category{
  partner_active_category{
    id
    name
  }
}
`

const WaitingForLoadContainer = (props) => {
  const {  dndCheck } = props
  const initial = { truckno: null}
  const [truckNo , setTruckNo] = useState(initial)
  const {state} = useContext(filterContext)

  const initialFilter = {
    activecategory:null
  }
  const [filter, setFilter] = useState(initialFilter)

  const variables = {
    regions: (state.regions && state.regions.length > 0) ? state.regions : null,
    branches: (state.branches && state.branches.length > 0) ? state.branches : null,
    cities: (state.cities && state.cities.length > 0) ? state.cities : null,
    truck_type: (state.types && state.types.length > 0) ? state.types : null,
    speed: (state.speed && state.speed.length > 0) ? state.speed : null,
    truck_no: truckNo.truckno ? `%${truckNo.truckno}%` : null,
    ...!isEmpty(filter.activecategory) && { active_category: filter.activecategory ? filter.activecategory : null},
    dnd: !dndCheck
  }
  const { loading, data, error } = useSubscription(DASHBOARD_TRUCK_QUERY, { variables })
  
  const onTruckNoSearch = (value) => {
    setTruckNo({ ...truckNo, truckno: value })
  }

  const onPartnerFilter = (name) => {
    setFilter({ ...filter, activecategory: name })
  }

  const { loading : active_loading, error : active_error, data : active_data } = useQuery(
    PARTNERS_ACTIVE_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  if (!active_loading) {
    _data = active_data
  }

  const partner_active_category = get(_data, 'partner_active_category', [])

  let trucks = []
  let branches = []
  if (!loading) {
    const newData = { data }
    trucks = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks').value()
    branches = _.chain(newData).flatMap('region').flatMap('branches').value()
  }
  return (
    <WaitingForLoad trucks={trucks} branches={branches}  onPartnerFilter={onPartnerFilter}  partner_active_category={partner_active_category} loading={loading} onTruckNoSearch={onTruckNoSearch} filter={filter} truckNo={truckNo}/>
  )
}

export default WaitingForLoadContainer
