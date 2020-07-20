import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import Timeline from '../truckTimeline'
import { Row, Col , Button, Card} from 'antd'

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
                <Card size='small' className='card-body-0 border-top-blue'>
        <Timeline/>
        </Card>
      </Col>
      <Col xs={24} sm={12}>
      <Card size='small' className='card-body-0 border-top-blue'>
        <TripDetail/>
        </Card>
      </Col>
      </Row>
      
      <Card size='small' className='card-body-0 border-top-blue'>
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
    </Card>

    <Row justify="end" className="m5">
                
                <Col flex="100px">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Col>
                <Col flex="100px">
                    <Button >
                        Cancel
                    </Button>
                </Col>
            </Row>
</div>
    )
}