import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import Timeline from '../truckTimeline'
import { Row, Col , Button} from 'antd'

export default function truckDetailContainer() {
    return (
        <div>
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

</div>
    )
}