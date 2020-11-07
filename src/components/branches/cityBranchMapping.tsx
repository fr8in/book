import React from 'react'
import { Table } from 'antd'
import BranchEdit from './citybranchedit'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import u from '../../lib/util'
const CITY_QUERY = gql`
subscription connected_city {
  city(where:{_and: [ {is_connected_city: {_eq: true}}]}){
    id
    name
    branch{
      id
      name
    }
  }
}
`
const CityBranchMapping = () => {
  const { loading, error, data } = useSubscription(CITY_QUERY)
  console.log('error', error)
  const { role } = u
  const access = [role.admin,role.hr]

  let _data = []
  if (!loading) {
    _data = data
  }
  const citymapping = get(_data, 'city', [])

  const column = [
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
        return (
          <span> <BranchEdit id={record.id} branch={branch} edit_access={access} /></span>

        )
      }
    }
  ]

  return (
    <Table
      columns={column}
      dataSource={citymapping}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
      rowKey={(record) => record.id}
      loading={loading}
    />
  )
}

export default CityBranchMapping
