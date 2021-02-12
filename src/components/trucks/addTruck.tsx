import { Row, Col, Input, Button, Form, Space, Select,DatePicker } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import CitySelect from '../common/citySelect'
import Driver from './driver'
import Link from 'next/link'
import get from 'lodash/get'

const AddTruck = (props) => {
  const { partner_info, onSubmit, typeList, driverChange, onCityChange, disableButton, disableAddTruck } = props
  const dateFormat = 'YYYY-MM-DD'

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
            <Form.Item
                label='Driver Number'
                name='driver_number'
                rules={[{ required: true, message: 'Driver Number is required field' }]}
              >
          <Driver partner_id={partner_info.id} truck_id={get(partner_info, 'trucks.id', null)} initialValue={get(partner_info, 'trucks.driver.mobile', null)} /> 
          </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Form.Item 
                label='Insurance Expiry Date'
                name='insurance_expiry_at'
                rules={[{ required: true, message: 'Insurance Expiry Date is required field' }]}
                 >
                  <DatePicker
                    showToday={false}
                    placeholder='Insurance Expiry Date'
                    format={dateFormat}
                    size='middle'
                  />
                </Form.Item>
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
