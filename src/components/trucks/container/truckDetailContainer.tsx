import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import Timeline from '../truckTimeline'
import { Row, Col , Button, Card} from 'antd'
import AssignStatus from '../assignStatus';

export default function TruckDetailContainer() {
    return (
        <div>

      <Row gutter={[10, 10]}>
          <Col xs={24} >
            <Card
              size='small'
              className='border-top-blue'
              title={
                <Truck />
              }
              extra={
              <AssignStatus/>
              }
            >
     
      <Row gutter={[10, 10]}>
                <Col xs={24} sm={12}>
                <Card size='small' className='card-body-0 border-top-blue'> <br/>
        <Timeline/>
        </Card>
      </Col>
      <Col xs={24} sm={12}>
      <Card size='small' className='card-body-0 border-top-blue'> <br/>
        <TripDetail/>
        </Card>
      </Col>
      </Row>
      
      <Card size='small' className='card-body-0 border-top-blue'> <br/>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
        <TruckInfo/>
      </Col>
    </Row>
    <Row gutter={[10, 10]}>
      <Col xs={24}>
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
            </Card>
      </Col>
      </Row>
</div>
    )
}

