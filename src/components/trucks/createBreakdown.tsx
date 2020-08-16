import { Modal, Button, Row, Col, DatePicker, Select, Input, Form, Radio, message, Table } from 'antd'
import { useMutation, gql } from '@apollo/client'
import moment from 'moment'

const INSERT_UPDATE_CREATE_BREAKDOWN_MUTATION = gql`
mutation truck_available($truck_id:Int,$topic:String,$created_by_id:Int,$description:String,$id:Int!,$available_at:timestamptz,$city_id:Int) {
  insert_truck_comment(objects: {truck_id:$truck_id, topic:$topic, created_by_id:$created_by_id, description:$description}) {
    returning {
      id
      topic
      description
      truck_id
    }
  }
  update_truck_by_pk(pk_columns: {id:$id}, _set: {available_at:$available_at, city_id:$city_id}) {
    id
    city_id
    available_at
  }
}
`

const { Option } = Select
const { TextArea } = Input

const CreateBreakdown = (props) => {
  const { visible, onHide, truck_id } = props

  const [insertUpdateCreateBreakdown] = useMutation(
    INSERT_UPDATE_CREATE_BREAKDOWN_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        onHide()
      }
    }
  )

  const onCreateBreakdown = () => {
    console.log('truck_id', truck_id)
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
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    }
  ]

  return (
    <div>
      <Modal
        title={props.title}
        width={700}
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button key='back' onClick={onHide}>Close</Button>,
          <Button type='primary' key='submit' onClick={onCreateBreakdown}>Save</Button>
        ]}
      >
        <Form layout='vertical'>
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
              <Form.Item label='Current City'>
                <Select defaultValue='Chennai'>
                  <Option value='Coimbatore'>Coimbatore</Option>
                  <Option value='Madurai'>Madurai</Option>
                  <Option value='Trichy'>Trichy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name='comment'>
            <TextArea
              placeholder='Enter Comment'
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
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
