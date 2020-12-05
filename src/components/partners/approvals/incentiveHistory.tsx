import React, { useState } from 'react'
import { Table, Input, Pagination, Checkbox,Radio } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import { gql, useQuery, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import u from '../../../lib/util'



const issue_type_list = [
    {
      value: '1',
      label: 'Referral '
    }
  ]

  const status_list = [
    {
      value: '1',
      label: 'Approved '
    },
    {
        value:'2',
        label: 'Rejected'
    }
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
          //onChange={onTripIdSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
   
    {
      title: 'Incentive Type',
      dataIndex: 'issueType',
      key: 'issueType',
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name', null)} length={12} />,
      filterDropdown: (
        <Checkbox.Group
          options={issue_type_list}
          defaultValue={filter.issue_type}
         // onChange={onIssueTypeFilter}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'Amount ₹',
      dataIndex: 'approved_amount',
      key: 'approved',
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
      title: 'Request By',
      dataIndex: 'created_by',
      key: 'created_by',
      width: '10%',
      render: (text, record) => <Truncate data={text} length={18} />,
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='created_by'
            name='created_by'
            value={filter.created_by}
            //onChange={onCreatedBySearch}
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
        title: 'Status',
        render: (text, record) => get(record, 'partner_status.name', null),
        width: '10%',
        filterDropdown: (
          <Radio.Group
            options={status_list}
           // defaultValue={filter.partner_statusId[0]}
           // onChange={handleStatus}
            className='filter-drop-down'
          />
        )
      },
    {
      title: 'Approved By',
      dataIndex: 'approved_by',
      key: 'approved_by',
      width: '10%',
      render: (text, record) => <Truncate data={text} length={18} />
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
        //dataSource={approvedAndRejected}
        rowKey={(record) => record.id}
        //loading={loading}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />
      {/* {!loading && record_count ? (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />) : null} */}
    </>
  )
}

export default ApprovedAndRejected
