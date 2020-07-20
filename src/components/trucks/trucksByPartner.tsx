import React, { useState } from 'react'
import { Table } from 'antd'
import Link from 'next/link'
import mock from '../../../mock/partner/truckByPartner'


const list = [
  { value: 1, text: 'All' },
  { value: 2, text: 'Ordered' },
  { value: 3, text: 'Assigned' },
  { value: 4, text: 'confirmed' },
  { value: 5, text: 'Waiting for Loading' },
  { value: 6, text: 'Intransit to Destination' },
  { value: 7, text: 'Waiting for Unloading' },
  { value: 8, text: 'Witing for Load' },
  { value: 9, text: 'Deactivate' },
  { value: 10, text: 'Unloading' },
]
const status=[
  { value: 1, text: 'Express' },
  { value: 2, text: 'Non-Express' },
]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const PartnerTruck = () => {
  const [selectionType] = useState('checkbox');
  const columnsCurrent = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      render: (text, record) => {
        return (
          <Link href="/trucks/[id]" as={`/trucks/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      },
    },
    {
      title: 'Truck Type',
      dataIndex: 'type'
    },
    {
      title: 'Trip ID',
      dataIndex: 'tripId',
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>)
      },
    },
    {
      title: 'Trip',
      dataIndex: 'trip'
    },
    {
      title: 'City',
      dataIndex: 'cityName'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: list
    },
    {
        title: 'Avg Km/day',
        dataIndex: 'averageKm',
        sorter: true,
        filters: status
      },
   
  ]
  return (
      <Table
      rowSelection={{
        ...rowSelection,
      }}
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
  )
}

export default PartnerTruck
