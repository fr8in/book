
import PageLayout from '../../components/layout/pageLayout'
import TripsContainer from '../../components/trips/containers/tripsContainer'

const Trips = (props) => {
  return (
    <PageLayout {...props} title='Trips'>
      <TripsContainer />
    </PageLayout>
  )
}

export default Trips
