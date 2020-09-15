import { useState } from 'react'
import { Timeline, Row, Col, Input, Button, Card, message } from 'antd'
import moment from 'moment'
import { gql, useMutation } from '@apollo/client'

const INSERT_TRIP_COMMENT_MUTATION = gql`
mutation trip_comment($description:String, $topic:String, $trip_id: Int, $created_by:String) {
  insert_trip_comment(objects: {description: $description, trip_id: $trip_id, topic: $topic, created_by: $created_by}) {
    returning {
      id
      description
      trip_id
    }
  }
}
`

const TripComment = (props) => {
  const { trip_id, comments,trip_status } = props

  const [tripComment, setTripComment] = useState('')

  const [insertComment] = useMutation(
    INSERT_TRIP_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const handleChange = (e) => {
    setTripComment(e.target.value)
  }
  console.log('tripComment', tripComment)

  const onSubmit = () => {
    insertComment({
      variables: {
        trip_id: trip_id,
        created_by: 'deva@fr8.in',
        description: tripComment,
        topic: trip_status
      }
    })
  }

  return (
    <Card size='small'>
      <Row>
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
