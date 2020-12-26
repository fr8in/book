import React, { useState } from 'react'
import { Table, Input, Pagination } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import { gql, useQuery, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import u from '../../../lib/util'

const INCENTIVE_HISTORY = gql`
 subscription incentive($offset: Int, $limit: Int, $incentive_where: incentive_bool_exp) {
  incentive(offset: $offset, limit: $limit, where: $incentive_where) {
    id
    trip_id
    trip {
      partner {
        name
      }
      branch {
        region {
          name
        }
      }
    }
    amount
    comment
    created_at
    created_by
    approved_at
    approved_by
    source
    incentive_config {
      type
    }
    incentive_status {
      status
    }
  }
}`

const incentive_count =gql`
  query incentive_count($incentive_where: incentive_bool_exp){
    incentive_aggregate(where:$incentive_where){
      aggregate{
        count
      }
    }
  }`

const IncentiveHistory = () => {
  const initial = {
    offset: 0,
    limit:u.limit,
    trip_id: null,
    created_by: null,
    partnername: null
  }

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const where = {
     trip_id: filter.trip_id && filter.trip_id.length > 0 ? { _in: filter.trip_id } : { _in: null },
     created_by: filter.created_by ? { _ilike: `%${filter.created_by}%` } : { _ilike: null },
     incentive_status: { status: { _in: ['APPROVED', 'REJECTED'] } },
     trip: { partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } } },
     incentive_config: {auto_creation: {_eq: false}}
  }
  const incentive_where = {
    offset: filter.offset,
    limit: filter.limit,
    incentive_where: where
  }
  
  const { loading, error, data } = useSubscription(
    INCENTIVE_HISTORY,
    {
      variables: incentive_where
    }
  )

  let _data = {}
  if (!loading) {
      _data = data
  }

 const incentive_history = get(_data,'incentive',null)

 const { loading:incentive_loading, error:incentive_error, data:incentive_data } = useQuery(
    incentive_count ,
    {
      variables:{ incentive_where : where}
    }
  )

  let _incentive_data = {}
  if (!incentive_loading) {
      _incentive_data = incentive_data
  }

 const record_count= get(_incentive_data,'incentive_aggregate.aggregate.count',null)
 
 const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }
  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }
 const onTripIdSearch = (e) => {
    setFilter({ ...filter, trip_id: e.target.value })
    setCurrentPage(1)
  }
  const onCreatedBySearch = (e) => {
    setCurrentPage(1)
    setFilter({ ...filter, created_by: e.target.value })
  }
  const onPartnerSearch = (e) => {
    setCurrentPage(1)
    setFilter({ ...filter, partnername: e.target.value })
  }
  const IncentiveHistory = [
    {
      title: '#',
      dataIndex: 'trip_id',
      key: 'trip_id',
      width: '8%',
      render: (text, record) => (
        <Link href='/trips/[id]' as={`/trips/${record.trip_id} `}>
          <a>{text}</a>
        </Link>
      ),
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.trip_id}
          onChange={onTripIdSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
   {
      title: 'Incentive Type',
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'incentive_config.type', null)} length={12} />,
    },
    {
      title: 'Amount ₹',
      dataIndex: 'amount',
      key: 'amount',
      width: '8%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      key: 'comment',
      width: '10%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    {
      title: 'Partner',
      key: 'partner',
      width: '12%',
      render: (text, record) => <Truncate data={get(record, 'trip.partner.name', null)} length={12} />,
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='partner_name'
            name='partner_name'
            value={filter.partnername}
            onChange={onPartnerSearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Request By',
      dataIndex: 'created_by',
      key: 'created_by',
      width: '10%',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='created_by'
            name='created_by'
            value={filter.created_by}
            onChange={onCreatedBySearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Req.On',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '8%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Approved By',
      dataIndex: 'approved_by',
      key: 'approved_by',
      width: '10%',
    },
    {
        title: 'Approved On',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
        width: '8%',
        render: (text, record) => {
          return text ? moment(text).format('DD-MMM-YY') : null
        }
      }
  ]

  return (
    <>
      <Table
        columns={IncentiveHistory}
        dataSource={incentive_history}
        rowKey={(record) => record.id}
        loading={loading}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />
       {!loading && record_count ? (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />) : null}
    </>
  )
}

export default IncentiveHistory
