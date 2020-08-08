import { useState } from 'react'
import { Modal, Input, Radio, Button, Form, Select, Tag, message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'

const POD_RECEIPT_BY_EMP_MUTATION = gql`
mutation trip_pod_emp($objects: [trip_pod_receipt_insert_input!]!, $emp_id: Int!, $pod_status_id: Int!) {
insert_trip_pod_receipt(objects: $objects) {
  returning {
      id
    }
  }
  update_trip(where: {trip_pod_receipts: {by_hand_id: {_eq: $emp_id}}}, _set:{trip_pod_status_id: $pod_status_id }){
    returning{
      id
      trip_pod_status_id
    }
    affected_rows
  }
}
`
const POD_RECEIPT_BY_DOCKET_MUTATION = gql`
mutation trip_pod_docket($objects: [trip_pod_receipt_insert_input!]!, $docket: String!, $pod_status_id: Int!) {
insert_trip_pod_receipt(objects: $objects) {
  returning {
      id
    }
  }
  update_trip(where: {trip_pod_receipts: {docket:{_eq: $docket}}}, _set:{trip_pod_status_id: $pod_status_id }){
    returning{
      id
      trip_pod_status_id
    }
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
  const listType = [{ label: 'Internal', value: '1' }, { label: 'Courier', value: '2' }]

  const [selectValue, setSelectValue] = useState('1')
  const initialData = { emp_id: null, courier: null, docket: null }
  const [podData, setPodData] = useState(initialData)

  const { loading, error, data } = useQuery(
    ALL_EMP_AND_COURIER, {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updatePodByEmp] = useMutation(
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

  const [updatePodByDocket] = useMutation(
    POD_RECEIPT_BY_DOCKET_MUTATION,
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
      created_by_id: 1, // TODO USER ID GET from AUTH
      by_hand_id: podData.emp_id
    }
  }) : null

  const docketObjects = trip_ids && trip_ids.length > 0 ? trip_ids.map(id => {
    return {
      trip_id: id,
      created_by_id: 1, // TODO USER ID GET from AUTH
      docket: podData.docket,
      courier_id: podData.courier
    }
  }) : null

  const onPodByEmpSubmit = () => {
    updatePodByEmp({
      variables: {
        objects: empObjects,
        emp_id: podData.emp_id,
        pod_status_id: podDispatch ? 2 : 1
      }
    })
  }

  const onDocketSubmit = () => {
    updatePodByDocket({
      variables: {
        objects: docketObjects,
        docket: podData.docket,
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
        selectValue === '1'
          ? <Button disabled={!isTripSelected} type='primary' key='emp' onClick={onPodByEmpSubmit}>Submit</Button>
          : <Button disabled={!isTripSelected} type='primary' key='docket' onClick={onDocketSubmit}>Submit</Button>
      ]}
    >
      {isTripSelected ? (
        <Form layout='vertical'>
          <Form.Item>
            <Radio.Group
              options={listType}
              defaultValue='1'
              onChange={onRadioChange}
            />
          </Form.Item>
          {selectValue === '1' ? (
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
