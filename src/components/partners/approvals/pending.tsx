import { Table, Input, Tooltip, Button, Space } from 'antd'
import {
  SearchOutlined,
  CommentOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import Comment from '../../trips/tripFeedBack'
import Approve from './accept'
import { useQuery } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import PartnerOnBoardedBy from '../partnerOnboardedByName'
import { APPROVALS_QUERY } from '../approvals/container/query/approvalsQuery'
const RegionList = [
  { value: 1, text: 'North' },
  { value: 11, text: 'South-1' },
  { value: 12, text: 'East-1' },
  { value: 13, text: 'West-1' },
  { value: 20, text: 'South-2' },
  { value: 21, text: 'East-2' },
  { value: 22, text: 'West-2' }
]
const RequestedBy = [
  { value: 1, text: 'Partner' },
  { value: 11, text: 'Fr8' }
]



export default function Pending () {
  const initial = {
    commentData: [],
    commentVisible: false,
    approveVisible: false,
    title: null,
    approveData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const { loading, error, data } = useQuery(
    APPROVALS_QUERY,
   {
     variables: 
     {
      "status": ["PENDING"]
     },
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
  console.log('pending',pending)


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
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name',null)} length={12} />
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
      render: (text, record) => get(record, 'trip.branch.region.name',null)
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      filters: RequestedBy,
      width: '11%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    {
      title: 'Partner Name',
      dataIndex: 'created_by',
      key: 'created_by',
      filters: RequestedBy,
      width: '12%',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${get(record, 'trip.partner.cardcode',null)}`}>
            <a> <Truncate data={get(record, 'trip.partner.cardcode',null) +'-'+ get(record, 'trip.partner.name',null)} length={18} /></a>
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
          <Input placeholder='Search' id='id' name='id' type='number' />
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
      render: (text, record) => <Truncate data={get(record, 'trip.trip_comments[0].description',null)} length={18} />
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
