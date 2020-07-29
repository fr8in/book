import { useState } from 'react'
import { Table,Button } from 'antd'
import Link from 'next/link'
import { EditTwoTone } from '@ant-design/icons'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import PartnerUsers from '../partners/partnerUsers'
import useShowHide from '../../hooks/useShowHide'
import CustomerPo from '../../components/trips/createPo'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'

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
  const iinitial = {
    usersData: [],
    usersVisible: false,
    title: ''
  }

  const { object, handleHide, handleShow } = useShowHidewithRecord(iinitial)

  const { trucks , status } = props
  console.log(props)

  const truckStatus = status.map(data => {
    return { value: data.id.toString(), text: data.value }
  })

 
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
            <a>{record.truck_no}-{record.truck_type.value}</a>
          </Link>
        )
      }
    },
    {
      title: 'Trip ID',
      render: (text, record) => {
        const id = record && record.trips[0] ? record.trips[0].id : null
        return (
          <span>{
            id &&
              <Link href='/trips/[id]' as={`/trips/${id} `}>
                <a>{id}</a>
              </Link>
          }
          </span>
        )
      }
    },
    {
      title: 'Trip',
      render: (text, record) => {
        const id = record && record.trips[0] ? record.trips[0].id : null
        const source = record && record.trips[0] && record.trips[0].source ? record.trips[0].source.name : null
        const destination = record && record.trips[0] && record.trips[0].destination ? record.trips[0].destination.name : null
        return (
          <span>{
            id
              ? <span>
                {
                  source.slice(0, 3) + '-' + destination.slice(0, 3)
                }
              </span> : (record.truck_status.id === 1) ? <Button type='link'>Assign</Button> : 'NA'
          }
          </span>
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
      dataIndex: 'mobile',
      render: (text, record) => {
         const number = record.partner && record.partner.partner_users && record.partner.partner_users.length > 0 && 
          record.partner.partner_users[0].mobile ? record.partner.partner_users[0].mobile : '-'
        return (
          <span className='link' onClick={() => handleShow('usersVisible', null , 'usersData', record.cardcode)}>{number}</span>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => record.truck_status && record.truck_status.value,
      filters: truckStatus
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
       {object.usersVisible &&
        <PartnerUsers
          visible={object.usersVisible}
          partnerId={object.usersData}
          onHide={handleHide}
          title={object.title}
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
