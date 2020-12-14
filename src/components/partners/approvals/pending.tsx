import { Table, Input, Tooltip, Button, Space } from 'antd'
import {
  SearchOutlined,
  CommentOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useState,  useContext } from 'react'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import Comment from '../../trips/tripFeedBack'
import Approve from './accept'
import IncentiveApprove from './incentiveApprove'
import { gql, useSubscription, } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import PartnerOnBoardedBy from '../partnerOnboardedByName'
import LinkComp from '../../common/link'
import u from '../../../lib/util'
import userContext from '../../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'

const PENDING_SUBSCRIPTION = gql`
subscription trip_credit_debit($status: [String!], $incentive_status: String!, $incentive_source: String!) {
  trip(where: {_or: [{credit_debits: {id: {_is_null: false}}}, {incentives: {id: {_is_null: false}}}]}) {
    id
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
    credit_debits(where: {credit_debit_status: {name: {_in: $status}}}) {
      id
      trip_id
      type
      amount
      comment
      created_at
      created_by
      is_created_by_partner
      credit_debit_status {
        id
        name
      }
      responsibility {
        id
        name
      }
      credit_debit_type {
        name
      }
    }
    incentives(where: {source: {_eq: $incentive_source}, incentive_status: {status: {_eq: $incentive_status}}, incentive_config: {auto_creation: {_eq: false}}}) {
      id
      trip_id
      amount
      comment
      created_at
      created_by
      incentive_config {
        type
      }
      incentive_status {
        status
      }
    }
  }
}

  `

const Pending = () => {
  const { role } = u
  const context = useContext(userContext)
  const access = [role.admin, role.rm, role.partner_support]
  const approve_roles = [role.admin, role.rm, role.partner_manager, role.partner_support]
  const approval_access = u.is_roles(approve_roles, context)
  const reject_roles = [role.admin, role.rm, role.partner_manager, role.partner_support]
  const rejected_access = u.is_roles(reject_roles, context)

  const initial = {
    commentData: [],
    commentVisible: false,
    approveData: [],
    approveVisible: false,
    title: null,
    responsibity: null,
    searchText: null,
    pending: []
  }

  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const [filter, setFilter] = useState(initial)


  const { loading, error, data } = useSubscription(
    PENDING_SUBSCRIPTION,
    {
      variables: {
        status: ['PENDING'],
        incentive_status: 'PENDING',
        incentive_source: 'TRACK'

      }
    }
  )
  console.log('pending error', error)

  let _data = {}
  let pending_list = [];
  if (!loading) {
    _data = data
const trip = get(data,'trip', null)

!isEmpty(trip) ? trip.map((trip_data) => {
  !isEmpty(trip_data) ?  trip_data.credit_debits.map((credit_debit) => {
        pending_list.push({
            "id": credit_debit.id,
            "trip_id": credit_debit.trip_id,
            "comment": credit_debit.comment,
            "type": credit_debit.type,
            "amount": credit_debit.amount,
            "region": trip_data.branch.region.name,
            "partner_name": trip_data.partner.name,
            "partner_code": trip_data.partner.cardcode,
            "created_at": credit_debit.created_at,
            "responsibility": credit_debit.responsibility ? credit_debit.responsibility.name : '',
            "last_comment": trip_data.last_comment.description,
            "issue_type": credit_debit.credit_debit_type.name,
            "created_by": credit_debit.created_by
          })
      }) : []

      !isEmpty(trip_data) ?  trip_data.incentives.map((incentive) => {
          pending_list.push({
            "id": incentive.id,
            "trip_id": incentive.trip_id,
            "comment": incentive.comment,
            "type": 'I',
            "amount": incentive.amount,
            "region": trip_data.branch.region.name,
            "partner_name": trip_data.partner.name,
            "partner_code": trip_data.partner.cardcode,
            "created_at": incentive.created_at,
            "last_comment": trip_data.last_comment.description,
            "issue_type": incentive.incentive_config.type,
            "created_by": incentive.created_by,
            "incentive_config": incentive.incentive_config
          }) 
      }) : []
    }) 
  : null}

  const onSearch = (e) => {
    setFilter({ ...filter, searchText: e.target.value })
    const searchText = e.target.value
    console.log('searchText', filter)
    if (searchText.length >= 3) {
      const regex = new RegExp(searchText, 'gi')
      const removeNull = filter.pending.filter(record => record.responsibility != null)
      const newData = removeNull.filter(record => record.responsibility.name.match(regex))
      const result = newData || filter.pending
      setFilter({ ...filter, pending: result })
    } else {
      setFilter({ ...filter, pending: pending_list })
    }
  }

  const ApprovalPending = [
    {
      title: '#',
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
      width: '4%',
      render: (text, record) => get(record, 'type', null)
    },
    {
      title: 'Issue Type',
      dataIndex: 'issueType',
      key: 'issueType',
      width: '8%',
      render: (text, record) => <Truncate data={get(record, 'issue_type', null)} length={10} />
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '6%',
      render: (text, record) => get(record, 'amount', null)
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      key: 'comment',
      width: '11%',
      render: (text, record) => <Truncate data={text} length={13} />
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      width: '6%',
      render: (text, record) => get(record, 'region', null)

    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      width: '11%',
      render: (text, record) => <Truncate data={text} length={15} />
    },
    {
      title: 'Partner Name',
      dataIndex: 'partner',
      key: 'partner',
      width: '12%',
      render: (text, record) => {
        return (
          <LinkComp
            type='partners'
            data={get(record, 'partner_code', null) + '-' + get(record, 'partner_name', null)}
            id={get(record, 'partner_code', null)}
            length={14}
          />
        )
      }
    },
    {
      title: 'Req.On',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '7%',
      render: (text, record) => {
        return get(record, 'created_at', null) ? moment(get(record, 'created_at', null)).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Responsibility',
      dataIndex: 'responsibility',
      key: 'responsibility',
      width: '10%',
      render: (text, record) =>
        <PartnerOnBoardedBy
          onboardedBy={get(record, 'responsibility', '-')}
          credit_debit_id={record.id}
          edit_access={access}
        />,
      filterDropdown: (
        <div>
          <Input
            placeholder='Search'
            id='id'
            name='id'
            onChange={onSearch}

          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )

    },
    {
      title: 'Comment',
      dataIndex: 'last_comment',
      key: 'last_comment',
      width: '11%',
      render: (text, record) => (
        record.type === 'I' ? <></> :
          <Truncate data={get(record, 'last_comment', null)} length={15} />
      )
    },
    {
      title: 'Action',
      width: '8%',
      render: (text, record) => (
        <Space>
          {
            record.type === 'I' ? <Space>&emsp; &emsp; </Space> :
              <Tooltip title='Comment'>
                <Button
                  type='link'
                  icon={<CommentOutlined />}
                  onClick={() => handleShow('commentVisible', null, 'commentData', record.trip_id)}
                />
              </Tooltip>}
          <Tooltip title='Approve'>
            {approval_access ? (
              <Button
                type='primary'
                shape='circle'
                size='small'
                className='btn-success'
                icon={<CheckOutlined />}
                onClick={(e) => {
                  handleShow('approveVisible', 'Approve', 'approveData', record)
                }
                } />) : null
            }
          </Tooltip>
          <Tooltip title='Reject'>
            {rejected_access ? (
              <Button
                type='primary'
                shape='circle'
                size='small'
                danger
                icon={<CloseOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Reject', 'approveData', record)}
              />) : null
            }
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <>
      <Table
        columns={ApprovalPending}
        dataSource={pending_list}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1256 }}
        pagination={false}
        className='withAction'
        loading={loading}
      />

      {object.commentVisible && (
        <Comment
          visible={object.commentVisible}
          tripid={object.commentData}
          onHide={handleHide}
        />
      )}

      { object.approveData && object.approveData.type === "I" ? (
       object.approveVisible && (
            <IncentiveApprove
              visible={object.approveVisible}
              onHide={handleHide}
              item_id={object.approveData}
              title={object.title}
              trip_id={object.approveData.trip_id}
            />
          )) :
       object.approveVisible && (
            <Approve
              visible={object.approveVisible}
              onHide={handleHide}
              item_id={object.approveData}
              title={object.title}
            />
          )}
    </>
  )
}

export default Pending
