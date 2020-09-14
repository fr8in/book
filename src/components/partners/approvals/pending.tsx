import { Table, Input, Tooltip, Button, Space, Checkbox } from 'antd'
import {
  SearchOutlined,
  CommentOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import Comment from '../../trips/tripFeedBack'
import Approve from './accept'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import PartnerOnBoardedBy from '../partnerOnboardedByName'

const PENDING_QUERY = gql`
query trip_credit_debit($status: [String!]) {
  trip_credit_debit(where: {credit_debit_status: {name: {_in: $status}}}, order_by: {trip_id: desc}) {
    id
    trip_id
    type
    amount
    approval_comment
    approved_amount
    approved_by
    is_created_by_partner
    credit_debit_status {
      id
      name
    }
    trip {
      last_comment {
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

const RegionList = [
  { text: 'North', value: 'North' },
  { text: 'South-1', value: 'South-1' },
  { text: 'East-1', value: 'East-1' },
  { text: 'West-1', value: 'West-1' },
  { text: 'South-2', value: 'South-2' },
  { text: 'East-2', value: 'East-2'},
  { text: 'West-2', value: 'West-2'}
]

const RequestedBy = [
  { value: 1, text: 'Partner' },
  { value: 2, text: 'Fr8' }
]

export default function Pending() {
  const initial = {
    commentData: [],
    commentVisible: false,
    approveData: [],
    approveVisible: false,
    title: null,
    responsibity: null,
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const [filter, setFilter] = useState(initial)
  const approvalQueryVars = {
    status: ["PENDING"]
  }
  const { loading, error, data } = useQuery(
    PENDING_QUERY,
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

  const pending = get(_data, 'trip_credit_debit', null)
  console.log('pending', pending)



  const handleName = (e) => {
    console.log('e', e)
    setFilter({ ...filter, responsibity: e.target.value })
  }


  function onChange( filters) {
    console.log('filters', filters);
  }

  const ApprovalPending = [
    {
      title: 'Load ID',
      dataIndex: 'trip_id',
      key: 'trip_id',
      width: '6%',
      render: (text, record) =>
        <Link href='/trips/[id]' as={`/trips/${record.trip_id} `}>
          <a>{text}</a>
        </Link>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '5%'
    },
    {
      title: 'Issue Type',
      dataIndex: 'issueType',
      key: 'issueType',
      width: '8%',
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name', null)} length={12} />
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '6%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      key: 'comment',
      width: '10%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      filters: RegionList,
      width: '6%',
      render: (text, record) =>get(record, 'trip.branch.region.name', null),
      onFilter: (value, record) => record.trip && record.trip.branch && record.trip.branch.region && record.trip.branch.region.name.indexOf(value) === 0,
        
     
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      filters: RequestedBy,
      width: '11%',
      render: (text, record) => <Truncate data={text} length={18} />,
     onFilter: (value, record) => value === 1 ? record.is_created_by_partner === true : value === 2 ? record.is_created_by_partner === false : record.created_by
    },
    {
      title: 'Partner Name',
      width: '12%',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${get(record, 'trip.partner.cardcode', null)}`}>
            <a> <Truncate data={get(record, 'trip.partner.cardcode', null) + '-' + get(record, 'trip.partner.name', null)} length={18} /></a>
          </Link>
        )
      },
    },
    {
      title: 'Req.On',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '7%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Responsibility',
      dataIndex: 'responsibility',
      key: 'responsibility',
      width: '10%',
      render: (text, record) =>
        <PartnerOnBoardedBy
          onboardedBy={get(record, 'responsibility.name', '-')}
          onboardedById={get(record, 'onboarded_by.id', null)}
          credit_debit_id={record.id}
        />,
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='id'
            name='id'
            type='number'
            value={filter.responsibity}
            onChange={handleName}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),

    },
    {
      title: 'Comment',
      dataIndex: 'approval_comment',
      key: 'approval_comment',
      width: '11%',
      render: (text, record) => <Truncate data={get(record, 'trip.trip_comments[0].description', null)} length={18} />
    },
    {
      title: 'Action',
      width: '8%',
      render: (text, record) => (
        <Space>
          <Tooltip title='Comment'>
            <Button
              type='link'
              icon={<CommentOutlined />}
              onClick={() => handleShow('commentVisible', null, 'commentData', record.previousComment)}
            />
          </Tooltip>
          <Tooltip title='Accept'>
            <Button
              type='primary'
              shape='circle'
              size='small'
              className='btn-success'
              icon={<CheckOutlined />}
              onClick={() =>
                handleShow('approveVisible', 'Approved', 'approveData', record)}
            />
          </Tooltip>
          <Tooltip title='Decline'>
            <Button
              type='primary'
              shape='circle'
              size='small'
              danger
              icon={<CloseOutlined />}
              onClick={() =>
                handleShow('approveVisible', 'Rejected', 'approveData', record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <>
      <Table
        columns={ApprovalPending}
        dataSource={pending}
        onChange={onChange}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1156, y: 600 }}
        pagination={false}
        className='withAction'
      />
      {object.commentVisible && (
        <Comment
          visible={object.commentVisible}
          data={object.commentData}
          onHide={handleHide}
        />
      )}
      {object.approveVisible && (
        <Approve
          visible={object.approveVisible}
          onHide={handleHide}
          data={object.approveData}
          title={object.title}
        />
      )}
    </>
  )
}
