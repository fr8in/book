import { useState } from 'react'
import { Table, Pagination } from 'antd'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import CreateBreakdown from './createBreakdown'
import u from '../../lib/util'

const TRUCK_BREAKDOWN_QUERY = gql`
query ($truck_status_name: [String!], $offset: Int!, $limit: Int!) {
  
  rows: truck_aggregate(where: {truck_status: {name: {_in: $truck_status_name}}}) {
    aggregate {
      count
    }
  }
  truck(offset: $offset
    limit: $limit where: {truck_status: {name: {_in: $truck_status_name}}}) {
    id
    truck_no
    partner {
      id
      name
      partner_users(limit: 1, where: { is_admin: { _eq: true } }) {
        mobile
      }
    }
    city {
      id
      name
    }
  }
}

`

const Breakdown = (props) => {
  const initial = {
    offset: 0,
    limit: u.limit,
    cityVisible: false,
    cityData: [],
    title: ''
  }

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const { truck_status } = props

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    truck_status_name: truck_status
  }

  const { loading, error, data } = useQuery(
    TRUCK_BREAKDOWN_QUERY,
    { variables: variables }
  )

  console.log('Breakdown error', error)

  var _data = {}
  if (!loading) {
    _data = data
  }

  console.log('_data', _data)

  const truck = get(_data, 'truck', [])
  const truck_info = get(_data, 'truck[0]', {})
  const record_count = get(_data, 'rows.aggregate.count', 0)

  const callNow = data => {
    window.location.href = 'tel:' + data
  }

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const number = truck_info.partner && truck_info.partner.partner_users && truck_info.partner.partner_users.length > 0 &&
          truck_info.partner.partner_users[0].mobile ? truck_info.partner.partner_users[0].mobile : '-'

  const columnsCurrent = [
    {
      title: 'Company',
      dataIndex: 'company',
      sorter: true,
      width: '35%',
      render: (text, record) => {
        return (
          record.partner && record.partner.name ? <span onClick={() => callNow(number)} className='link'>{record.partner && record.partner.name}</span> : null
        )
      }
    },
    {
      title: 'Truck',
      dataIndex: 'truck',
      width: '35%',
      render: (text, record) => {
        return record.truck_no
      }
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: '30%',
      render: (text, record) => {
        // return record.city && record.city.name;
        return (
          <span
            className='link'
            onClick={() =>
              handleShow('cityVisible', 'Availability - TAT:0', 'cityData', record.id)}
          >
            {record.city && record.city.name}
          </span>
        )
      }

    }
  ]
  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={truck}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 800, y: 450 }}
        pagination={false}
      />
      {!loading && record_count
        ? (
          <Pagination
            size='small'
            current={currentPage}
            pageSize={filter.limit}
            showSizeChanger={false}
            total={record_count}
            onChange={pageChange}
            className='text-right p10'
          />) : null}
      {object.cityVisible && (
        <CreateBreakdown
          visible={object.cityVisible}
          id={object.cityData}
          onHide={handleHide}
          title={object.title}
          comments
        />
      )}

    </>

  )
}

export default Breakdown
