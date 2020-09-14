import React, {useState} from 'react'
import { Table, Input, Pagination } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import u from '../../../lib/util'

const APPROVALS_QUERY = gql`
query trip_credit_debit($status: [String!], $offset: Int, $limit: Int, $region: [String!], $responsibity: String,$created_by:String) {
  trip_credit_debit(where: {credit_debit_status: {name: {_in: $status}}, trip: {branch: {region: {name: {_in: $region}}}}, responsibility: {name: {_ilike: $responsibity}}, trip_id: {}, created_by: {_ilike: $created_by}}, order_by: {trip_id: desc}, offset: $offset, limit: $limit) {
    id
    trip_id
    type
    amount
    approval_comment
    approved_amount
    approved_by
    credit_debit_status {
      id
      name
    }
    trip {
      trip_comments(order_by: {id: desc}, limit: 1) {
        id
        description
      }
      branch {
        region {
          name
        }
      }
      partner {
        cardcode
        name
      }
    }
    responsibility {
      id
      name
    }
    comment
    credit_debit_type {
      name
    }
    created_at
    created_by
  }
  region {
    name
    id
  }
}
`

const creditType = [
  { value: 1, text: 'C' },
  { value: 2, text: 'D' }
]
const issueTypeList = [
  { value: 1, text: 'KM' },
  { value: 2, text: 'Others' },
  { value: 3, text: 'Shortage' },
  { value: 4, text: 'Loading Charges' },
  { value: 5, text: 'Unloading Charges' },
  { value: 6, text: 'Loading Halting' },
  { value: 7, text: 'Unloading Halting' },
  { value: 8, text: 'Commission Fee' },
  { value: 9, text: 'Late Delivery Fee' },
  { value: 10, text: 'POD Late Fee' },
  { value: 11, text: 'POD Missing' },
  { value: 12, text: 'Wrong LR' },
  { value: 13, text: 'Price Difference' },
  { value: 14, text: 'On-Hold' },
  { value: 15, text: 'Halting' }
]
const requestedBy = [
  { value: 1, text: 'Partner' },
  { value: 2, text: 'Fr8' }
]

const ApprovedAndRejected = () => {

const initial = {
  created_by:null,
  offset: 0,
  limit: u.limit,
  status: ["APPROVED","REJECTED"],
}

  
  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const approvalQueryVars = {
    offset: 0,
    limit: u.limit,
    status: ["APPROVED","REJECTED"],
    created_by: filter.created_by ? `%${filter.created_by}%` : null 
  }

  const { loading, error, data } = useQuery(
    APPROVALS_QUERY,
   {
     variables: approvalQueryVars,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  }
  )
  console.log('pending error', error)
  console.log('pending data', data)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const approvedAndRejected = get(_data, 'trip_credit_debit', null)
  console.log('approvedAndRejected',approvedAndRejected)

const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    setFilter({ ...filter, offset: newOffset })
  }

  const onCreatedBySearch = (e) => {
    setCurrentPage(1)
    setFilter({ ...filter, created_by: e.target.value })
  }

  function onChange( filters) {
    console.log('filters', filters);
  }
  const ApprovalPending = [
    {
      title: 'Load ID',
      dataIndex: 'trip_id',
      key: 'trip_id',
      width: '7%',
      render: (text, record) => (
        <Link href='/trips/[id]' as={`/trips/${record.trip_id} `}>
          <a>{text}</a>
        </Link>
      ),
      filterDropdown: (
        <div>
          <Input placeholder='Search' id='id' name='id' type='number' />
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
      filters: creditType,
      width: '8%',
      onFilter: (value, record) => record && record.type.indexOf(value) === 0,
    },
    {
      title: 'Issue Type',
      dataIndex: 'issueType',
      key: 'issueType',
      filters: issueTypeList,
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name',null)} length={12} />,
      onFilter: (value, record) => record && record.credit_debit_type && record.credit_debit_type.name.indexOf(value) === 0,
    },
    {
      title: 'Claim ₹',
      dataIndex: 'amount',
      width: '6%'
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
      width: '11%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    {
      title: 'Request By',
      dataIndex: 'created_by',
      key: 'created_by',
      filters: requestedBy,
      width: '12%',
      render: (text, record) => <Truncate data={text} length={18} />,
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='created_by'
            name='created_by'
            type='number'
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
      width: '11%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    {
      title: 'Remarks',
      dataIndex: 'approval_comment',
      key: 'approval_comment',
      width: '11%',
      render: (text, record) => <Truncate data={text} length={12} />
    }
  ]

  return (
    <>
    <Table
      columns={ApprovalPending}
      dataSource={approvedAndRejected}
      onChange={onChange}
      rowKey={(record) => record.id}
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
