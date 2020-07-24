import { Row, Col, Form, Input, Button, Select, Space, Card } from 'antd'

const { Option } = Select

const AddFastag = () => {
  return (
    <Card size='small' title='Add FasTag' className='border-top-blue'>
      <Row justify='center'>
        <Col xs={24} sm={12} md={8}>
          <Form layout='vertical'>
            <Form.Item name='Tag Id' label='Tag Id' rules={[{ required: true }]}>
              <Input placeholder='Tag Id' />
            </Form.Item>
            <Form.Item
              name='Confirm Tag Id'
              label='Confirm Tag Id'
              rules={[{ required: true }]}
            >
              <Input placeholder='Confirm Tag Id' />
            </Form.Item>
            <Form.Item name='Partner' label='Partner' rules={[{ required: true }]}>
              <Select placeholder='Select Partner' allowClear>
                <Option value='Not Found'>Not Found</Option>
              </Select>
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
                <Button type='primary' htmlType='submit'>Submit</Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  )
}

export default AddFastag
