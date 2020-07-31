import { Modal, Button, Row, Input, Col, Table,message } from 'antd'
import { useQuery,useMutation } from '@apollo/client'
import { TRIP_COMMENT_QUERY } from './containers/query/tripCommentQuery'
import { INSERT_TRIP_COMMENT_MUTATION} from './containers/query/tripCommentMutation'
import React,{useState} from 'react'

const Tripcomment = (props) => {
  const { visible, tripid, onHide } = props
  
  const [user, setUser] = useState('')
  const { loading, error, data } = useQuery(
    TRIP_COMMENT_QUERY,
    {
      variables: { id: tripid },
      notifyOnNetworkStatusChange: true
    }
  )
 
  const [InsertComment] = useMutation(
    INSERT_TRIP_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('tripComment error', error)
  console.log('tripComment data', data.trip)

  const handleChange = (e) =>{
    setUser(e.target.value)
  }
  
  const onSubmit = () => {
    InsertComment({
      variables: {
        trip_id : tripid,
        created_by : 'babu@Fr8Branch.in',
        description:user ,
        topic : 'text',
      }
    })
  }

  const { trip_comments } = data.trip[0] ? data.trip[0] : []

  const columns = [{
    title: 'Previous Comments',
    dataIndex: 'description'
  },
  {
    dataIndex: 'created_by'
  },
  {
    dataIndex: 'created_at'
  }]

  return (
    <Modal
      title='Comments'
      visible={visible}
      onCancel={onHide}
    >
      <Row gutter={10} className='mb10'>
        <Col flex='auto'>
          <Input.TextArea
          value={user}
          onChange = {handleChange}
            name='comment'
            placeholder='Please Enter Comments......'
          />
        </Col>
        <Col flex='80px'>
          <Button type='primary' onClick={onSubmit} >Submit</Button>
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
