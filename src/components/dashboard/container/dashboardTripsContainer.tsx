import Trips from '../../trips/activeTrips'
import DASHBOAD_TRIPS_QUERY from './query/tripsQuery'
import { useSubscription } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { useState } from 'react'

const TripsContainer = (props) => {
  const { filters, trip_status, intransit, partner_region_filter } = props

  const [partnerRegionFilter,setPartnerRegionFilter] = useState(null)

  const variables = {
    trip_status: trip_status,
    ...!isEmpty(partnerRegionFilter) && { partner_region: (partnerRegionFilter && partnerRegionFilter.length > 0) ? partnerRegionFilter : null },
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
    truck_type: (filters.types && filters.types.length > 0) ? filters.types : null,
    managers: (filters.managers && filters.managers.length > 0) ? filters.managers : null
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
