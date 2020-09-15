import React, {useState} from 'react'
import { Table, Input, Pagination , Checkbox} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import u from '../../../lib/util'

const APPROVALS_QUERY = gql`
query trip_credit_debit($status: [String!], $offset: Int, $limit: Int, $created_by: String, $type: [String!],$creditType:[bpchar!]) {
  trip_credit_debit(where: {credit_debit_status: {name: {_in: $status}}, created_by: {_ilike: $created_by}, credit_debit_type: {name: {_in: $type}}, type: {_in: $creditType}}, order_by: {trip_id: desc}, offset: $offset, limit: $limit) {
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
  credit_debit_type {
    id
    name
  }
}

`

const creditType = [
  { value: 1, text: 'C' },
  { value: 2, text: 'D' }
]

const ApprovedAndRejected = () => {

const initial = {
  created_by:null,
  offset: 0,
  limit: u.limit,
  type:null,
  creditType:null
} 
  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const approvalQueryVars = {
    offset: 0,
    limit: u.limit,
    status: ["APPROVED","REJECTED"],
    created_by: filter.created_by ? `%${filter.created_by}%` : null, 
    type: filter.type && filter.type.length > 0 ? filter.type : null,
    creditType: filter.creditType &&  filter.creditType.length > 0 ?  filter.creditType : null
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
  const credit_debit_type = get(_data, 'credit_debit_type', [])
  console.log('approvedAndRejected',approvedAndRejected)
  console.log('creditDebitType',credit_debit_type)

const typeList = credit_debit_type.map((data) => {
  return { value: data.name, label: data.name }
})
console.log('typeList',typeList)


const creditDebitList = creditType.map((data) => {
    return { value: data.text, label: data.text }
   })
const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    setFilter({ ...filter, offset: newOffset })
  }
  const handleCreditDebitFilter = (checked) => {
    console.log('checked', checked)
    setCurrentPage(1)
    setFilter({ ...filter, creditType: checked, offset: 0 })
  }

  const onCreatedBySearch = (e) => {
    setCurrentPage(1)
    setFilter({ ...filter, created_by: e.target.value })
  }
  const onTypeFilter = (name) => {
    console.log('name',name)
    setCurrentPage(1)
    setFilter({ ...filter, type: name ,offset: 0 })
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
      filterDropdown: (
        <Checkbox.Group
          options={creditDebitList}
          // defaultValue={filter.creditType}
           onChange={handleCreditDebitFilter}
           className='filter-drop-down'
        />
      )
    },
    {
      title: 'Issue Type',
      dataIndex: 'issueType',
      key: 'issueType',
      //filters: issueTypeList,
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name',null)} length={12} />,
      filterDropdown: (
        <Checkbox.Group
          options={typeList}
          //defaultValue={filter.type}
          onChange={onTypeFilter}
          className='filter-drop-down'
        />
      ),
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
      width: '12%',
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
