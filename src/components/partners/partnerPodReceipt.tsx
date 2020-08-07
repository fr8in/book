import { useState } from 'react'
import { Modal, Input, Button, Form, Row, Col, Select } from 'antd'
import { gql } from '@apollo/client'

const POD_RECEIPT_MUTATION = gql`
mutation trip_pod_receipt($id: Int!, $by_hand_id: Int,$created_by_id: Int, $docket: String, $courier_id: Int, $trip_pod_status_id: Int){
insert_trip_pod_receipt(objects:{by_hand_id:$by_hand_id,created_by_id:$created_by_id,docket: $docket,courier_id: $courier_id}) {
  returning {
      id
    }
  }
  update_trip_by_pk(pk_columns:{id:$id},_set:{trip_pod_status_id:$trip_pod_status_id}) {
    id
    trip_pod_status_id
  }
}
`
const PartnerPodReceipt = (props) => {
  const { visible, onHide } = props
  const listType = [{ label: 'Internal', value: '1' }, { label: 'Courier', value: '2' }]

  const [selectValue, setSelectValue] = useState('1')
  const onChange = (value) => {
    setSelectValue(value)
  }
  return (
    <Modal
      title='Partner Pod Receipt'
      visible={visible}
      onCancel={onHide}
      footer={[
        <Button type='primary' key='submit'>Submit</Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item>
          <Select
            options={listType}
            defaultValue='1'
            onChange={onChange}
          />
        </Form.Item>
        {selectValue === '1'
          ? <Input
            placeholder='contact'
            disabled={false}
          />
          : ''}

      </Form>
    </Modal>
  )
}
export default PartnerPodReceipt
