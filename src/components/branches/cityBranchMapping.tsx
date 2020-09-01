import React from 'react'
import { Table } from 'antd'
import BranchEdit from './citybranchedit'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'

const CITY_QUERY = gql`
subscription{
  city{
    id
    name
    branch{
      id
      name
    }
  }
}
`
const CityPricing = () => {
  
  const { loading, error, data } = useSubscription(CITY_QUERY)
  console.log('error', error)

  let _data = []
if (!loading){
     _data = data 
}
const citymapping = get(_data,'city',[])
console.log('city',citymapping)

  
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
      <span> <BranchEdit id={record.id} branch={branch}/></span>
      
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
