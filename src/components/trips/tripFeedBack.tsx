import { useState } from 'react'
import { Modal, Button, Row, Input, Col, Table, message } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'
import moment from 'moment'

const TRIP_COMMENT_QUERY = gql`
  subscription tripComment($id: Int!){
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
mutation TripComment($description:String, $topic:String, $trip_id: Int, $created_by:String ) {
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

  const [userComment, setUserComment] = useState('')
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
        setUserComment('')
        onHide()
      }
    }
  )

  if (loading) return null
  console.log('tripComment error', error)

  const handleChange = (e) => {
    setUserComment(e.target.value)
  }

  const onSubmit = () => {
    InsertComment({
      variables: {
        trip_id: tripid,
        created_by: 'babu@Fr8Branch.in',
        description: userComment,
        topic: 'text'
      }
    })
  }

  const { trip_comments } = data.trip[0] ? data.trip[0] : []

  const columns = [{
    title: 'Comments',
    dataIndex: 'description'
  },
  {
    dataIndex: 'created_by'
  },
  {
    dataIndex: 'created_at',
    render: (text, record) => {
      return text ? moment(text).format('DD MMM YY') : null
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
      <Row gutter={10} className='mb10'>
        <Col flex='auto'>
          <Input.TextArea
            value={userComment}
            onChange={handleChange}
            name='comment'
            placeholder='Please Enter Comments......'
          />
        </Col>
        <Col flex='80px'>
          <Button type='primary' onClick={onSubmit}>Submit</Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={trip_comments}
        rowKey={record => record.id}
        size='small'
        pagination={false}
      />
    </Modal>
  )
}
export default Tripcomment
