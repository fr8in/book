import { Modal, Button, Input, Row, Form, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'

const UPDATE_REVERSE_POD_DISPATCH = gql`
mutation ReversePodDispatch ($trip_id:Int,){
    update_trip(where:{id:{_eq:$trip_id}}_set:{pod_dispatched_at:null}){
      returning{
        id
      }
    }
    delete_trip_pod_dispatch(where:{trip_id:{_eq:$trip_id}}){
      returning{
        id
      }
    }
  }
`
const Reversepoddispatch = (props) => {
  const { visible, onHide } = props
  const [disableButton, setDisableButton] = useState(false)

  const [updateReversepoddispatch] = useMutation(
    UPDATE_REVERSE_POD_DISPATCH,
    {
      onError (error) {
        setDisableButton(false)
         message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Reverse!!')
        onHide()
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
    <Modal
      title='Reverse POD Dispatch'
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
      <Form layout='vertical' onFinish={onChange}>
        <Form.Item label='Trip ID' name='trip_id' rules={[{ required: true, message: 'Trip Id Required!' }]}>
          <Input placeholder='Enter the Trip Id' />
        </Form.Item>
        <Row justify='end'>
          <Button type='primary' loading={disableButton} htmlType='submit'>Reverse</Button>
        </Row>
      </Form>
    </Modal>
  )
}
export default Reversepoddispatch
