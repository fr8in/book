import Trips from '../../trips/activeTrips'
import DASHBOAD_TRIPS_QUERY from './query/tripsQuery'
import { useSubscription } from '@apollo/client'
import _ from 'lodash'

const TripsContainer = (props) => {
  const { filters, trip_status } = props
  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities > 0) ? filters.cities : null,
    trip_status: trip_status,
    truck_type: (filters.types && filters.types > 0) ? filters.types : null,
    managers: (filters.managers && filters.managers > 0) ? filters.managers : null
  }
  const { loading, data, error } = useSubscription(DASHBOAD_TRIPS_QUERY, { variables })
  console.log('TripsContainer error', error)

  let trips = []
  if (!loading) {
    const newData = { data }
    trips = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trips').value()
  }
  return (
    <Trips trips={trips} loading={loading} />
  )
}

export default TripsContainer
