import PageLayout from '../../../components/layout/pageLayout'
import TruckInfo from '../../../components/trucks/truckDetail/truckInfo'
import Documents from '../../../components/trucks/truckDetail/truckDocuments'
import TripDetail from '../../../components/trips/tripsByStages'
import Truck from '../../../components/trucks/truckDetail/truck'
import Timeline from '../../../components/trucks/truckDetail/truckTimeline'
import { Row, Col , Button} from 'antd'

const TruckDetail = (props) => {

    return (
    <PageLayout title={`Truck - ${props.id}`}>
      <Row>
      <Col >
        <Truck/>
      </Col>
      </Row>
      <Row gutter={[10, 10]}>
                <Col xs={24} sm={12}>
 
        <Timeline/>
      </Col>
      <Col xs={24} sm={12}>
        <TripDetail/>
      </Col>
      </Row>
      <Row>
      <Col>
        <TruckInfo/>
      </Col>
    </Row>
    <Row>
      <Col>
        <Documents/>
      </Col>
    </Row>

    <Row>
      <Col>
      <Button type="primary">Submit</Button>
      </Col>
      <Col>
    <Button> Cancel </Button>
    </Col>
    </Row>
   
  </PageLayout>
)
}


  TruckDetail.getInitialProps = ({ query }) => {
    return {
      id: query.id
    }
  }
  
  export default TruckDetail