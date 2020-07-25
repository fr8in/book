import { useState } from 'react'
import { Table } from 'antd'
import Link from 'next/link'
import { EditTwoTone } from '@ant-design/icons'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import PartnerUsers from '../partners/partnerUsers'
import useShowHide from '../../hooks/useShowHide'
import CustomerPo from '../../components/trips/createPo'

const statusList = [
  { value: 1, text: 'Ordered' },
  { value: 2, text: 'Assigned' },
  { value: 3, text: 'Confirmed' },
  { value: 4, text: 'Waiting for Loading' },
  { value: 5, text: 'Intransit to Destination' },
  { value: 6, text: 'Deactivated' },
  { value: 7, text: 'Intransit halting' }
]

const Trucks = (props) => {
  const { trucks } = props

  console.log(props)

  const usersInitial = { users: [], name: '', visible: false }
  const [users, setUsers] = useState(usersInitial)

  const initial = { record: null, title: '', visible: false }
  const [availability, setAvailability] = useState(initial)

  const poInitial = { poModal: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      name: record.name
    })
  }

  const usersClose = () => {
    setUsers(usersInitial)
  }

  const showUsers = (record) => {
    setUsers({ ...users, users: record.users, name: record.partner, visible: true })
  }

  const breakdownClose = () => {
    setAvailability(initial)
  }

  const showBreadown = (record) => {
    setAvailability({ ...record, record: record, title: 'Breakdown', visible: true })
  }

  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      render: (text, record) => {
        return (
          <Link href='trucks/[id]' as={`trucks/${record.truck_no}`}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Trip Id',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <Link href='trips/[id]' as={`trips/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Trip',
      dataIndex: 'trip',
      render: (text, record) => {
        return (
          <span className='link' onClick={() => onShow('poModal')}>{text}</span>
        )
      }
    },
    {
      title: 'Partner',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${record.partner.cardcode}`}>
            <a>{record.partner.name}</a>
          </Link>
        )
      }
    },
    {
      title: 'Phone No',
      dataIndex: 'phone_no',
      render: (text, record) => {
        return (
          <span className='link' onClick={() => showUsers(record)}>{record.driver && record.driver.mobile_no}</span>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: statusList,
      render: (text, record) => {
        return (record.truck_status && record.truck_status.value)
      }
    },
    {
      title: 'City',
      render: (text, record) => {
        return (record.city && record.city.name)
      }
    },
    {
      title: '',
      render: (text, record) => <EditTwoTone onClick={() => showBreadown(record)} />
    }
  ]
  return (
    <>
      <Table
        rowSelection={{
          ...rowSelection
        }}
        columns={columns}
        dataSource={trucks}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />
      {users.visible &&
        <PartnerUsers
          visible={users.visible}
          data={users.users}
          onHide={usersClose}
          name={users.name}
        />}
      {availability.visible &&
        <CreateBreakdown
          visible={availability.visible}
          data={availability.record}
          onHide={breakdownClose}
          title={availability.title}
        />}
      {visible.poModal && <CustomerPo visible={visible.poModal} onHide={() => onHide()} />}
    </>
  )
}

export default Trucks
