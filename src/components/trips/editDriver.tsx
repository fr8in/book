import { CloseCircleTwoTone } from '@ant-design/icons'
import { Space, Form, Row, Col } from 'antd'
import React, { useState } from 'react'
import EditAccess from '../common/editAccess'
import Phone from '../common/phone'
import Driver from './driver'
import u from '../../lib/util'

const EditDriver = (props) => {
  const { mobile, trip_info } = props
  const [edit_driver, set_edit_driver] = useState(false)
  const toggleDriver = () => {
    set_edit_driver(prev => !prev)
  }
  const { role } = u
  const employee_role = [role.user]
  return (
    edit_driver
      ? (
        <Row>
          <Col xs={20}>
            <Form className='mb0'>
              <Driver nolabel trip_info={trip_info} initialValue={mobile} toggleDriver={toggleDriver} size='small' />
            </Form>
          </Col>
          <Col xs={4} className='text-right'>
            <CloseCircleTwoTone onClick={toggleDriver} />
          </Col>
        </Row>)
      : 
      (
        <Row>
          <Col xs={20}>
            <Phone number={mobile} />
          </Col>
          <Col xs={4} className='text-right'>
            <EditAccess
              edit_access={employee_role}
              onEdit={toggleDriver}
            />
          </Col>
        </Row>)
  )
}

export default EditDriver
