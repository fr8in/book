
import {  Row, Col, Timeline} from 'antd'
import moment from 'moment'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import useShowHide from '../../hooks/useShowHide'
import { deviceHistory } from '../../../mock/trucks/deviceHistory'

const truckTimeline = (props) => {
   const {comments} = props
  const initial = {  breakdown: false }
  const { visible, onHide } = useShowHide(initial)
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
                              {data.created_by_id}
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
        {visible.breakdown &&
          <CreateBreakdown
            visible={visible.breakdown}
            onHide={onHide}
            title='Add BreakDown or In-transit Halting'
            radioType
          />}
       
      </div>
   
  )
}

export default truckTimeline
