
import PageLayout from '../../components/layout/pageLayout'
import { Card } from 'antd'
import Trips from '../../components/trips/trips'

const TripsPage = () => {
  return (
    <PageLayout title='Trips'>
      <Card size='small' className='card-body-0 border-top-blue'>
        <Trips />
      </Card>
    </PageLayout>
  )
}

export default TripsPage
