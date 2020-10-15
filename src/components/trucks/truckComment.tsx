import { Row, Col, Modal, Form, Button, Input, message, Table, Tooltip } from 'antd'
import { gql, useMutation, useSubscription } from '@apollo/client'
import moment from 'moment'
import { useContext, useState } from 'react'
import userContext from '../../lib/userContaxt'

const TRUCK_COMMENT = gql`
subscription truck_comment($id: Int!){
  truck(where:{id:{_eq:$id}}){
    truck_status{
      id
      name
    }
    truck_comments(limit:5, order_by:{created_at:desc}){
      id
      description
      topic
    	created_at
      created_by_id
      created_by
    }
  }
}
`
const INSERT_TRUCK_COMMENT_MUTATION = gql`
mutation insert_truck_comment($description:String, $topic:String, $truck_id: Int, $created_by:String ) {
  insert_truck_comment(objects: {description: $description, truck_id: $truck_id, topic: $topic, created_by: $created_by}) {
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
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)

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
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        form.resetFields()
        onHide()
      }
    }
  )

  const onSubmit = (form) => {
    setDisableButton(true)
    console.log('id', id)
    insertComment({
      variables: {
        truck_id: id,
        created_by: context.email,
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
                <Button type='primary' loading={disableButton} htmlType='submit'>Submit</Button>
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
