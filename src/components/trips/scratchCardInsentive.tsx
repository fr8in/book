import { useState, useContext } from 'react'
import { Row, Col, Radio, Input, Select, Form, Button, message } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'



const Incentive = (props) => {


  const issue_type_list = [
    {
      value: '1',
      label: 'Referral '
    }
  ]

  return (
    <>
      <Form layout='vertical' >
        <Row gutter={10}>
            <Form.Item label='Incentive Type' name='issue_type' rules={[{ required: true }]}>
              <Select
                id='incentiveType'
                placeholder='Select Incentive Type'
                options={issue_type_list}
              />
            </Form.Item>
        </Row>
        <Row gutter={10}>
          <Col flex='auto'>
            <Form.Item label='Comment' name='comment' rules={[{ required: true }]}>
              <Input
                placeholder='textarea'
              />
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Form.Item label='save' className='hideLabel'>
              <Button
                type='primary'
                htmlType='submit'
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Incentive
