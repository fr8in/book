import React, { useState } from 'react'
import { Table, Input, Pagination, Checkbox } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import { gql, useQuery, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import u from '../../../lib/util'

const APPROVED_REJECTED_QUERY = gql`
query trip_credit_debit(
  $status: [String!], 
  $offset: Int, 
  $limit: Int, 
  $created_by: String, 
  $issue_type: [String!], 
  $type: [bpchar!], 
  $trip_id: [Int!]) 
  {
  trip_credit_debit(
    order_by: {trip_id: desc}, 
    offset: $offset, limit: $limit,
    where: {
      credit_debit_status: {name: {_in: $status}}, 
      created_by: {_ilike: $created_by}, 
      credit_debit_type: {name: {_in: $issue_type}}, 
      type: {_in: $type}, 
      trip_id: {_in: $trip_id}
    }) {
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
}
`
const CREDIT_DEBIT_TYPE_SUBSCRIPTION = gql`
subscription credit_debit_type{
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
    created_by: null,
  }

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const approvalQueryVars = {
    offset: 0,
    limit: u.limit,
    status: ["APPROVED", "REJECTED"],
    trip_id: filter.trip_id && filter.trip_id.length > 0 ? filter.trip_id : null,
    type: filter.type && filter.type.length > 0 ? filter.type : null,
    issue_type: filter.issue_type && filter.issue_type.length > 0 ? filter.issue_type : null,
    created_by: filter.created_by ? `%${filter.created_by}%` : null
  }

  const { loading, error, data } = useQuery(
    APPROVED_REJECTED_QUERY,
    {
      variables: approvalQueryVars,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('approvedRejected error', error)
  console.log('approvedRejected data', data)

  const { data: issueType } = useSubscription(
    CREDIT_DEBIT_TYPE_SUBSCRIPTION,
  )
  console.log('approvedRejected issueType', issueType)

  let _data = {}
  if (!loading) {
    _data = data
  }
  const approvedAndRejected = get(_data, 'trip_credit_debit', null)
  console.log('approvedAndRejected', approvedAndRejected)

  const List = issueType && issueType.credit_debit_type.length > 0 ? issueType.credit_debit_type : []
  console.log('List', List)
  const issueTypeList = List.map((issueType) => {
    return { value: issueType.name, label: issueType.name }
  })
  console.log('issueTypeList', issueTypeList)

  const creditDebitList = creditDebitType.map((data) => {
    return { value: data.text, label: data.text }
  })

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    setFilter({ ...filter, offset: newOffset })
  }
  const onTripIdSearch = (e) => {
    setCurrentPage(1)
    setFilter({ ...filter, trip_id: e.target.value })
  }
  const onIssueTypeFilter = (checked) => {
    console.log('name', checked)
    setCurrentPage(1)
    setFilter({ ...filter, issue_type: checked, offset: 0 })
  }
  const onTypeFilter = (checked) => {
    console.log('checked', checked)
    setCurrentPage(1)
    setFilter({ ...filter, type: checked, offset: 0 })
  }
  const onCreatedBySearch = (e) => {
    setCurrentPage(1)
    setFilter({ ...filter, created_by: e.target.value })
  }

  const ApprovalPending = [
    {
      title: 'Load ID',
      dataIndex: 'trip_id',
      key: 'trip_id',
      width: '8%',
      render: (text, record) => (
        <Link href='/trips/[id]' as={`/trips/${record.trip_id} `}>
          <a>{text}</a>
        </Link>
      ),
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='id'
            name='id'
            type='number'
            onChange={onTripIdSearch}
          />
        </div>
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
      ),
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
        scroll={{ x: 1156, y: 550 }}
        pagination={false}
      />
      <Pagination
        size='small'
        current={currentPage}
        pageSize={filter.limit}
        showSizeChanger={false}
        onChange={pageChange}
        className='text-right p10'
      />
    </>
  )
}

export default ApprovedAndRejected
