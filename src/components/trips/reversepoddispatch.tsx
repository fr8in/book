import { Modal, Button, Input, Row, Form, message, Select } from 'antd'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
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
const TRIP = gql` 
query trip($docket:String){
  trip(where:{trip_pod_dispatch:{docket:{_eq:$docket}}}){
    id
  }
}`

const insert_comment = gql`
mutation insert_comment($object_bool: [trip_comment_insert_input!]!) {
  insert_trip_comment(objects: $object_bool) {
    returning {
      id
    }
  }
}`

const Reversepoddispatch = (props) => {
  const { visible, onHide } = props
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
            description: `${form.getFieldValue('docket_no')} Changed by ${context.email}`,
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


  const [getTrip_id, { data, loading, refetch }] = useLazyQuery(TRIP, {
    variables: {
      docket: form.getFieldValue('docket_no')
    },
    onCompleted() {
      refetch()
    }
  }
  )


  let _trip = []
  if (!loading) {
    _trip = get(data, 'trip', null)
  }
  const tripList = !isEmpty(data) ? _trip.map((data) => {
    return { value: data.id, label: data.id }
  }) : []

  const trip_id = () => {
    if (form.getFieldValue('docket_no')) {
      getTrip_id({ variables: { docket: form.getFieldValue('docket_no') } })
    } else return null
  }

  const handleChange = (value) => {
    Number(value)
  }

  const onChange = (form) => {
    setDisableButton(true)
    updateReversepoddispatch({
      variables: {
        trip_id: form.trip_id
      }
    })
  }

  return (
    <Modal
      title='Reverse POD Dispatch'
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
      <Form layout='vertical' onFinish={onChange} form={form}>
        <Form.Item label='Docket No' name='docket_no' >
          <Input placeholder='Enter the Docket No' onBlur={trip_id} />
        </Form.Item>
        <Form.Item label='Trip ID' name='trip_id' >
          <Select options={tripList} mode="multiple" onChange={handleChange} />
        </Form.Item>
        <Row justify='end'>
          <Button type='primary' loading={disableButton} htmlType='submit'>Reverse</Button>
        </Row>
      </Form>
    </Modal>
  )
}
export default Reversepoddispatch
