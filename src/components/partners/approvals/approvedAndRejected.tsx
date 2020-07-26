import React from 'react'
import { Table, Tooltip, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import pendingDetail from '../../../../mock/approval/approvalPending'

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

export default function ApprovedAndRejected () {
  const ApprovalPending = [
    {
      title: 'Load ID',
      dataIndex: 'loadId',
      key: 'loadId',
      width: '7%',
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
      width: '10%'
    },
    {
      title: 'Claim ₹',
      dataIndex: 'claim',
      width: '6%'
    },
    {
      title: 'Approved ₹',
      dataIndex: 'approved',
      key: 'approved',
      width: '8%'
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: '11%'
    },
    {
      title: 'Request By',
      dataIndex: 'requestBy',
      key: 'requestBy',
      filters: requestedBy,
      width: '12%',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='requestBy'
            name='requestBy'
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
      dataIndex: 'reqOn',
      key: 'reqOn',
      sorter: (a, b) => (a.reqOn > b.reqOn ? 1 : -1),
      width: '7%'
    },
    {
      title: 'Closed By',
      dataIndex: 'closedBy',
      key: 'closedBy',
      width: '11%'
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '11%',
      render: (text, record) => {
        return record.remarks && record.remarks.length > 12 ? (
          <Tooltip title={record.remarks}>
            <span> {record.remarks.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          record.remarks
        )
      }
    }
  ]

  return (
    <Table
      columns={ApprovalPending}
      dataSource={pendingDetail}
      size='small'
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  )
}
