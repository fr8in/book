import PageLayout from '../../components/layout/pageLayout'
import TruckDetailContainer from '../../components/trucks/container/truckDetailContainer'

const TruckDetail = (props) => {
    return (
    <PageLayout title={`Truck - ${props.id}`}>
      <TruckDetailContainer />
    </PageLayout>
  )
}

TruckDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default TruckDetail