import { Row, Col, Form, Input, Button, Select, Space, Card, message } from 'antd'
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import get from 'lodash/get'
const { Option } = Select

const PARTNER_SEARCH = gql`
query par_search($search:String!){
  search_partner(args:{search:$search}, where:{partner:{partner_status:{name:{_eq:"Active"}}}}){
    id
    description
  }
}
`
const PARTNER_TRUCK_NO_QUERY = gql`
query partner($partner_id:Int){
  partner(where:{id:{_eq:$partner_id}}){
    name
    trucks{
      truck_no
      id
    }
  }
}
`
const ADD_FASTAG_MUTATION = gql`
mutation add_tag($truckId:Int!,$createdBy:String!,$tagId:String!,$partnerId:Int!,$truckNo:String!){
  add_fastag(truck_id:$truckId,created_by:$createdBy,tag_id:$tagId,partner_id:$partnerId,truck_no:$truckNo){ status
    description
}}
`
const AddFastagContainer = () => {
  const initial = { search: '', partner_id: null }
  const [obj, setObj] = useState(initial)
  const [truck_id, setTruck_id] = useState('')
  const { loading, error, data } = useQuery(
    PARTNER_SEARCH,
    {
      variables: { search: obj.search || '' }
    }
  )

  console.log('AddFastag Error', error)
  console.log('AddFastag Data', data)

  const [getTrucks, { loading: truckLoading, data: truckList }] = useLazyQuery(
    PARTNER_TRUCK_NO_QUERY
  )

  const [AddFastag] = useMutation(
    ADD_FASTAG_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const partnerSearch = get(_data, 'search_partner', null)

  const onParSearch = (value) => {
    setObj({ ...obj, search: value })
  }
  const onParSelect = (value, partner) => {
    console.log('partner.key', partner.key)
    setObj({ ...obj, partner_id: parseInt(partner.key, 10) })
    getTrucks({
      variables: { partner_id: parseInt(partner.key, 10) }
    })
  }
  console.log('TruckList', truckList)

  const onTruckNoSelect = (value, truck) => {
    console.log('truck.key', truck.key)
    setTruck_id(truck.key)
  }

  const onChange = (form) => {
    AddFastag({
      variables: {
        truckId: parseInt(truck_id, 10),
        tagId: form.tag_id,
        truckNo: form.truck_no,
        partnerId: obj.partner_id,
        createdBy: 'pravalika.k@fr8.in'
      }
    })
  }

  return (
    <Card size='small' title='Add FasTag' className='border-top-blue'>
      <Row justify='center'>
        <Col xs={24} sm={12} md={8}>
          <Form layout='vertical' onFinish={onChange}>
            <Form.Item
              name='tag_id'
              label='Tag Id'
              rules={[{ required: true }]}
            >
              <Input placeholder='Tag Id' />
            </Form.Item>
            <Form.Item
              name='confirm_tag_id'
              label='Confirm Tag Id'
              rules={[{ required: true }]}

            >
              <Input placeholder='Confirm Tag Id' />
            </Form.Item>
            <Form.Item
              name='partner_id'
              label='Partner'
              rules={[{ required: true }]}
            >
              <Select
                placeholder='Select Partner'
                showSearch
                disabled={false}
                onSearch={onParSearch}
                onChange={onParSelect}
              >
                {partnerSearch && partnerSearch.map(_par => (
                  <Select.Option
                    key={_par.id}
                    value={_par.description}
                  >{_par.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='truck_no'
              label='Truck Number'
              rules={[{ required: true }]}
            >
              <Select
                placeholder='Select Truck'
                allowClear
                showSearch
                onChange={onTruckNoSelect}
              >
                {truckList && truckList.partner[0] && truckList.partner[0].trucks.map(truck => (
                  <Select.Option key={truck.id} value={truck.truck_no}>
                    {truck.truck_no}
                  </Select.Option>
                ))}

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

export default AddFastagContainer
