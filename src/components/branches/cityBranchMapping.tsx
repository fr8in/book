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
      width: '30%'
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: '70%',
      render: (text, record) => <span>{text} <EditTwoTone /></span>
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
