import PageLayout from "../../components/layout/pageLayout"
import TripDetailContainer from '../../components/trips/containers/tripDetailContainer'

const TripDetail = (props) => {
  return (
    <PageLayout {...props} title={`Trip - ${props.id}`}>
      <TripDetailContainer trip_id={props.id} />
    </PageLayout>
  )
}

TripDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default TripDetail
