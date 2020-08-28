import { useState } from 'react'
import { Modal, Input, Radio, Button, Form, Select, Tag, message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'

const POD_RECEIPT_BY_EMP_MUTATION = gql`
mutation trip_pod_courier_update($objects: [trip_pod_receipt_insert_input!]!, $trip_ids: [Int!], $pod_status_id: Int!) {
insert_trip_pod_receipt(objects: $objects) {
  returning {
      id
    }
  }
  update_trip(where: {id:{_in:$trip_ids}}, _set:{trip_pod_status_id: $pod_status_id }){
    returning{
      id
      trip_pod_status_id
    }
    affected_rows
  }
}
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
const PodReceiptAndDispatch = (props) => {
  const { visible, onHide, trip_ids, onRemoveTag, podDispatch } = props
  const listType = [{ label: 'Internal', value: 'Internal' }, { label: 'Courier', value: 'Courier' }]

  const [selectValue, setSelectValue] = useState('Internal')
  const initialData = { emp_id: null, courier: null, docket: null }
  const [podData, setPodData] = useState(initialData)

  const { loading, error, data } = useQuery(
    ALL_EMP_AND_COURIER, {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updatePodCourierDetail] = useMutation(
    POD_RECEIPT_BY_EMP_MUTATION,
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
      created_by_id: 110, // TODO USER ID GET from AUTH
      by_hand_id: podData.emp_id
    }
  }) : null

  const docketObjects = trip_ids && trip_ids.length > 0 ? trip_ids.map(id => {
    return {
      trip_id: id,
      created_by_id: 110, // TODO USER ID GET from AUTH
      docket: podData.docket,
      courier_id: podData.courier
    }
  }) : null

  const onPodReceiptDispatchSubmit = () => {
    updatePodCourierDetail({
      variables: {
        objects: (selectValue === 'Internal') ? empObjects : docketObjects,
        trip_ids: trip_ids,
        pod_status_id: podDispatch ? 2 : 1
      }
    })
  }

  const isTripSelected = trip_ids && trip_ids.length > 0
  return (
    <Modal
      title={podDispatch ? 'Customer Pod Receipt' : 'Partner Pod Receipt'}
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
            <Form.Item>
              <Select
                placeholder='Select Employee'
                options={emp_list}
                onChange={onEmpChange}
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
