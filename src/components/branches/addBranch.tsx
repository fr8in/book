import { Modal, Form, Input, Select } from 'antd'
import React from 'react'

const { Option } = Select

const AddBranch = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('branch Added!')
    onHide()
  }

  return (
    <Modal
      title='Add Branch'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <Form>
        <Form.Item>
          <Input placeholder='Branch Name' />
        </Form.Item>
        <Form.Item>
          <Select placeholder='Branch Manager' allowClear>
            <Option value='Not Found'>Not Found</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Select placeholder='Traffic Coordinator' allowClear>
            <Option value='Not Found'>Not Found</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Input placeholder='Display Position' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddBranch
