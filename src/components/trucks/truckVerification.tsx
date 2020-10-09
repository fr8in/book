import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'
import u from '../../lib/util'
import { Table, Button, Space, Pagination, Checkbox, Tooltip } from 'antd'
import Link from 'next/link'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import TruckReject from '../../components/trucks/truckReject'
import TruckActivation from '../trucks/truckActivation'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useQuery, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'
import isEmpty from 'lodash/isEmpty'

const TRUCKS_QUERY = gql`
query trucks_{
  truck_type {
    id
    name
  }
  truck_status(where:{name: {_in: ["Verification","Rejected"]}}, order_by: {id: asc}) {
    id
    name
  }
} 
`
const TRUCKS_SUBSCRIPTION = gql`
subscription trucks_verification(
$truck_statusName: [String!]){
  truck(
      where: {truck_status: {name: {_in:$truck_statusName}}}) {
    id
    truck_no
    last_comment{
      topic
      truck_id
      description
      created_at
      created_by
    }
    truck_status {
      id
      name
    }
    partner {
      id
      cardcode
      name
    }
  }
}`

const TruckVerification = (props) => {
  const initial = {
    truckActivationVisible: false,
    truckActivationData: [],
    truckRejectVisible: false,
    truckRejectData: [],
    truck_statusName: ['Verification']
  }

  const [filter, setFilter] = useState(initial)

  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const { role } = u
  const context = useContext(userContext)
  const customerAdvancePercentageEdit = [role.admin, role.partner_manager, role.billing]
  const truckActivationRejectAccess = !isEmpty(customerAdvancePercentageEdit) ? context.roles.some(r => customerAdvancePercentageEdit.includes(r)) : false

  const variables = {
    truck_statusName: filter.truck_statusName
  }

  const { loading, error, data } = useQuery(TRUCKS_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  const { loading: s_loading, error: s_error, data: s_data } = useSubscription(
    TRUCKS_SUBSCRIPTION,
    { variables: variables }
  )

  console.log('TrucksVerification error', error, s_error)

  let _data = {}
  if (!loading) {
    _data = data
  }
  const truck_status = get(_data, 'truck_status', [])
  const truck_type = get(_data, 'truck_type', [])

  let _s_data = {}
  if (!s_loading) {
    _s_data = s_data
  }
  const truck = get(_s_data, 'truck', [])
  const truck_info = get(_s_data, 'truck[0]', { name: 'ID does not exist' })
  const truck_status_name = get(truck_info, 'truck_status.name', null)

  const trucksStatus = truck_status.map((data) => {
    return { value: data.name, label: data.name }
  })

  const onFilter = (value) => {
    setFilter({ ...filter, truck_statusName: value })
  }

  const handleStatus = (checked) => {
    onFilter(checked)
  }

  const columnsCurrent = [
    {
      title: 'Truck No',
      render: (text, record) => {
        const truck_no = get(record, 'truck_no', null)
        return (
          <LinkComp type='trucks' data={truck_no} id={truck_no} />
        )
      },
      width: '10%'
    },
    {
      title: 'Partner Code',
      render: (text, record) => {
        const cardcode = get(record, 'partner.cardcode', null)
        return (
          <LinkComp type='partners' data={cardcode} id={cardcode} />
        )
      },
      width: '10%'
    },
    {
      title: 'Partner',
      width: '18%',
      render: (text, record) => <Truncate data={get(record, 'partner.name', '-')} length={26} />
    },
    {
      title: 'Truck Status',
      width: '17%',
      filterDropdown: (
        <Checkbox.Group
          options={trucksStatus}
          defaultValue={filter.truck_statusName}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => get(record, 'truck_status.name', '-')
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, record) => {
        return (
          <Space>
            { truckActivationRejectAccess ?
             <>
            <Button
              type='primary'
              size='small'
              shape='circle'
              className='btn-success'
              icon={<CheckOutlined />}
              onClick={() => handleShow('truckActivationVisible', null, 'truckActivationData', record.id)}
            />
            <Button
              type='primary'
              size='small'
              shape='circle'
              danger
              icon={<CloseOutlined />}
              onClick={() => handleShow('truckRejectVisible', 'Reject Truck', 'truckRejectData', record.id)}
            /> </> : null  }
              
          </Space>
        )
      }
    },
    truck_status_name === 'Rejected'
      ? {
        title: 'Reject Reason',
        width: '35%',
        render: (text, record) => <Truncate data={get(record, 'last_comment.description', null)} length={50} />
      } : {}
  ]
  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={truck}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1150 }}
        pagination={false}
        className='withAction'
        loading={s_loading}
      />
      {object.truckActivationVisible && (
        <TruckActivation
          visible={object.truckActivationVisible}
          onHide={handleHide}
          truck_id={object.truckActivationData}
          truck_type={truck_type}
        />
      )}
      {object.truckRejectVisible && (
        <TruckReject
          visible={object.truckRejectVisible}
          onHide={handleHide}
          truck_id={object.truckRejectData}
        />
      )}
    </>
  )
}

export default TruckVerification
