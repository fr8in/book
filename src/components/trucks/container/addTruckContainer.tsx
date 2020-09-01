import { useState } from 'react'
import { Row, Col, Card, Input, Button, Form, Divider, Space, Select, message } from 'antd'
import LabelAndData from '../../common/labelAndData'
import Link from 'next/link'
import { gql, useQuery, useMutation } from '@apollo/client'
import CitySelect from '../../common/citySelect'
import Driver from '../driver'

const ADD_TRUCK_QUERY = gql`
query addTruck ( $cardcode: String){
  partner(where: {cardcode: {_eq: $cardcode}}) {
    id
    cardcode
    name
  }
  truck_type {
    id
    name
  }
}`

const INSERT_ADD_TRUCK_MUTATION = gql`
mutation AddTruck($truck_no:String,  $partner_id: Int, $breadth:float8,$length:float8,$height:float8,$city_id:Int,$truck_type_id:Int, $driver_id: Int ) {
  insert_truck(objects: {truck_no: $truck_no,breadth: $breadth, height: $height, length: $length, partner_id: $partner_id,  truck_type_id: $truck_type_id, city_id: $city_id, driver_id: $driver_id, truck_status_id: 5}) {
    returning {
      id
      truck_no
    }
  }
}`

const AddTruck = () => {
  const [city_id, setCity_id] = useState(null)
  const [driver_id, setDriver_id] = useState(null)

  const onCityChange = (city_id) => {
    setCity_id(city_id)
  }

  const driverChange = (driver_id) => {
    setDriver_id(driver_id)
  }

  const { loading, error, data } = useQuery(
    ADD_TRUCK_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('AddTruck error', error)

  var partner_info = {}
  var truck_type = []

  if (!loading) {
    const { partner } = data
    partner_info = partner[0] ? partner[0] : { name: 'ID does not exist' }
    truck_type = data.truck_type
  }

  const typeList = truck_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const [insertTruck] = useMutation(
    INSERT_ADD_TRUCK_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (form) => {
    console.log('id', form)
    insertTruck({
      variables: {
        partner_id: partner_info.id,
        city_id: parseInt(city_id, 10),
        length: parseFloat(form.length),
        breadth: parseFloat(form.breadth),
        height: parseFloat(form.height),
        truck_no: (form.truck_no),
        truck_type_id: parseInt(form.truck_type, 10),
        driver_id: driver_id
      }
    })
  }

  return (
    <div>
      <LabelAndData
        smSpan={6}
        data={
          <Link href='/partners/[id]' as={`/partners/${partner_info.cardcode}`}>
            <h1><a>{partner_info.name}</a></h1>
          </Link>
        }
      />
      <Divider />
      <Card size='small' title='Truck Detail' className='mb10'>
        <Form layout='vertical' onFinish={onSubmit}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item
                label='Truck Number'
                name='truck_no'
                rules={[{ required: true, message: 'Truck Number is required field!' }]}
              >
                <Input placeholder='Truck Number' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <CitySelect
                  label='Current City'
                  onChange={onCityChange}
                  required
                  name='city'
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Driver partner_id={partner_info.id} driverChange={driverChange} />
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={6}>
              <Form.Item
                label='Truck Type'
                name='truck_type'
                rules={[{ required: true, message: 'Truck Type is required field' }]}
              >
                <Select style={{ width: 280 }} options={typeList} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Length(Ft)'
                name='length'
                rules={[{ required: true, message: 'Length(Ft) is required field' }]}
              >
                <Input placeholder='Length(Ft)' type='number' disabled={false} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Breadth(Ft)'
                name='breadth'
                rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
              >
                <Input placeholder='Breadth(Ft)' type='number' disabled={false} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Height(Ft)'
                name='height'
                rules={[{ required: true, message: 'Height(Ft) is required field' }]}
              >
                <Input placeholder='Height(Ft)' type='number' disabled={false} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify='end' className='m5'>
            <Space>
              <Button type='primary' htmlType='submit'>Submit</Button>
              <Button>Cancel</Button>
            </Space>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default AddTruck
