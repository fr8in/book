import { Modal, Button, Row, Col, DatePicker, Space, Input, Form, Radio, message, Table } from 'antd'
import { useMutation, gql, useQuery } from '@apollo/client'
import moment from 'moment'
import { useState,useContext } from 'react'
import CitySelect from '../common/citySelect'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'

const CREATE_BREAKDOWN = gql`
query create_breakdown($id: Int!){
  truck(where:{id:{_eq:$id}}){
    truck_status{
      id
      name
    }
  }
}
`

const INSERT_UPDATE_CREATE_BREAKDOWN_MUTATION = gql`
mutation truck_available($truck_id:Int!,$topic:String,$created_by:String,$description:String,$id:Int!,$available_at:timestamptz,$city_id:Int,$updated_by: String!) {
  insert_truck_comment(objects: {truck_id:$truck_id, topic:$topic, created_by:$created_by, description:$description}) {
    returning {
      id
      topic
      description
      truck_id
    }
  }
  update_truck_by_pk(pk_columns: {id:$id}, _set: {available_at:$available_at, city_id:$city_id,updated_by:$updated_by}) {
    id
    city_id
    available_at
  }
}
`
const { TextArea } = Input

const CreateBreakdown = (props) => {
  const { visible, onHide, id } = props

  const initial = { city_id: null }
  const context = useContext(userContext)
  const [city, setCity] = useState(initial)
  const [disableButton, setDisableButton] = useState(false)

  const { loading, data, error } = useQuery(
    CREATE_BREAKDOWN, { variables: { id } }
  )

  console.log('CreateBreakdown Error', error)

  let _data = {}

  if (!loading) {
    _data = data
  }
  const truck_info = get(_data, 'truck[0]', { name: 'ID does not exist' })

  const truck_status = truck_info && truck_info.truck_status && truck_info.truck_status.name
  console.log('truck_status', truck_status)

  const [insertUpdateCreateBreakdown] = useMutation(
    INSERT_UPDATE_CREATE_BREAKDOWN_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        onHide()
      }
    }
  )

  const onCityChange = (city_id) => {
    setCity({ ...city, city_id: city_id })
  }

  const onCreateBreakdown = (form) => {
    setDisableButton(true)
    console.log('id', id, city)
    insertUpdateCreateBreakdown({
      variables: {
        truck_id: id,
        id: id,
        created_by: context.email,
        updated_by: context.email,
        description: form.comment,
        topic: truck_status,
        city_id: parseInt(city.city_id, 10)
      }
    })
  }

  const columnsCurrent = [
    {
      title: 'Available Date',
      dataIndex: 'description',
      width: '20%'
    },
    {
      title: 'City',
      dataIndex: 'description',
      width: '10%'
    },
    {
      title: 'Comment',
      dataIndex: 'description',
      width: '30%'
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      width: '20%'
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      width: '20%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
    }
  ]

  return (
    <div>
      <Modal
        title={props.title}
        width={700}
        visible={visible}
        onCancel={onHide}
        footer={null}
      >
        <Form layout='vertical' onFinish={onCreateBreakdown}>
          {props.radioType &&
            <Form.Item name='type'>
              <Radio.Group>
                <Radio value={1}>Breakdown</Radio>
                <Radio value={0}>In-transit halting</Radio>
              </Radio.Group>
            </Form.Item>}
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item label='Available Date'>
                <DatePicker
                  showTime
                  name='selectSearchDate'
                  format='YYYY-MM-DD'
                  placeholder='Select Date'
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col sm={12}>
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
          <Form.Item name='comment'>
            <TextArea
              placeholder='Enter Comment'
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Row justify='end'>
            <Form.Item>
              <Space>
                <Button key='back' onClick={onHide}>Close</Button>
                <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>Save</Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
        {props.comments && (
          <Table
            columns={columnsCurrent}
            rowKey={record => record.id}
            size='small'
            scroll={{ x: 500, y: 400 }}
            pagination={false}
          />)}
      </Modal>

    </div>
  )
}

export default CreateBreakdown
