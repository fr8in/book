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
import { isNil } from 'lodash'

const APPROVED_REJECTED_SUBSCRIPTION = gql`
subscription trip_credit_debit_approval($offset: Int, $limit: Int, $credit_debit_where: trip_credit_debit_bool_exp, $incentive_where: incentive_bool_exp) {
  trip(order_by: {id: desc}, offset: $offset, limit: $limit, where: {_or: [{credit_debits: {id: {_is_null: false}}}, {incentives: {id: {_is_null: false}}}]}) {
    id
    partner {
      cardcode
      name
    }
    credit_debits(where: $credit_debit_where) {
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
      trip {
        partner {
          name
        }
      }
      credit_debit_status {
        id
        name
      }
      credit_debit_type {
        name
      }
    }
    incentives(where: $incentive_where) {
      id
      amount
      trip_id
      amount
      approved_by
      comment
      created_at
      created_by
      incentive_config {
        type
      }
    }
  }
}
`

const CREDIT_DEBIT_TYPE_QUERY = gql`query credit_debit_agg_type($credit_debit_where: trip_credit_debit_bool_exp!, $incentive_where: incentive_bool_exp) {
  trip_credit_debit_aggregate(where: $credit_debit_where) {
    aggregate {
      count
    }
  }
  incentive_aggregate(where: $incentive_where) {
    aggregate {
      count
    }
  }
  credit_debit_type {
    id
    active
    name
  }
  incentive_config (where:{auto_creation:{_eq:false}}){
    type
  }
}
`

const creditDebitType = [
  { value: 1, text: 'C' },
  { value: 2, text: 'D' },
  { value: 3, text: 'I' }
]

const type = 'I'

const ApprovedAndRejected = () => {
  const initial = {
    offset: 0,
    limit: u.limit,
    trip_id: null,
    type: null,
    issue_type: [],
    created_by: null,
    partner_name: null
  }

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const credit_debit_where = {
    trip_id: filter.trip_id && filter.trip_id.length > 0 ? { _in: filter.trip_id } : { _in: null },
    type: filter.type && filter.type.length > 0 ? { _in: filter.type } : { _in: null },
    credit_debit_type: filter.issue_type && filter.issue_type.length > 0 ? { name: { _in: filter.issue_type } } : { name: { _in: null } },
    created_by: filter.created_by ? { _ilike: `%${filter.created_by}%` } : { _ilike: null },
    trip: {partner: {name: {_ilike:filter.partner_name ?  `%${filter.partner_name}%`  :  null }}},
    credit_debit_status: { name: { _in: ['APPROVED', 'REJECTED'] } }
  }
  let incentive_status_filter = []
  let incentive_type_list = null
  if (isNil(filter.type) || filter.type.length === 0 || filter.type.includes('I')) {
    incentive_status_filter = ['PAID', 'REJECTED']
    incentive_type_list = filter.issue_type && filter.issue_type.length > 0 ? filter.issue_type : null
  }

  const incentive_where = {
    trip_id: filter.trip_id && filter.trip_id.length > 0 ? { _in: filter.trip_id } : { _in: null },
    created_by: filter.created_by ? { _ilike: `%${filter.created_by}%` } : { _ilike: null },
    source: { _eq: "TRACK" },
    incentive_status: { status: { _in: incentive_status_filter } },
    incentive_config: { auto_creation: { _eq: false } }, _and: { incentive_config: { type: { _in: incentive_type_list } } },
    trip: {partner: {name: {_ilike:filter.partner_name ?  `%${filter.partner_name}%`  :  null }}}
  }

  const approvalQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    credit_debit_where: credit_debit_where,
    incentive_where: incentive_where
  }

  const { loading, error, data } = useSubscription(
    APPROVED_REJECTED_SUBSCRIPTION,
    {
      variables: approvalQueryVars
    }
  )

  const { data: f_data, loading: filter_loading } = useQuery(
    CREDIT_DEBIT_TYPE_QUERY,
    {
      variables: { credit_debit_where: credit_debit_where, incentive_where: incentive_where },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  let credit_debit_incentive_data = [];
  if (!loading) {
    _data = data
    const trip = get(data,'trip', null)

    !isEmpty(trip) ? trip.map((trip_data) => {
      !isEmpty(trip_data) ? trip_data.credit_debits.map((credit_debit) => {
          credit_debit_incentive_data.push({
            "id": credit_debit.id,
            "trip_id": credit_debit.trip_id,
            "comment": credit_debit.comment,
            "type": credit_debit.type,
            "amount": credit_debit.amount,
            "created_at": credit_debit.created_at,
            "responsibility": credit_debit.responsibility ? credit_debit.responsibility.name : '',
            "issue_type": credit_debit.credit_debit_type.name,
            "created_by": credit_debit.created_by,
            "approved_amount": credit_debit.approved_amount,
            "approval_comment": credit_debit.approval_comment,
            "approved_by": credit_debit.approved_by,
            "partner_name": trip_data.partner.name,
          })
      }):[]

      !isEmpty(trip_data) ?  trip_data.incentives.map((incentive) => {
          credit_debit_incentive_data.push({
            "id": incentive.id,
            "trip_id": incentive.trip_id,
            "comment": incentive.comment,
            "type": type,
            "amount": incentive.amount,
            "created_at": incentive.created_at,
            "issue_type": incentive.incentive_config.type,
            "created_by": incentive.created_by,
            "approved_by": incentive.approved_by,
            "partner_name": trip_data.partner.name,
          })
      }) :[]
    })
   : null
  }

  let filter_data = {}
  if (!filter_loading) {
    filter_data = f_data
  }

  const credit_debit_type = get(filter_data, 'credit_debit_type', [])
  const issueTypeList =   credit_debit_type.map((data) => {
    return { value: data.name, label: data.name }
  })
  const incentive_type = get(filter_data, 'incentive_config', [])
  const incentive_config =  incentive_type.map((data) => {
    return { value: data.type, label: data.type }
  }) 

   const filter_list = incentive_config.concat(issueTypeList)

  const record_count = get(filter_data, 'trip_credit_debit_aggregate.aggregate.count', 0)

  const creditDebitList = creditDebitType.map((data) => {
    return { value: data.text, label: data.text }
  })
  console.log("creditDebitList", creditDebitList)

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
  const onPartnerSearch = (e) => {
    setCurrentPage(1)
    setFilter({ ...filter, partner_name: e.target.value })
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
      render: (text, record) => get(record, 'type', null),
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
      render: (text, record) => <Truncate data={get(record, 'issue_type', null)} length={12} />,
      filterDropdown: (
        <Checkbox.Group
          options={filter_list}
          defaultValue={filter.issue_type}
          onChange={onIssueTypeFilter}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'Claim ₹',
      dataIndex: 'amount',
      width: '7%'
    },
    {
      title: 'Approved ₹',
      dataIndex: 'approved_amount',
      key: 'approved',
      width: '8%',
      render: (text, record) => get(record, 'approved_amount', record.amount)
    },
    {
      title: 'Partner',
      key: 'partner',
      width: '12%',
      render: (text, record) => get(record, 'partner_name',null), 
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='partner_name'
            name='partner_name'
            value={filter.partner_name}
            onChange={onPartnerSearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      key: 'comment',
      width: '9%',
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
        return get(record, 'created_at', null) ? moment(get(record, 'created_at', null)).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Closed By',
      dataIndex: 'approved_by',
      key: 'approved_by',
      width: '12%',
      render: (text, record) => <Truncate data={get(record, 'approved_by', null)} length={18} />
    },
    {
      title: 'Remarks',
      dataIndex: 'approval_comment',
      key: 'approval_comment',
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'approval_comment', null)} length={12} />
    }
  ]

  return (
    <>
      <Table
        columns={ApprovalPending}
        dataSource={credit_debit_incentive_data}
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
