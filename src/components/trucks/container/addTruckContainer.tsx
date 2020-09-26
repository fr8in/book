import { useState } from 'react'
import { Row, Col, Card, Input, Button, Form, Space, Select, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { gql, useQuery, useMutation } from '@apollo/client'
import CitySelect from '../../common/citySelect'
import Driver from '../driver'
import get from 'lodash/get'
import { useRouter } from 'next/router'

const ADD_TRUCK_QUERY = gql`
query add_truck ( $cardcode: String!){
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
mutation add_truck($truck_no:String,  $partner_id: Int, $breadth:float8,$length:float8,$height:float8,$city_id:Int,$truck_type_id:Int, $driver_id: Int ) {
  insert_truck(objects: {truck_no: $truck_no,breadth: $breadth, height: $height, length: $length, partner_id: $partner_id,  truck_type_id: $truck_type_id, city_id: $city_id, driver_id: $driver_id, truck_status_id: 5}) {
    returning {
      id
      truck_no
    }
  }
}`

const AddTruckContainer = (props) => {
  const { cardcode } = props
  const [city_id, setCity_id] = useState(null)
  const [driver_id, setDriver_id] = useState(null)
  const router = useRouter()
  const [disableButton, setDisableButton] = useState(false)

  const onCityChange = (city_id) => {
    setCity_id(city_id)
  }

  const driverChange = (driver_id) => {
    setDriver_id(driver_id)
  }

  const { loading, error, data } = useQuery(
    ADD_TRUCK_QUERY,
    {
      variables: { cardcode: cardcode },
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('AddTruck error', error)

  let _data = {}

  if (!loading) {
    _data = data
  }

  const partner_info = get(_data, 'partner[0]', { name: 'ID does not exist' })
  const truck_type = get(_data, 'truck_type', [])

  const typeList = truck_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const [insertTruck] = useMutation(
    INSERT_ADD_TRUCK_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted (data) {
        setDisableButton(false)
        const value = get(data, 'insert_truck.returning', [])
        message.success('Updated!!')
        const url = '/trucks/[id]'
        const as = `/trucks/${value[0].truck_no}`
        router.push(url, as, 'shallow')
      }
    }
  )

  const onSubmit = (form) => {
    setDisableButton(true)
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
    <Card
      title={
        <Link href='/partners/[id]' as={`/partners/${cardcode}`}>
          <h3><a>{partner_info.name}</a></h3>
        </Link>
      }
      size='small'
      className='border-top-blue'
    >
      <Form layout='vertical' onFinish={onSubmit}>
        <h3>Add Truck</h3>
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
            <Link href='/partners/[id]' as={`/partners/${cardcode}`}>
              <Button icon={<LeftOutlined />}>Back</Button>
            </Link>
            <Button type='primary' loading={disableButton} htmlType='submit'>Submit</Button>
          </Space>
        </Row>
      </Form>
    </Card>
  )
}

export default AddTruckContainer
