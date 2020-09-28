import { Modal, Form, Input, Select, message, Row, Col, Button } from 'antd'
import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import u from '../../lib/util'
import { useState } from 'react'

const ADD_BRANCH_SUBSCRIPTION = gql`
 query add_branch{
  employee{
    id
    email
  }
  region{
    id
    name
  }
}
`

const INSERT_BRANCH_MUTATION = gql`
mutation insert_branch(
  $name: String!,
  $region_id: Int,
  $displayposition: Int,
  $emp_data: [branch_employee_insert_input!]!
  $target_data: [branch_weekly_target_insert_input!]!
) {
  insert_branch(objects: {
    name: $name,
    region_id: $region_id,
    displayposition: $displayposition,
    branch_employees: {data: $emp_data},
    branch_weekly_targets: {data: $target_data}
  }) {
    returning{
      id
      name
    }
  }
}
`

const AddBranch = (props) => {
  const { visible, onHide } = props

  const [disableButton, setDisableButton] = useState(false)

  const { loading, error, data } = useQuery(
    ADD_BRANCH_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('AddBranch error', error)

  const [updateBranch] = useMutation(
    INSERT_BRANCH_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        onHide()
      }

    }
  )

  var employee = []
  var region = []
  if (!loading) {
    region = data.region
    employee = data.employee
  }

  const regionList = region.map((data) => {
    return { value: data.id, label: data.name }
  })
  const employeeList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

  const onSubmit = (form) => {
    setDisableButton(true)
    const bm_traffic = [
      { employee_id: form.bm_id, is_manager: true },
      { employee_id: form.traffic_id, is_manager: false }
    ]
    const bm = [
      { employee_id: form.bm_id, is_manager: true }
    ]
    const period = u.getWeekNumber(new Date())
    const target_data = [{ week: period.week, year: period.year, trip_target: form.target }]
    updateBranch({
      variables: {
        name: form.name,
        region_id: form.region,
        displayposition: form.display_position,
        emp_data: form.bm_id && form.traffic_id ? bm_traffic : bm,
        target_data: target_data
      }
    })
  }

  return (
    <Modal
      title='Add Branch'
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
      <Form onFinish={onSubmit}>
        <Form.Item name='name'>
          <Input placeholder='Branch Name' />
        </Form.Item>
        <Form.Item name='bm_id'>
          <Select
            placeholder='Branch Manager'
            options={employeeList}
            optionFilterProp='label'
            showSearch
          />
        </Form.Item>
        <Form.Item name='traffic_id'>
          <Select
            placeholder='Traffic Coordinator'
            options={employeeList}
            optionFilterProp='label'
            showSearch
          />
        </Form.Item>
        <Form.Item name='display_position'>
          <Input placeholder='Display Position' />
        </Form.Item>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item name='region'>
              <Select
                placeholder='Region'
                optionFilterProp='label'
                options={regionList}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='target'>
              <Input placeholder='Weekly target' type='number' />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='end'>
          <Col xs={24} className='text-right'>
            <Button type='primary' loading={disableButton} htmlType='submit'>Submit</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddBranch
