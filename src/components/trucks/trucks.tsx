import { useState } from 'react'
import { Table } from 'antd'
import Link from 'next/link'
<<<<<<< HEAD
import EditModal from '../../components/trucks/editModal'
import PhoneModal from '../partners/partnerUsers'
=======
import { EditTwoTone } from '@ant-design/icons'
import trucks from '../../../mock/trucks/trucks'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import PartnerUsers from '../partners/partnerUsers'
>>>>>>> 72ac8b33ed6a637a8dd285f61d72dfa450f27a07

const statusList = [
  { value: 1, text: 'Ordered' },
  { value: 2, text: 'Assigned' },
  { value: 3, text: 'Confirmed' },
  { value: 4, text: 'Waiting for Loading' },
  { value: 5, text: 'Intransit to Destination' },
  { value: 6, text: 'Deactivated' },
  { value: 7, text: 'Intransit halting' }
]

const Trucks = () => {
  const usersInitial = { users: [], name: '', visible: false }
  const [users, setUsers] = useState(usersInitial)

  const initial = { record: null, title: '', visible: false }
  const [availability, setAvailability] = useState(initial)

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
      dataIndex: 'truckNo',
      render: (text, record) => {
        return (
          <Link href='trucks/[id]' as={`trucks/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Trip Id',
      dataIndex: 'tripId',
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
      dataIndex: 'trip'
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Phone No',
      dataIndex: 'phoneNo',
      render: (text, record) => {
        return (
          <span className='link' onClick={() => showUsers(record)}>{text}</span>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: statusList
    },
    {
      title: 'City',
      dataIndex: 'city'
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
    </>
  )
}

export default Trucks
