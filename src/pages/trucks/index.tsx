
import PageLayout from '../../components/layout/pageLayout'
import TrucksList from '../../components/trucks/container/truckContainer'

const Trucks = (props) => {
  return (
    <PageLayout {...props} title='Trucks'>
      <TrucksList />
    </PageLayout>
  )
}

export default Trucks
