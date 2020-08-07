import { useState } from 'react'
import { Modal, Input, Button, Form, Select, Tag } from 'antd'
import { gql } from '@apollo/client'

const POD_RECEIPT_MUTATION = gql`
mutation trip_pod_receipt($objects: [trip_pod_receipt_insert_input!]!) {
insert_trip_pod_receipt(objects: $objects) {
  returning {
      id
    }
  }
  update_trip_by_pk(pk_columns:{id:$id},_set:{trip_pod_status_id:$trip_pod_status_id}) {
    id
    trip_pod_status_id
  }
}
# {by_hand_id:$by_hand_id,created_by_id:$created_by_id,docket: $docket,courier_id: $courier_id}
`
const PartnerPodReceipt = (props) => {
  const { visible, onHide, trip_ids, onRemoveTag } = props
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
        {selectValue === '1' ? (
          <Input
            placeholder='contact'
            disabled={false}
          />)
          : ''}
        {trip_ids && trip_ids.length > 0
          ? trip_ids.map((data, i) => {
            return (
              <Tag
                key={i}
                style={{
                  backgroundColor: '#007dfe',
                  marginBottom: 2,
                  color: 'white'
                }}
                closable={data !== 0} onClose={() => onRemoveTag(data)}
              >
                {data}
              </Tag>
            )
          }
          ) : <div />}
      </Form>
    </Modal>
  )
}
export default PartnerPodReceipt
