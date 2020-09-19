import { Modal, Button, Row, Input, Col, Table, message, Tooltip, Form } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'
import moment from 'moment'

const TRIP_COMMENT_QUERY = gql`
  subscription trip_comment($id: Int!){
    trip(where:{id:{_eq:$id}}) {
      trip_comments(limit:5,order_by:{created_at:desc}){
        id
        description
        created_at
        created_by
      }
    }
  }
`

const INSERT_TRIP_COMMENT_MUTATION = gql`
mutation trip_comment_insert($description:String, $topic:String, $trip_id: Int, $created_by:String ) {
  insert_trip_comment(objects: {description: $description, trip_id: $trip_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
      trip_id
    }
  }
}
`

const Tripcomment = (props) => {
  const { visible, tripid, onHide } = props
  console.log('tripid',tripid)
  const [form] = Form.useForm()

  const { loading, error, data } = useSubscription(
    TRIP_COMMENT_QUERY,
    {
      variables: { id: tripid }
    }
  )

  const [InsertComment] = useMutation(
    INSERT_TRIP_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        form.resetFields()
        onHide()
      }
    }
  )

  if (loading) return null
  console.log('tripComment error', error)

  const onSubmit = (form) => {
    InsertComment({
      variables: {
        trip_id: tripid,
        created_by: 'babu@Fr8Branch.in',
        description: form.comment,
        topic: 'text'
      }
    })
  }

  const { trip_comments } = data && data.trip[0] ? data.trip[0] : []

  const columns = [{
    title: 'Comments',
    dataIndex: 'description',
    width: '40%',
    render: (text, record) => {
      return (
        text && text.length > 20 ? <Tooltip title={text}>{text.slice(0, 20 + '...')}</Tooltip> : text
      )
    }
  },
  {
    dataIndex: 'created_by',
    width: '30%'
  },
  {
    dataIndex: 'created_at',
    width: '30%',
    render: (text, record) => {
      return text ? moment(text).format('DD-MMM-YY') : null
    }
  }]

  return (
    <Modal
      title='Comments'
      visible={visible}
      onCancel={onHide}
      width={700}
      footer={[
        <Button onClick={onHide} key='back'>Close</Button>
      ]}
    >
      <Form onFinish={onSubmit} form={form}>
        <Row className='mb10' gutter={10}>
          <Col xs={24} sm={18}>
            <Form.Item name='comment'>
              <Input.TextArea
                placeholder='Please enter comments'
              />
            </Form.Item>
          </Col>
          <Col xs={4}>
            <Form.Item>
              <Button type='primary' htmlType='submit'>Submit</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        dataSource={trip_comments}
        rowKey={record => record.id}
        size='small'
        pagination={false}
        loading={loading}
      />
    </Modal>
  )
}
export default Tripcomment
