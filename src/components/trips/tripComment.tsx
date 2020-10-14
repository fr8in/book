import { useState, useContext } from 'react'
import { Timeline, Row, Col, Input, Button, Card, message } from 'antd'
import moment from 'moment'
import { gql, useMutation, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'

const TRIP_COMMENTS = gql`
subscription trip_comments($id: Int!) {
  trip(where: {id: {_eq: $id}}, order_by: {created_at: asc}) {
    trip_comments {
      id
      description
      topic
      created_by
      created_at
    }
  }
}
`

const INSERT_TRIP_COMMENT_MUTATION = gql`
mutation trip_comment_insert($description:String, $topic:String, $trip_id: Int, $created_by:String) {
  insert_trip_comment(objects: {description: $description, trip_id: $trip_id, topic: $topic, created_by: $created_by}) {
    returning {
      id
      description
      trip_id
    }
  }
}`

const TripComment = (props) => {
  const { trip_id, trip_status } = props
  const context = useContext(userContext)
  const [tripComment, setTripComment] = useState('')

  const { loading, data, error } = useSubscription(
    TRIP_COMMENTS,
    {
      variables: { id: trip_id }
    }
  )

  const [insertComment] = useMutation(
    INSERT_TRIP_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  console.log('TripComment Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const comments = get(_data, 'trip[0].trip_comments', [])
  const handleChange = (e) => {
    setTripComment(e.target.value)
  }
  console.log('tripComment', comments)

  const onSubmit = () => {
    insertComment({
      variables: {
        trip_id: trip_id,
        created_by: context.email,
        description: tripComment,
        topic: trip_status
      }
    })
  }

  return (
    <Card size='small'>
      <Row className='scroll-box mb10 pt10'>
        <Col xs={24} className='timeLine'>
          {comments && comments.length > 0
            ? comments.map((comments, i) => {
              return (
                <Timeline key={i}>
                  <Timeline.Item>
                    <h4>{comments.topic}</h4>
                    <Row>
                      <Col xs={24}>
                        <span>{comments.description}</span>
                        <span className='pull-right'>
                          {comments.created_by}
                        </span>
                      </Col>
                      <Col xs={24}>
                        <span className='pull-right'>
                          {moment(comments.created_at).format(
                            'YYYY-MM-DD HH:mm')}
                        </span>
                      </Col>
                    </Row>
                  </Timeline.Item>
                </Timeline>
              )
            })
            : null}
        </Col>
      </Row>
      <Row gutter={10}>
        <Col flex='auto'>
          <Input
            id='comment'
            name='comment'
            placeholder='Enter Comments......'
            type='textarea'
            onChange={handleChange}
          />
        </Col>
        <Col flex='80px'>
          <Button onClick={onSubmit} type='primary'>Submit</Button>
        </Col>
      </Row>
    </Card>
  )
}

export default TripComment
