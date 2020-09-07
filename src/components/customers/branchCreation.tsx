import React from 'react'
import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Col,
  Input
} from 'antd'

const regionList = [
  { value: 'North' },
  { value: 'East' },
  { value: 'South' },
  { value: 'West' },
  { value: 'others' }
]

const cusType = [
  { value: 'Transporter' },
  { value: 'Broker' },
  { value: 'Shipper' },
  { value: 'Enterprice' }
]

const BranchCreation = (props) => {
  const { visible, onHide, data } = props

  const onSubmit = () => {
    console.log('Traffic Added', data)
    onHide()
  }

  return (
    <>
      <Modal
        visible={visible}
        title='Create Branch'
        onOk={onSubmit}
        onCancel={onHide}
        bodyStyle={{ padding: 10 }}
        width={450}
        footer={[
          <Button key='back' onClick={onHide}>Cancel</Button>,
          <Button type='primary' key='submit'>Create Branch & Approve</Button>
        ]}
      >
        <Form>
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item>
                <Select placeholder='Region' options={regionList} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                <Input placeholder='Head Office' disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item>
                <Input placeholder='Name' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                <Select
                  placeholder='Customer Type ....'
                  options={cusType}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={8}>
              <Form.Item>
                <Input placeholder='Building Number' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item>
                <Input placeholder='Address' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={8}>
              <Form.Item>
                <Select placeholder='Select City' options={data} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item>
                <Select placeholder='Select State' options={data} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item>
                <Input placeholder='Pincode' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item>
                <Select placeholder='OnBoarded By' options={data} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                <Select
                  placeholder='Select Payment Manager'
                  options={data}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default BranchCreation
