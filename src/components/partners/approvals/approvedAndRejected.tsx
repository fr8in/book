import React, { useState } from 'react'
import { Table, Input, Pagination, Checkbox } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import { gql, useQuery, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import u from '../../../lib/util'

const APPROVED_REJECTED_SUBSCRIPTION = gql`
subscription trip_credit_debit_approval(
  $offset: Int, 
  $limit: Int, 
  $where: trip_credit_debit_bool_exp!
  ) 
  {
  trip_credit_debit(
    order_by: {trip_id: desc}, 
    offset: $offset, limit: $limit,
    where: $where) {
    id
    trip_id
    type
    amount
    approval_comment
    approved_amount
    approved_by
    created_at
    created_by
    comment
    credit_debit_status {
      id
      name
    }
    credit_debit_type {
      name
    }
  }
}`

const CREDIT_DEBIT_TYPE_QUERY = gql`
query credit_debit_agg_type($where: trip_credit_debit_bool_exp!){
  trip_credit_debit_aggregate(where:$where){
      aggregate{
        count
      }
    }
  credit_debit_type {
    id
    active
    name
  }
}
`

const creditDebitType = [
  { value: 1, text: 'C' },
  { value: 2, text: 'D' }
]

const ApprovedAndRejected = () => {
  const initial = {
    offset: 0,
    limit: u.limit,
    trip_id: null,
    type: null,
    issue_type: [],
    created_by: null
  }

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const where = {
    trip_id: filter.trip_id && filter.trip_id.length > 0 ? { _in: filter.trip_id } : { _in: null },
    type: filter.type && filter.type.length > 0 ? { _in: filter.type } : { _in: null },
    credit_debit_type: filter.issue_type && filter.issue_type.length > 0 ? { name: { _in: filter.issue_type } } : { name: { _in: null } },
    created_by: filter.created_by ? { _ilike: `%${filter.created_by}%` } : { _ilike: null },
    credit_debit_status: { name: { _in: ['APPROVED', 'REJECTED'] } }
  }
  const approvalQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    where: where
  }
  console.log('filter', filter)

  const { loading, error, data } = useSubscription(
    APPROVED_REJECTED_SUBSCRIPTION,
    {
      variables: approvalQueryVars
    }
  )
  console.log('approvedRejected error', error)

  const { data: f_data, loading: filter_loading } = useQuery(
    CREDIT_DEBIT_TYPE_QUERY,
    {
      variables: { where: where },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const approvedAndRejected = get(_data, 'trip_credit_debit', null)

  let filter_data = {}
  if (!filter_loading) {
    filter_data = f_data
  }
  const credit_debit_type = get(filter_data, 'credit_debit_type', [])
  const issueTypeList = !isEmpty(credit_debit_type) ? credit_debit_type.map((data) => {
    return { value: data.name, label: data.name }
  }) : []

  const record_count = get(filter_data, 'trip_credit_debit_aggregate.aggregate.count', 0)

  const creditDebitList = creditDebitType.map((data) => {
    return { value: data.text, label: data.text }
  })

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
  const onIssueTypeFilter = (checked) => {
    setFilter({ ...filter, issue_type: checked, offset: 0 })
    setCurrentPage(1)
  }
  const onTypeFilter = (checked) => {
    setFilter({ ...filter, type: checked, offset: 0 })
    setCurrentPage(1)
  }
  const onCreatedBySearch = (e) => {
    setCurrentPage(1)
    setFilter({ ...filter, created_by: e.target.value })
  }

  const ApprovalPending = [
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: creditDebitType,
      width: '7%',
      onFilter: (value, record) => record && record.type.indexOf(value) === 0,
      filterDropdown: (
        <Checkbox.Group
          options={creditDebitList}
          defaultValue={filter.type}
          onChange={onTypeFilter}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'Issue Type',
      dataIndex: 'issueType',
      key: 'issueType',
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name', null)} length={12} />,
      filterDropdown: (
        <Checkbox.Group
          options={issueTypeList}
          defaultValue={filter.issue_type}
          onChange={onIssueTypeFilter}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'Claim ₹',
      dataIndex: 'amount',
      width: '8%'
    },
    {
      title: 'Approved ₹',
      dataIndex: 'approved_amount',
      key: 'approved',
      width: '8%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      key: 'comment',
      width: '13%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    {
      title: 'Request By',
      dataIndex: 'created_by',
      key: 'created_by',
      width: '13%',
      render: (text, record) => <Truncate data={text} length={18} />,
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
      title: 'Closed By',
      dataIndex: 'approved_by',
      key: 'approved_by',
      width: '12%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    {
      title: 'Remarks',
      dataIndex: 'approval_comment',
      key: 'approval_comment',
      width: '13%',
      render: (text, record) => <Truncate data={text} length={12} />
    }
  ]

  return (
    <>
      <Table
        columns={ApprovalPending}
        dataSource={approvedAndRejected}
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

export default ApprovedAndRejected
