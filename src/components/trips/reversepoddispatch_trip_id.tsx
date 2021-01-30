import {  Button, Input, Row, Form, message} from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState, useContext, } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const UPDATE_REVERSE_POD_DISPATCH = gql`
mutation ReversePodDispatch ($trip_id:[Int!]){
  update_trip(_set:{pod_dispatched_at:null}where:{trip_pod_dispatch:{trip_id:{_in:$trip_id}}}){
    returning{
      id
    }
  }
  delete_trip_pod_dispatch(where:{trip_id:{_in:$trip_id}}){
    returning{
      id
    }
  }
}
`
const insert_comment = gql`
mutation insert_comment($object_bool: [trip_comment_insert_input!]!) {
  insert_trip_comment(objects: $object_bool) {
    returning {
      id
    }
  }
}`

const Reverse_Trip_Id= (props) => {
  const { onHide } = props
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
  const [form] = Form.useForm()

  const [insertcomment] = useMutation(
    insert_comment
  )

  const [updateReversepoddispatch] = useMutation(
    UPDATE_REVERSE_POD_DISPATCH,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted(data) {
        setDisableButton(false)
        message.success('Reverse!!')
        onHide()
        const trip_id = get(data, 'update_trip.returning', [])
        const commentList = !isEmpty(data) ? trip_id.map((data) => {
          return {
            created_by: context.email,
            description: `Docket No Changed by ${context.email}`,
            topic: "Reverse Docket No",
            trip_id: data.id
          }
        }) : []
        insertcomment({
          variables: {
            object_bool: commentList
          }
        })
      }
    }
  )

  const onChange = (form) => {
    setDisableButton(true)
    updateReversepoddispatch({
      variables: {
        trip_id: form.trip_id
      }
    })
  }

  return (
      <Form layout='vertical' onFinish={onChange} form={form}>
        <Form.Item label='Trip ID' name='trip_id' rules={[{ required: true,message: 'Trip Id required!'  }]} >
          <Input placeholder='Enter the Trip Id'/>
        </Form.Item>
        <Row justify='end'>
          <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>Reverse</Button>
        </Row>
      </Form>
  )
}
export default Reverse_Trip_Id
