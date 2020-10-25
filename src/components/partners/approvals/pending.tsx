import { Table, Input, Tooltip, Button, Space } from 'antd'
import {
  SearchOutlined,
  CommentOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useState, useEffect, useContext } from 'react'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import Comment from '../../trips/tripFeedBack'
import Approve from './accept'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import PartnerOnBoardedBy from '../partnerOnboardedByName'
import LinkComp from '../../common/link'
import u from '../../../lib/util'

import userContext from '../../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'

const PENDING_SUBSCRIPTION = gql`
subscription trip_credit_debit($status: [String!]) {
  trip_credit_debit(where: {credit_debit_status: {name: {_in: $status}}}, order_by: {created_at: desc}) {
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
    credit_debit_type {
      name
    }
  }
}`

const Pending = () => {
  const { role } = u
  const access = [role.admin, role.rm]
  const approve_access = [role.admin, role.rm]
  const reject_access = [role.admin, role.rm]
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

  const context = useContext(userContext)
  const approval_access = !isEmpty(approve_access) ? context.roles.some(r => approve_access.includes(r)) : false
  const rejected_access = !isEmpty(reject_access) ? context.roles.some(r => reject_access.includes(r)) : false
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const [filter, setFilter] = useState(initial)

  const { loading, error, data } = useSubscription(
    PENDING_SUBSCRIPTION,
    {
      variables: {
        status: ['PENDING']
      }
    }
  )
  console.log('pending error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const pending_list = get(_data, 'trip_credit_debit', null)

  useEffect(() => {
    setFilter({ ...filter, pending: pending_list })
  }, [pending_list])

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
      width: '4%'
    },
    {
      title: 'Issue Type',
      dataIndex: 'issueType',
      key: 'issueType',
      width: '8%',
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name', null)} length={10} />
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
      width: '11%',
      render: (text, record) => <Truncate data={text} length={13} />
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      width: '6%',
      render: (text, record) => get(record, 'trip.branch.region.name', null)

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
            data={get(record, 'trip.partner.cardcode', null) + '-' + get(record, 'trip.partner.name', null)}
            id={get(record, 'trip.partner.cardcode', null)}
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
      render: (text, record) => <Truncate data={get(record, 'trip.last_comment.description', null)} length={15} />
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
              onClick={() => handleShow('commentVisible', null, 'commentData', record.trip_id)}
            />
          </Tooltip>
          <Tooltip title='Accept'>
            {approval_access ? (
              <Button
                type='primary'
                shape='circle'
                size='small'
                className='btn-success'
                icon={<CheckOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Approved', 'approveData', record)}
              />) : null}
          </Tooltip>
          <Tooltip title='Decline'>
            {rejected_access ? (
              <Button
                type='primary'
                shape='circle'
                size='small'
                danger
                icon={<CloseOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Rejected', 'approveData', record.id)}
              />) : null}
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <>
      <Table
        columns={ApprovalPending}
        dataSource={filter.pending}
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
      {object.approveVisible && (
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
