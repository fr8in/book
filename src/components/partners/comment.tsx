
import { Row, Col, Table, Input, Button,message } from 'antd'
import { useQuery , useMutation} from '@apollo/client'
import { PARTNER_COMMENT_QUERY } from './container/query/partnerCommentQuery'
import { INSERT_PARTNER_COMMENT_MUTATION } from './container/query/updatePartnerCommentMutation'
import React, { useState } from 'react'


const Comment = (props) => {

  const {  partnerId } = props
  const [user, setUser] = useState('')

  const { loading, error, data } = useQuery(
    PARTNER_COMMENT_QUERY,
    {
      variables: { id: partnerId },
      notifyOnNetworkStatusChange: true
    }
  )

  const [InsertComment] = useMutation(
    INSERT_PARTNER_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('PartnerComment error', error)
  console.log('PartnerComment data', data)
  const { partner_comments } = data ? data : []
  const handleChange = (e) => {
    setUser(e.target.value)
  }
  console.log('user',user)

  const onSubmit = () => {
    InsertComment({
      variables: {
        partner_id:partnerId ,
        created_by: "shilpa@fr8.in",
        description : user ,
        topic: 'text',
        created_at : '2020-07-30T20:30:11.287592+00:00'
      }
    })
  }

  const columnsCurrent = [
    {
      title: 'Comment',
      dataIndex: 'description',
      width: '35'
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      width: '35'
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      width: '30'
    }
  ]
  return (
    <div>
      <Row className='p10' gutter={10}>
        <Col xs={24} sm={18}><Input.TextArea value={user}
            onChange={handleChange} placeholder='Please enter comments' /></Col>
        <Col xs={4}><Button type='primary'  onClick={onSubmit} >Submit</Button></Col>
      </Row>
      <Table
        columns={columnsCurrent}
        dataSource={partner_comments}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </div>

  )
}

export default Comment
