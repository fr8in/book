import { useState } from 'react'
import { Modal, Input, Radio, Button, Form, Select, Tag } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'

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
const ALL_EMP_AND_COURIER = gql`
 query emp_courier {
  employee {
    id
    email
  }
  courier {
    id
    name
  }
}
`
const PartnerPodReceipt = (props) => {
  const { visible, onHide, trip_ids, onRemoveTag } = props
  const listType = [{ label: 'Internal', value: '1' }, { label: 'Courier', value: '2' }]

  const [selectValue, setSelectValue] = useState('1')

  const { loading, error, data } = useQuery(ALL_EMP_AND_COURIER, {
    notifyOnNetworkStatusChange: true
  })

  console.log('PartnerPodReceipt error', error)

  if (loading) return null
  const employee = data.employee
  const courier = data.courier

  const emp_list = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

  const courier_list = courier.map((data) => {
    return { value: data.id, label: data.name }
  })

  const onChange = (e) => {
    setSelectValue(e.target.value)
  }

  const onSetDocket = (e) => {
    console.log(e.target.value)
  }
  console.log('radio select', selectValue)
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
          <Radio.Group
            options={listType}
            defaultValue='1'
            onChange={onChange}
          />
        </Form.Item>
        {selectValue === '1' ? (
          <Form.Item>
            <Select
              placeholder='Select Employee'
              options={emp_list}
              // onChange={onChange}
              optionFilterProp='label'
              showSearch
            />
          </Form.Item>)
          : (
            <div>
              <Form.Item>
                <Select
                  placeholder='Select Courier'
                  options={courier_list}
                  // onChange={onChange}
                  optionFilterProp='label'
                  showSearch
                />
              </Form.Item>
              <Form.Item>
                <Input
                  placeholder='Docket No'
                  onChange={onSetDocket}
                />
              </Form.Item>
            </div>)}
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
