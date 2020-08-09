import {useState} from "react";
import { Row, Col, Card, Input, Button, Form, Divider, Space, Select ,message} from 'antd'
import { City, Trucktype } from '../../../../mock/trucks/addTruck'
import LabelAndData from '../../common/labelAndData'
import Link from 'next/link'
import { gql, useQuery , useMutation } from '@apollo/client'


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
    }
      `
      const INSERT_ADD_TRUCK_MUTATION = gql`
mutation AddTruck($truck_no:String, $mobile:String, $partner_id: Int, $breadth:Int ,$length:Int,$height:Int,$city_id:Int,$truck_status_id:Int ) {
  insert_truck(objects: {truck_no: $truck_no, driver: {data: {mobile: $mobile, partner_id: $partner_id}}, breadth: $breadth, height: $height, length: $length, partner_id: $partner_id, city_id: $city_id, truck_status_id: $truck_status_id}) {
    returning {
      id
      truck_no
    }
  }
}
`

const AddTruck = (props) => {

  const [TruckNo, setTruckNo] = useState('')

  const truckNoChange = (e) => {
    setTruckNo(e.target.value)
  }

  const [length, setlength] = useState('')

  const lengthChange = (e) => {
    setlength(e.target.value)
  }
  const [breadth, setbreadth] = useState('')

  const breadthChange = (e) => {
    setbreadth(e.target.value)
  }

  const [height, setheight] = useState('')

  const heightChange = (e) => {
    setheight(e.target.value)
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  const { loading, error, data } = useQuery
  (ADD_TRUCK_QUERY, 
    {
    notifyOnNetworkStatusChange: true
  })

  console.log('AddTruck error', error)

  var partner_info = {}
  var truck_type = [];

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

  const onSubmit = () => {
    console.log('id')
    
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
        <Form layout='vertical'>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item
                label='Truck Number'
                name='Truck Number'
                rules={[{ required: true, message: 'Truck Number is required field!' }]}
              >
                <Input placeholder='Truck Number' onChange={truckNoChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='Current City'
                name='Current City'
                rules={[{ required: true, message: 'Current City is required field!' }]}
              >
                <Select defaultValue='Chennai' style={{ width: 380 }} onChange={handleChange} options={City} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='Driver Number'
                name='Driver Number'
                rules={[{ required: true, message: 'Driver Number is required field' }]}
              >
                <Input placeholder='Driver Number' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={6}>
              <Form.Item
                label='Truck Type'
                name='Truck Type'
                rules={[{ required: true, message: 'Truck Type is required field' }]}
              >
                <Select defaultValue='10W' style={{ width: 280 }} onChange={handleChange} options={typeList} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Length(Ft)'
                name='Length(Ft)'
                rules={[{ required: true, message: 'Length(Ft) is required field' }]}
              >
                <Input placeholder='Length(Ft)' type='number' disabled={false} onChange={lengthChange}/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Breadth(Ft)'
                name='Breadth(Ft)'
                rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
              >
                <Input placeholder='Breadth(Ft)' type='number' disabled={false} onChange={breadthChange}/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Height(Ft)'
                name='Height(Ft)'
                rules={[{ required: true, message: 'Height(Ft) is required field' }]}
              >
                <Input placeholder='Height(Ft)' type='number' disabled={false} onChange={heightChange}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Row justify='end' className='m5'>
        <Space>
          <Button type='primary' htmlType='submit'>Submit</Button>
          <Button>Cancel</Button>
        </Space>
      </Row>
    </div>
  )
}


export default AddTruck
