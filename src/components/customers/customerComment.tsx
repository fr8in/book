import { Row, Col, Table, Input, Button, message, Form } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import moment from 'moment'
import get from 'lodash/get'

const CUSTOMER_COMMENT_SUBSCRIPTION = gql`
  query customer_comment($id: Int!){
    customer(where:{id:{_eq:$id}}) {
      status{
        name
      }
      last_comment{
        id
        customer_id
        created_at
        created_by
        description
      }
    }
  }
`
const INSERT_CUSTOMER_COMMENT_MUTATION = gql`
  mutation customer_comment($description:String, $topic:String, $customer_id: Int, $created_by:String ) {
    insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by:$created_by}) {
      returning {
        description
        customer_id
      }
    }
  }
`
const customerComment = (props) => {
  const { customer_id } = props

  const [form] = Form.useForm()

  const { loading, error, data } = useQuery(
    CUSTOMER_COMMENT_SUBSCRIPTION,
    {
      variables: { id: customer_id },
      notifyOnNetworkStatusChange: true
    }
  )

  const [insertComment] = useMutation(
    INSERT_CUSTOMER_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )
  console.log('customerComment error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }
  const customer_status_name = get(_data, 'customer[0].status.name', null)
  const customer_comments = get(_data, 'customer[0].customer_comments', [])

  const onSubmit = (form) => {
    insertComment({
      variables: {
        customer_id: customer_id,
        created_by: 'shilpa@fr8.in',
        description: form.comment,
        topic: customer_status_name
      }
    })
  }

  const columnsCurrent = [
    {
      title: 'Comment',
      dataIndex: 'description',
      width: '45%'
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      width: '35%'
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
        columns={columnsCurrent}
        dataSource={customer_comments}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 500, y: 400 }}
        pagination={false}
        loading={loading}
      />
    </div>
  )
}

export default customerComment
