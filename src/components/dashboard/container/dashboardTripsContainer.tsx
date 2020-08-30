import Trips from '../../trips/activeTrips'
import DASHBOAD_TRIPS_QUERY from './query/tripsQuery'
import { useSubscription } from '@apollo/client'
import _ from 'lodash'

const TripsContainer = (props) => {
  const { filters, trip_status, intransit } = props
  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
    truck_type: (filters.types && filters.types.length > 0) ? filters.types : null,
    managers: (filters.managers && filters.managers.length > 0) ? filters.managers : null,
    trip_status: trip_status
  }
  const { loading, data, error } = useSubscription(DASHBOAD_TRIPS_QUERY, { variables })
  console.log('TripsContainer error', error)

  let trips = []
  if (!loading) {
    const newData = { data }
    trips = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trips').value()
  }
  return (
    <Trips trips={trips} loading={loading} intransit={intransit} />
  )
}

export default TripsContainer
