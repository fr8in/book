import { Timeline, Row, Col, Input, Button, Divider, Card } from 'antd'
import moment from 'moment'
import data from '../../../mock/trip/tripComment'

const TripComment = (props) => {
  return (
    <Card size='small'>
      <Row>
        <Col xs={24} className='timeLine'>
          {data && data.length > 0
            ? data.map((data, i) => {
              return (
                <Timeline key={i}>
                  <Timeline.Item>
                    <h4>{data.tripStatus}</h4>
                    <Row>
                      <Col xs={24}>
                        <span>{data.comment}</span>
                        <span className='pull-right'>
                          {data.createdby}
                        </span>
                      </Col>
                      <Col xs={24}>
                        <span className='pull-right'>
                          {moment(data.createdon).format(
                            'YYYY-MM-DD HH:mm')}
                        </span>
                      </Col>
                    </Row>
                  </Timeline.Item>
                </Timeline>
              )
            })
            : null}
        </Col>
      </Row>
      <Row gutter={10}>
        <Col flex='auto'>
          <Input
            id='comment'
            name='comment'
            placeholder='Enter Comments......'
            type='textarea'
          />
        </Col>
        <Col flex='80px'>
          <Button type='primary'>Submit</Button>
        </Col>
      </Row>
    </Card>
  )
}

export default TripComment
