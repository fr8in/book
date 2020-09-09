import { Row, Col, Modal, Form, Button, Input, message, Table, Tooltip } from 'antd'
import { gql, useMutation, useSubscription } from '@apollo/client'
import moment from 'moment'

const TRUCK_COMMENT = gql`
subscription truck_coment($id: Int!){
  truck(where:{id:{_eq:$id}}){
    truck_status{
      id
      name
    }
    last_comment{
      topic
      description
      id
      created_at
      created_by
    }
  }
}
`
const INSERT_TRUCK_COMMENT_MUTATION = gql`
mutation TruckComment($description:String, $topic:String, $truck_id: Int, $created_by_id:Int ) {
  insert_truck_comment(objects: {description: $description, truck_id: $truck_id, topic: $topic, created_by_id: $created_by_id}) {
    returning {
      id
      description
      truck_id
    }
  }
}
`
const TruckComment = (props) => {
  const { visible, onHide, id } = props

  const [form] = Form.useForm()

  const { loading, data, error } = useSubscription(
    TRUCK_COMMENT, { variables: { id } }
  )

  let truck_status = null
  let comments = []
  if (!loading) {
    const { truck } = data
    truck_status = truck && truck[0] ? truck[0].truck_status : null
    comments = truck && truck[0] ? truck[0].truck_comments : []
  }

  const [insertComment] = useMutation(
    INSERT_TRUCK_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )

  const onSubmit = (form) => {
    console.log('id', id)
    insertComment({
      variables: {
        truck_id: id,
        created_by_id: 115,
        description: form.comment,
        topic: truck_status.name
      }
    })
  }

  const columns = [{
    title: 'Comments',
    dataIndex: 'description',
    width: '40%',
    render: (text, record) => {
      return (
        text && text.length > 20 ? <Tooltip title={text}><span>{text.slice(0, 20) + '...'}</span></Tooltip> : text
      )
    }
  },
  {
    dataIndex: 'created_by_id',
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
    <>
      <Modal
        title='Add Comment'
        visible={visible}
        onCancel={onHide}
        footer={[]}
      >
        <Form onFinish={onSubmit} form={form}>
          <Row gutter={10} className='mb10'>
            <Col flex='auto'>
              <Form.Item name='comment'>
                <Input.TextArea
                  placeholder='Please Enter Comments......'
                />
              </Form.Item>
            </Col>
            <Col flex='80px'>
              <Form.Item>
                <Button type='primary' htmlType='submit'>Submit</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={comments}
          rowKey={record => record.id}
          size='small'
          pagination={false}
        />
      </Modal>
    </>
  )
}

export default TruckComment
