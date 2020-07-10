import React from 'react'
import trucks from '../../../mock/trucks/trucks'
import { Table } from 'antd'

import PageLayout from '../common/PageLayout'

const Trucks = () => {
  const columns = [
    {
       title: 'Truck No',
      dataIndex: 'truckNo'
      
    },
    {
      title: 'Trip Id',
      dataIndex: 'tripId'
    },
    {
      title: 'Trip',
      dataIndex: 'trip'
    },
    {
      title: 'Partner',
      dataIndex: 'partner'
    },
    {
      title: 'Phone No',
      dataIndex: 'phoneNo'
    },
    {
        title: 'Status',
        dataIndex: 'status'
      },
    {
      title: 'city',
      dataIndex: 'city'
    } ]

  return (

    
    <PageLayout title='Trucks'>
       <Table
      columns={columns}
      dataSource={trucks}
      rowKey={record => record.id}
      size='middle'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
    </PageLayout>
  )
}


export default Trucks
