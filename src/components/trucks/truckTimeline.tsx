
import {  Row, Col, Timeline} from 'antd'
import moment from 'moment'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import useShowHide from '../../hooks/useShowHide'
import { deviceHistory } from '../../../mock/trucks/deviceHistory'

const truckTimeline = (props) => {
 
  const initial = {  breakdown: false }
  const { visible, onHide } = useShowHide(initial)
  return (
   
      <div className='timeLine editPage'>
        <Row gutter={16}>
          <Col xs={24}>
            {deviceHistory && deviceHistory.length > 0
              ? deviceHistory.map((data, i) => {
                return (
                  <Timeline key={i}>
                    <Timeline.Item>
                       <p>{data.deviceStatusType.statusName}</p>
                      <p className='time'>
                        {moment(data.startDate).format(
                          'YYYY-MM-DD HH:mm'
                        )}
                      </p>
                    {data.comment ? data.comment.map((comment, i) => (
                        <Row key={i}>
                          <Col span={24}>
                            <span>{comment.comment}</span>
                            <span className='pull-right'>
                              {comment.createdBy}
                            </span>
                          </Col>
                          <Col span={24}>
                            <span className='pull-right'>
                              {moment(comment.createdon).format(
                                'YYYY-MM-DD HH:mm')}
                            </span>
                          </Col>
                        </Row>
                      ))
                        : null}
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
