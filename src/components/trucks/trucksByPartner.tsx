import React from 'react'
import { Table } from 'antd'
import PageLayout from '../layout/pageLayout'
import mock from '../../../mock/partner/truckByPartner'

const PartnerTruck = () => {
  const columnsCurrent = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
    },
    {
      title: 'Truck Type',
      dataIndex: 'type'
    },
    {
      title: 'Trip ID',
      dataIndex: 'tripId'
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
    },
    {
        title: 'Avg Km/day',
        dataIndex: 'averageKm',
      },
   
  ]
  return (
    <PageLayout title='Partners'>
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  )
}

export default PartnerTruck
