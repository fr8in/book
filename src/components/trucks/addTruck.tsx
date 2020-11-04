import { Row, Col, Input, Button, Form, Space, Select } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import CitySelect from '../common/citySelect'
import Driver from './driver'
import Link from 'next/link'

const AddTruck = (props) => {
  const { partner_info, onSubmit, typeList, driverChange, onCityChange, disableButton, disableAddTruck } = props

  return (
    <Form layout='vertical' onFinish={onSubmit}>
      <Row gutter={10}>
        <Col sm={24}>
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item
                label='Truck Number'
                name='truck_no'
                rules={[{ required: true, message: 'Truck Number is required field!' }]}
              >
                <Input placeholder='Truck Number' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item>
                <CitySelect
                  label='Current City'
                  onChange={onCityChange}
                  required
                  name='city'
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item
                label='Truck Type'
                name='truck_type'
                rules={[{ required: true, message: 'Truck Type is required field' }]}
              >
                <Select placeholder='Select truck type' options={typeList} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Driver partner_id={partner_info.id} driverChange={driverChange} />
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={8}>
              <Form.Item
                label='Length(Ft)'
                name='length'
                rules={[{ required: true, message: 'Length(Ft) is required field' }]}
              >
                <Input placeholder='Length(Ft)' type='number' disabled={false} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label='Breadth(Ft)'
                name='breadth'
                rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
              >
                <Input placeholder='Breadth(Ft)' type='number' disabled={false} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label='Height(Ft)'
                name='height'
                rules={[{ required: true, message: 'Height(Ft) is required field' }]}
              >
                <Input placeholder='Height(Ft)' type='number' disabled={false} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className='text-right mb0'>
            <Space>
              {partner_info.cardcode &&
                <Link href='/partners/[id]' as={`/partners/${partner_info.cardcode}`}>
                  <Button icon={<LeftOutlined />}>Back</Button>
                </Link>}
              <Button type='primary' loading={disableButton} disabled={disableAddTruck} htmlType='submit'>Add Truck</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default AddTruck
