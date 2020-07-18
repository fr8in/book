import PageLayout from "../../components/layout/pageLayout"
import TripDetail from '../../components/trips/tripDetail'

const TripDetailPage = (props) => {
  return (
    <PageLayout title={`Trip - ${props.id}`}>
      <TripDetail tripId={props.id} />
    </PageLayout>
  )
}

TripDetailPage.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default TripDetailPage
