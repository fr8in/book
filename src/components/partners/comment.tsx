
import { useState } from 'react'
import { Row, Col, Table, Input, Button, message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import moment from 'moment'

const PARTNER_COMMENT_QUERY = gql`
  query partnerComment($id: Int!){
    partner(where:{id:{_eq:$id}}) {
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
mutation PartnerComment($description:String, $topic:String, $partner_id: Int, $created_by:String ) {
  insert_partner_comment(objects: {description: $description, partner_id: $partner_id, topic: $topic, created_by: "shilpa@fr8.in"}) {
    returning {
      description
      partner_id
    }
  }
}
`
const Comment = (props) => {
  const { partnerId } = props
  const [userComment, setUserComment] = useState('')

  const { loading, error, data } = useQuery(
    PARTNER_COMMENT_QUERY,
    {
      variables: { id: partnerId },
      notifyOnNetworkStatusChange: true
    }
  )

  const [insertComment] = useMutation(
    INSERT_PARTNER_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('PartnerComment error', error)
  console.log('PartnerComment data', data)
  const { partner_comments } = data.partner && data.partner[0] ? data.partner[0] : []
  const handleChange = (e) => {
    setUserComment(e.target.value)
  }
  console.log('userComment', userComment)

  const onSubmit = () => {
    insertComment({
      variables: {
        partner_id: partnerId,
        created_by: 'shilpa@fr8.in',
        description: userComment,
        topic: 'text'
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
