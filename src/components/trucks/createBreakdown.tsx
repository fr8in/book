import { Modal, Button, Row, Col, DatePicker, Select, Input, Form, Radio , message} from 'antd'
import { useMutation, gql } from '@apollo/client'


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
  const { visible, onHide ,truck_id} = props

  const [insertUpdateCreateBreakdown] = useMutation(
    INSERT_UPDATE_CREATE_BREAKDOWN_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onCreateBreakdown = () => {
    console.log('truck_id',truck_id)
  }

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  return (
    <Modal
      title={props.title}
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button key='back' onClick={onHide}>Close</Button>,
        <Button type='primary' key='submit' onClick={onCreateBreakdown}>Save</Button>
      ]}
    >
      <Form layout='vertical'>
        {props.radioType &&
          <Row>
            <Form.Item>
              <Radio.Group>
                <Radio value={1}>Breakdown</Radio>
                <Radio value={0}>In-transit haulting</Radio>
              </Radio.Group>
            </Form.Item>
          </Row>}
        <Row gutter={10}>
          <Col xs={12}>
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
          <Col xs={12}>
            <Form.Item label='Current City'>
              <Select defaultValue='Chennai' onChange={handleChange}>
                <Option value='Coimbatore'>Coimbatore</Option>
                <Option value='Madurai'>Madurai</Option>
                <Option value='Trichy'>Trichy</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <TextArea
              placeholder='Enter Comment'
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreateBreakdown
