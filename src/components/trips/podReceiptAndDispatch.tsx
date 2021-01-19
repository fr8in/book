import { useState, useContext } from 'react'
import { Modal, Input, Radio, Button, Form, Select, Tag, message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'

const POD_RECEIPT_VERIFIED_MUTATION = gql`
mutation trip_pod_verified_at($objects: [trip_pod_receipt_insert_input!]!, $trip_ids: [Int!], $pod_verified_at: timestamp!, $updated_by: String! ) {
insert_trip_pod_receipt(objects: $objects) {
  returning {
      id
    }
  }
  update_trip(where: {id:{_in:$trip_ids}}, _set:{pod_verified_at: $pod_verified_at, updated_by: $updated_by }){
    returning{
      id
      pod_verified_at
    }
    affected_rows
  }
}`
const POD_RECEIPT_DISPATCHED_MUTATION = gql`
mutation trip_pod_dispatched_at($objects: [trip_pod_dispatch_insert_input!]!, $trip_ids: [Int!], $pod_dispatched_at: timestamp!, $updated_by: String! ) {
insert_trip_pod_dispatch(objects: $objects) {
  returning {
      id
    }
  }
  update_trip(where: {id:{_in:$trip_ids}}, _set:{pod_dispatched_at: $pod_dispatched_at, updated_by: $updated_by }){
    returning{
      id
      pod_verified_at
    }
    affected_rows
  }
}`

const ALL_EMP_AND_COURIER = gql`
 query emp_courier {
  employee(where:{active: {_eq: 1}}){
    id
    email
  }
  courier {
    id
    name
  }
}
`
const PodReceiptAndDispatch = (props) => {
  const { visible, onHide, trip_ids, onRemoveTag, podDispatch } = props
  const context = useContext(userContext)

  const listType = [
    { label: 'Internal', value: 'Internal' },
    { label: 'Courier', value: 'Courier' }
  ]

  const [selectValue, setSelectValue] = useState('Internal')
  const initialData = { emp_id: null, courier: null, docket: null }
  const [podData, setPodData] = useState(initialData)

  const { loading, error, data } = useQuery(
    ALL_EMP_AND_COURIER, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  const [updatePodVerifiedAt] = useMutation(
    POD_RECEIPT_VERIFIED_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        setPodData(initialData)
        onHide()
      }
    }
  )
  const [updatePodDispatchedAt] = useMutation(
    POD_RECEIPT_DISPATCHED_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        setPodData(initialData)
        onHide()
      }
    }
  )

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

  const onRadioChange = (e) => {
    setSelectValue(e.target.value)
  }

  const onCourierChange = (value) => {
    setPodData({ ...podData, courier: value })
  }

  const onEmpChange = (value) => {
    setPodData({ ...podData, emp_id: value })
  }

  const onSetDocket = (e) => {
    setPodData({ ...podData, docket: e.target.value })
  }

  const onClose = () => {
    onRemoveTag(null)
    setPodData(initialData)
    onHide()
  }

  const empObjects = trip_ids && trip_ids.length > 0 ? trip_ids.map(id => {
    return {
      trip_id: id,
      created_by_id: context.employee_id,
      by_hand_id: podData.emp_id,
      docket: podData.docket,
      courier_id: podData.courier
    }
  }) : null

  const docketObjects = trip_ids && trip_ids.length > 0 ? trip_ids.map(id => {
    return {
      trip_id: id,
      created_by_id: context.employee_id,
      docket: podData.docket,
      courier_id: podData.courier
    }
  }) : null

  const onPodReceiptDispatchSubmit = () => {
    const now = new Date().toISOString()
    if (podDispatch) {
      updatePodDispatchedAt({
        variables: {
          objects: (selectValue === 'Internal') ? empObjects : docketObjects,
          trip_ids: trip_ids,
          pod_dispatched_at: now,
          updated_by: context.email
        }
      })
    } else {
      updatePodVerifiedAt({
        variables: {
          objects: (selectValue === 'Internal') ? empObjects : docketObjects,
          trip_ids: trip_ids,
          pod_verified_at: now,
          updated_by: context.email
        }
      })
    }
  }

  const isTripSelected = trip_ids && trip_ids.length > 0
  return (
    <Modal
      title={podDispatch ? 'Customer Pod Dispatch' : 'Partner Pod Receipt'}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button disabled={!isTripSelected} type='primary' key='emp' onClick={onPodReceiptDispatchSubmit}>Submit</Button>
      ]}
    >
      {isTripSelected ? (
        <Form layout='vertical'>
          <Form.Item>
            <Radio.Group
              options={listType}
              defaultValue='Internal'
              onChange={onRadioChange}
            />
          </Form.Item>
          {selectValue === 'Internal' ? (
            <div>
            <Form.Item>
              <Select
                placeholder='Select Employee'
                options={emp_list}
                onChange={onEmpChange}
                optionFilterProp='label'
                showSearch
              />
            </Form.Item>
            <Form.Item>
                  <Select
                    placeholder='Select Courier'
                    options={courier_list}
                    onChange={onCourierChange}
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
            </div>)
            : (
              <div>
                <Form.Item>
                  <Select
                    placeholder='Select Courier'
                    options={courier_list}
                    onChange={onCourierChange}
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
          {isTripSelected
            ? trip_ids.map((data, i) => {
              return (
                <Tag
                  key={i}
                  color='blue'
                  closable={data !== 0} onClose={() => onRemoveTag(data)}
                >
                  {data}
                </Tag>
              )
            }
            ) : <div />}
        </Form>) : <p>Kindly select trip to update courier detail</p>}
    </Modal>
  )
}
export default PodReceiptAndDispatch
