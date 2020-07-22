import React from 'react'
import { DatePicker, Button, Row, Col, Timeline, Form } from 'antd'
import { SearchOutlined, CommentOutlined, SelectOutlined } from '@ant-design/icons'
import moment from 'moment'
import CommentModal from '../../components/trucks/commentModal'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import useShowHide from '../../hooks/useShowHide'
import { deviceHistory } from '../../../mock/trucks/deviceHistory'

const truckTimeline = () => {
  const initial = { commment: false, breakdown: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  return (
    <div>
      <Row>
        <Col xs={24} className='mb10'>
          <Form layout='inline'>
            <Form.Item>
              <DatePicker
                showTime
                name='startSearchDate'
                format='YYYY-MM-DD'
                className='startSearchdate1'
                placeholder='Start Date'
              />
            </Form.Item>
            <Form.Item>
              <DatePicker
                showTime
                name='endSearchDate'
                format='YYYY-MM-DD'
                className='endSearchdate1'
                placeholder='End Date'
              />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                className='dateSearch1'
                icon={<SearchOutlined />}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <div className='timeLine editPage'>
        <Row gutter={16}>
          <Col xs={24}>
            {deviceHistory && deviceHistory.length > 0
              ? deviceHistory.map((data, i) => {
                return (
                  <Timeline key={i}>
                    <Timeline.Item
                      color={
                        data.statusId === 10
                          ? 'red'
                          : data.statusId === 11
                            ? 'orange'
                            : data.statusId === 4 ? 'blue' : 'green'
                      }
                    >
                      <p>{data.deviceStatusType.statusName}</p>
                      <p className='time'>
                        {moment(data.startDate).format(
                          'YYYY-MM-DD HH:mm'
                        )}
                      </p>
                      <Button.Group size='small'>
                        {data.statusId !== 10 && data.statusId !== 11 ? (
                          <Button size='small' icon={<SelectOutlined />} onClick={() => onShow('breakdown')} />
                        ) : null}
                        <Button size='small' icon={<CommentOutlined />} onClick={() => onShow('comment')} />
                        {data.statusId === 10 || data.statusId === 11 ? (
                          <Button size='small' id={`_${data.id}`} icon={<SelectOutlined />} onClick={() => onShow('breakdown')} />
                        ) : null}
                      </Button.Group>

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
            onHide={() => onHide('breakdown')}
            title='Add BreakDown or In-transit Halting'
            radioType
          />}
        {visible.comment && <CommentModal visible={visible.comment} onHide={() => onHide('comment')} />}
      </div>
    </div>
  )
}

export default truckTimeline
