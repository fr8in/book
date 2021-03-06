import { useContext, useState } from 'react'
import { Row, Col, Table, Input, Button, message, Form } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'
import moment from 'moment'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'

const CUSTOMER_COMMENT_SUBSCRIPTION = gql`
  subscription customer_comment($id: Int!, $limit: Int){
    customer(where:{id:{_eq:$id}}) {
      status{
        name
      }
      customer_comments(limit:$limit,order_by:{created_at:desc}){
        id
        topic
        description
        created_at
        created_by
      }
    }
  }
`
const INSERT_CUSTOMER_COMMENT_MUTATION = gql`
  mutation customer_comment_insert($description:String, $topic:String, $customer_id: Int, $created_by:String ) {
    insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by:$created_by}) {
      returning {
        description
        customer_id
      }
    }
  }
`
const customerComment = (props) => {
  const { customer_id,detailPage } = props
  const context = useContext(userContext)
  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)

  const { loading, error, data } = useSubscription(
    CUSTOMER_COMMENT_SUBSCRIPTION,
    {
      variables: {
         id: customer_id,
         limit: detailPage ? 100 : 5
       }
    }
  )

  const [insertComment] = useMutation(
    INSERT_CUSTOMER_COMMENT_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
         message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )


  let _data = {}
  if (!loading) {
    _data = data
  }
  const customer_status_name = get(_data, 'customer[0].status.name', null)
  const customer_comments = get(_data, 'customer[0].customer_comments', [])

  const onSubmit = (form) => {
    setDisableButton(true)
    insertComment({
      variables: {
        customer_id: customer_id,
        created_by: context.email,
        description: form.comment,
        topic: customer_status_name
      }
    })
  }

  const columnsCurrent = [
    detailPage ? {
      title: 'Topic',
      dataIndex: 'topic',
      width: '15%'
    } : {},
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
              <Button type='primary' loading={disableButton} htmlType='submit'>Submit</Button>
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
