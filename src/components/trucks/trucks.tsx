import React, {useState} from 'react'
import trucks from '../../../mock/trucks/trucks'
import { Table , Button} from 'antd'
import Link from 'next/link'
import EditModal from '../../components/trucks/editModal'
import PhoneModal from '../partners/phoneModal'

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', 
    name: record.name,
  }),
};



const Trucks = () => {
  const [selectionType,setSelectionType] = useState('checkbox');

  const statusList = [
    { value: 1, text: 'Ordered' },
    { value: 2, text: 'Assigned' },
    { value: 3, text: 'Confirmed' },
    { value: 4, text: 'Waiting for Loading' },
    { value: 5, text: 'Intransit to Destination' },
    { value: 6, text: 'Deactivated' },
    { value: 7, text: 'Intransit halting' }
  ]

  

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
      dataIndex: 'trip',

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
      render: () => {
        return (
         <PhoneModal/>
        )
      }
      
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters : statusList
    },
    {
      title: 'city',
      dataIndex: 'city',
    },
    {
      title: '',
      render: () => {
        return (
         <EditModal/>
        )
      }
      
    }]

  return (
    
    <Table
    rowSelection={{
      ...rowSelection,
    }}
      columns={columns}
      dataSource={trucks}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
    />
  )
}

export default Trucks
