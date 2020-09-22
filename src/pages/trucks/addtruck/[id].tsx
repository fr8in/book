import PageLayout from '../../../components/layout/pageLayout'
import AddTruckContainer from '../../../components/trucks/container/addTruckContainer'

const AddTruck = (props) => {
  return (
    <PageLayout {...props} title={`Truck - ${props.id}`}>
      <AddTruckContainer cardcode={props.id}/>
    </PageLayout>
  )
}

AddTruck.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default AddTruck