import React from 'react'
import { Table } from 'antd'
import BranchEdit from './citybranchedit'

const CityPricing = (props) => {
  const {citymapping} = props
  console.log('citymapping',citymapping)
  const CityPricing = [
    {
      title: 'City',
      dataIndex: 'name',
      key: 'name',
      width: '30%'
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: '70%',
      render: (text, record) => {
        const branch = record.branch && record.branch.name
        return(
      <span>{branch} <BranchEdit id={record.id} branch={branch}/></span>
      
        )
      }
    }
  ]

  return (
    <Table
      columns={CityPricing}
      dataSource={citymapping}
      size='small'
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  )
}

export default CityPricing
