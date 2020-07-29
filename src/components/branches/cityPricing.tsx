import React from 'react'
import { Table } from 'antd'
import Branch from '../../../mock/branches/branches'
import { EditTwoTone } from '@ant-design/icons'

const CityPricing = () => {
  const CityPricing = [
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: '10%'
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: '10%',
      render: (text, record) => <span>{text} <EditTwoTone /></span>
    },
    {
      title: 'Additional Rate(C)',
      dataIndex: 'customerAddRate',
      key: 'customerAddRate',
      width: '12%'
    },
    {
      title: 'Additional/Km (C)',
      dataIndex: 'customerAddPerKm',
      key: 'customerAddPerKm',
      width: '12%'
    },
    {
      title: 'Additional Rate(P)',
      dataIndex: 'partnerAddRate',
      key: 'partnerAddRate',
      width: '10%'
    },
    {
      title: 'Additional/Km (P)',
      dataIndex: 'partnerPerKm',
      key: 'partnerPerKm',
      width: '10%'
    },
    {
      title: 'Source Dry Run%',
      dataIndex: 'sourceDryRun',
      key: 'sourceDryRun',
      width: '10%'
    },
    {
      title: 'Destination Dry Run%',
      dataIndex: 'destinationDryRun',
      key: 'destinationDryRun',
      width: '15%'
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      width: '6%',
      render: (text, record) => <EditTwoTone />
    }
  ]

  return (
    <Table
      columns={CityPricing}
      dataSource={Branch}
      size='small'
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  )
}

export default CityPricing
