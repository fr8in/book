import { Row, Col, Form, Input, Button, Select, Space, Card } from 'antd'

const { Option } = Select

const AddFuelCardContainer = () => {
  return (
    <Card size='small' title='Add Fuel Card' className='border-top-blue'>
      <Row justify='center'>
        <Col xs={24} sm={12} md={8}>
          <Form layout='vertical'>
            <Form.Item
              label='Card Provider'
              name='Card Provider'
              rules={[{ required: true }]}
            >
              <Select placeholder='Select Card Provider' allowClear>
                <Option value='Not Found'>Not Found</Option>
              </Select>
            </Form.Item>
            <Form.Item name='Partner' label='Partner' rules={[{ required: true }]}>
              <Select placeholder='Select Partner' allowClear>
                <Option value='Not Found'>Not Found</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='Partner Number'
              label='Partner Number'
              rules={[{ required: true }]}
            >
              <Input placeholder='Partner Number' />
            </Form.Item>
            <Form.Item
              name='Truck Number'
              label='Truck Number'
              rules={[{ required: true }]}
            >
              <Select placeholder='Select Truck' allowClear>
                <Option value='Not Found'>Not Found</Option>
              </Select>
            </Form.Item>
            <Form.Item className='text-right'>
              <Space>
                <Button htmlType='button'>Cancel</Button>
                <Button type='primary' key='submit' htmlType='submit'>Submit</Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  )
}

export default AddFuelCardContainer
