import { Row, Col, Table, Input, Button, message, Form } from 'antd'
import { gql, useMutation, useSubscription } from '@apollo/client'
import moment from 'moment'
import { useContext } from 'react'
import userContext from '../../lib/userContaxt'

const PARTNER_COMMENT_SUBSCRIPTION = gql`
  subscription partner_comment($id: Int!){
    partner(where:{id:{_eq:$id}}) {
      partner_status{
        name
      }
      partner_comments(limit:5,order_by:{created_at:desc}){
        id
        description
        created_at
        created_by
      }
    }
  }
`
const INSERT_PARTNER_COMMENT_MUTATION = gql`
  mutation partner_comment($description:String, $topic:String, $partner_id: Int, $created_by:String ) {
    insert_partner_comment(objects: {description: $description, partner_id: $partner_id, topic: $topic, created_by:$created_by}) {
      returning {
        description
        partner_id
      }
    }
  }
`
const Comment = (props) => {
  const { partner_id } = props
  const context = useContext(userContext)
  const [form] = Form.useForm()

  const { loading, error, data } = useSubscription(
    PARTNER_COMMENT_SUBSCRIPTION,
    {
      variables: { id: partner_id }
    }
  )

  const [insertComment] = useMutation(
    INSERT_PARTNER_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )
  console.log('PartnerComment error', error)

  if (loading) return null
  const partner_status_name = data.partner && data.partner[0].partner_status && data.partner[0].partner_status.name
  const { partner_comments } = data.partner && data.partner[0] ? data.partner[0] : []

  const onSubmit = (form) => {
    insertComment({
      variables: {
        partner_id: partner_id,
        created_by: context.email,
        description: form.comment,
        topic: partner_status_name
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
        dataSource={partner_comments}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 500, y: 400 }}
        pagination={false}
      />
    </div>
  )
}

export default Comment
