import { useState } from 'react'
import { Row, Col, Table, Input, Button, message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import moment from 'moment'

const CUSTOMER_COMMENT_SUBSCRIPTION = gql`
  query customer_comment($id: Int!){
    customer(where:{id:{_eq:$id}}) {
      status{
        name
      }
      customer_comments(limit:5,order_by:{created_at:desc}){
        id
        description
        created_at
        created_by
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
  const [userComment, setUserComment] = useState('')

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
      onCompleted () { message.success('Updated!!') }
    }
  )
  console.log('customerComment error', error)
  console.log('customerComment data', data)

  if (loading) return null
  const customer_status_name =  data.customer &&  data.customer[0].status && data.customer[0].status.name 
  const { customer_comments } = data.customer && data.customer[0] ? data.customer[0] : []
  
  console.log('customer_comments',customer_comments)
  console.log('customer_status_name',customer_status_name)

  const handleChange = (e) => {
    setUserComment(e.target.value)
  }

  const onSubmit = () => {
    insertComment({
      variables: {
        customer_id: customer_id,
        created_by: 'shilpa@fr8.in',
        description: userComment,
        topic:customer_status_name
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
      render:(text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    }
  ]
  return (
    <div>
      <Row className='mb10' gutter={10}>
        <Col xs={24} sm={18}>
          <Input.TextArea
            value={userComment}
            onChange={handleChange}
            placeholder='Please enter comments'
          />
        </Col> 
        <Col xs={4}><Button type='primary' onClick={onSubmit}>Submit</Button></Col>
      </Row>
      <Table
        columns={columnsCurrent}
        dataSource={customer_comments}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 500, y: 400 }}
        pagination={false}
      />
    </div>
  )
}

export default customerComment
