
import { useState, useContext } from 'react'
import { Modal, Button, Input, Form, Row, Col, Select, message } from 'antd'
import CitySelect from '../common/citySelect'
import { gql, useQuery, useMutation } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'

const CUSTOMER_SEARCH = gql`query cus_search($search:String!){
  search_customer(args:{search:$search}, where:{customer:{status:{name:{_in: ["Active", "In-Active"]}}}}){
    id
    description
  }
  truck_type(where:{active:{_eq:true}}){
    id
    name
  }
}`

const EXCESS_LOAD_MUTATION = gql`
mutation create_excees_load (
  $source_id: Int, 
  $destination_id: Int, 
  $customer_id: Int, 
  $customer_price: Float, 
  $ton: Float,
  $rate_per_ton:Float,
  $is_per_ton:Boolean, 
  $truck_type_id:Int,
  $description:String,
  $topic:String,
  $created_by: String ) {
insert_trip(objects: {
  trip_status_id: 1,
  source_id: $source_id, 
  destination_id: $destination_id, 
  customer_id: $customer_id,
  truck_type_id: $truck_type_id,
  customer_price: $customer_price,
  ton: $ton,
  price_per_ton:$rate_per_ton,
  is_price_per_ton: $is_per_ton
  trip_comments:{
    data:{
      description:$description,
      topic:$topic,
      created_by:$created_by
    }
  }
}) {
  returning {
    id
  }
}
}
`

const CreateExcessLoad = (props) => {
  const initial = { search: '', customer_id: null, source_id: null, destination_id: null, disableButton: false }
  const [obj, setObj] = useState(initial)
  const context = useContext(userContext)

  const { loading, error, data } = useQuery(
    CUSTOMER_SEARCH,
    {
      variables: { search: obj.search || '' }
    }
  )
  console.log('CreateExcessLoad Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const customerSearch = get(_data, 'search_customer', null)
  const truck_type = get(_data, 'truck_type', [])

  const truck_type_list = truck_type && truck_type.map(truck => {
    return ({ value: truck.id, label: truck.name })
  })

  const [create_excess_load] = useMutation(
    EXCESS_LOAD_MUTATION,
    {
      onError (error) {
        console.log('excess error', error)
        message.error(error.toString())
        setObj({ ...obj, disableButton: false })
      },
      onCompleted () {
        message.success('Updated!!')
        setObj(initial)
        props.onHide()
      }
    }
  )

  const onSourceChange = (city_id) => {
    setObj({ ...obj, source_id: city_id })
  }

  const onDestinationChange = (city_id) => {
    setObj({ ...obj, destination_id: city_id })
  }

  const onCusSearch = (value) => {
    setObj({ ...obj, search: value })
  }

  const onCusSelect = (value, customer) => {
    setObj({ ...obj, customer_id: customer.key })
  }

  const onCreateLoad = (form) => {
    setObj({ ...obj, disableButton: true })
    create_excess_load({
      variables: {
        source_id: parseInt(obj.source_id, 10),
        destination_id: parseInt(obj.destination_id, 10),
        customer_id: parseInt(obj.customer_id, 10),
        customer_price: form.price ? parseFloat(form.price) : null,
        ton: form.ton ? parseFloat(form.ton) : null,
        rate_per_ton: form.ton ? Math.floor(form.price / parseFloat(form.ton)) : null,
        is_per_ton: !!form.ton,
        truck_type_id: parseInt(form.truck_type, 10),
        description: form.comment,
        topic: 'Excess Load Created',
        created_by: context.email
      }
    })
  }

  return (
    <Modal
      visible={props.visible}
      title='Create Excess Load'
      onCancel={props.onHide}
      footer={[]}
    >
      <Form layout='vertical' onFinish={onCreateLoad}>
        <Row gutter={10}>
          <Col xs={24}>
            <Form.Item label='Customer' name='customer' rules={[{ required: true }]}>
              <Select
                placeholder='Customer'
                showSearch
                disabled={false}
                onSearch={onCusSearch}
                onChange={onCusSelect}
              >
                {customerSearch && customerSearch.map(_cus => (
                  <Select.Option key={_cus.id} value={_cus.description}>{_cus.description}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={12}>
            <CitySelect
              label='Source'
              onChange={onSourceChange}
              required
              name='source'
            />
          </Col>
          <Col xs={12}>
            <CitySelect
              label='Destination'
              onChange={onDestinationChange}
              required
              name='destination'
            />
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={6}>
            <Form.Item label='Price' name='price'>
              <Input
                placeholder='Price'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item label='Ton' name='ton'>
              <Input
                placeholder='Ton'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item label='Truck Type' name='truck_type' rules={[{ required: true }]}>
              <Select
                placeholder='Truck Type'
                options={truck_type_list}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='Comments' name='comment'>
          <Input.TextArea
            placeholder='Please enter Material Type or Tons'
            disabled={false}
          />
        </Form.Item>
        <Form.Item className='text-right'>
          <Button type='primary' htmlType='submit' loading={obj.disableButton}>Create Load</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateExcessLoad
