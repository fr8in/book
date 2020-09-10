import React, {useState} from 'react'
import { Table, Input, Pagination } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import { gql, useQuery, useMutation } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import u from '../../../lib/util'
import { APPROVALS_QUERY } from '../approvals/container/query/approvalsQuery'

const creditType = [
  { value: 1, text: 'Credit Note' },
  { value: 2, text: 'Debit Note' },
  { value: 3, text: 'Dispute' }
]
const issueTypeList = [
  { value: 1, text: 'Loading Charges' },
  { value: 2, text: 'Unloading Charges' },
  { value: 3, text: 'Loading Halting' },
  { value: 4, text: 'Unloading Halting' },
  { value: 5, text: 'Commission Fee' },
  { value: 6, text: 'POD Late Fee' },
  { value: 7, text: 'POD Missing' },
  { value: 8, text: 'Price Difference' },
  { value: 9, text: 'On-Hold' }
]
const requestedBy = [
  { value: 1, text: 'Partner' },
  { value: 2, text: 'Fr8' }
]

const ApprovedAndRejected = () => {

  const pendingQueryVars = {
    offset: 0,
    limit: u.limit,
    status: ["APPROVED","REJECTED"]  
  }
  const [filter, setFilter] = useState(pendingQueryVars)
  const [currentPage, setCurrentPage] = useState(1)

  const { loading, error, data } = useQuery(
    APPROVALS_QUERY,
   {
     variables: pendingQueryVars,
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
      width: '8%'
    },
    {
      title: 'Issue Type',
      dataIndex: 'issueType',
      key: 'issueType',
      filters: issueTypeList,
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name',null)} length={12} />
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
