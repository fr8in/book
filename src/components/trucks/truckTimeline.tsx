
import { Row, Col, Timeline } from 'antd'
import moment from 'moment'

const TruckTimeline = (props) => {
  const { comments } = props
  return (
    <div className='timeLine editPage'>
      <Row gutter={16}>
        <Col xs={24}>
          {comments && comments.length > 0
            ? comments.map((data, i) => {
              return (
                <Timeline key={i}>
                  <Timeline.Item>
                    <p>{data.topic}</p>
                    <p className='time'>
                      {moment(data.created_at).format(
                        'YYYY-MM-DD HH:mm'
                      )}
                    </p>

                    <Row key={i}>
                      <Col span={24}>
                        <span>{data.description}</span>
                        <span className='pull-right'>
                          {data.created_by}
                        </span>
                      </Col>
                      <Col span={24}>
                        <span className='pull-right'>
                          {moment(data.created_at).format(
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
    </div>

  )
}

export default TruckTimeline
