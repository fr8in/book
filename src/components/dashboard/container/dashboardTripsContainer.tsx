import Trips from '../../trips/activeTrips'
import DASHBOAD_TRIPS_QUERY from './query/tripsQuery'
import { useSubscription } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { useState,useContext } from 'react'
import {filterContext} from '../../../context'

const TripsContainer = (props) => {
  const {  trip_status, intransit, partner_region_filter } = props

  const [partnerRegionFilter,setPartnerRegionFilter] = useState(null)
  const {state} = useContext(filterContext)

  const variables = {
    trip_status: trip_status,
    ...!isEmpty(partnerRegionFilter) && { partner_region: (partnerRegionFilter && partnerRegionFilter.length > 0) ? partnerRegionFilter : null },
    regions: (state.regions && state.regions.length > 0) ? state.regions : null,
    branches: (state.branches && state.branches.length > 0) ? state.branches : null,
    cities: (state.cities && state.cities.length > 0) ? state.cities : null,
    truck_type: (state.types && state.types.length > 0) ? state.types : null,
    managers: (state.managers && state.managers.length > 0) ? state.managers : null,
    speed:(state.speed && state.speed.length > 0) ? state.speed : null
  }
  const { loading, data, error } = useSubscription(DASHBOAD_TRIPS_QUERY, { variables })


  let newData = {}
  if (!loading) {
    newData = data
  }

  const trips = get(newData, 'trip', [])
  return (
    <Trips
      trips={trips}
      loading={loading}
      intransit={intransit}
      partnerRegionFilter={partnerRegionFilter}
      setPartnerRegionFilter={setPartnerRegionFilter}
      partner_region_filter={partner_region_filter}
    />
  )
}

export default TripsContainer
