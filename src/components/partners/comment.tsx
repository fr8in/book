import { Row, Col, Table, Input, Button, message, Form } from 'antd'
import { gql, useMutation, useSubscription } from '@apollo/client'
import moment from 'moment'
import { useContext, useState } from 'react'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'

const PARTNER_COMMENT_SUBSCRIPTION = gql`
  subscription partner_comment($id: Int!, $limit: Int){
    partner(where:{id:{_eq:$id}}) {
      partner_status{
        name
      }
      partner_comments(limit:$limit,order_by:{created_at:desc}){
        id
        topic
        description
        created_at
        created_by
      }
    }
  }
`
const INSERT_PARTNER_COMMENT_MUTATION = gql`
  mutation partner_comment_insert($description:String, $topic:String, $partner_id: Int, $created_by:String ) {
    insert_partner_comment(objects: {description: $description, partner_id: $partner_id, topic: $topic, created_by:$created_by}) {
      returning {
        description
        partner_id
      }
    }
  }
`
const Comment = (props) => {
  const { partner_id, onHide, detailPage } = props
  const context = useContext(userContext)
  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)

  const { loading, error, data } = useSubscription(
    PARTNER_COMMENT_SUBSCRIPTION,
    {
      variables: {
        id: partner_id,
        limit: detailPage ? 100 : 5
      }
    }
  )

  const [insertComment] = useMutation(
    INSERT_PARTNER_COMMENT_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        form.resetFields()
        if (onHide) { onHide() }
      }
    }
  )
  console.log('PartnerComment error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const partner_status_name = get(_data, 'partner[0].partner_status.name', null)
  const partner_comments = get(_data, 'partner[0].partner_comments', [])

  const onSubmit = (form) => {
    setDisableButton(true)
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
    detailPage ? {
      title: 'Topic',
      dataIndex: 'topic',
      width: '15%'
    } : {},
    {
      title: 'Comment',
      dataIndex: 'description',
      width: detailPage ? '40%' : '45%'
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      width: detailPage ? '25%' : '30%'
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      width: '25%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY HH:mm') : null
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
        dataSource={partner_comments}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 500, y: 400 }}
        pagination={false}
        loading={loading}
      />
    </div>
  )
}

export default Comment
