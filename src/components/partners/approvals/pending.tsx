import { Table, Input, Tooltip, Button, Space, Checkbox } from 'antd'
import {SearchOutlined,CommentOutlined,CheckOutlined,CloseOutlined} from '@ant-design/icons'
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

const PENDING_SUBSCRIPTION = gql`
subscription trip_credit_debit($trip_credit_debit: trip_credit_debit_bool_exp) {
  trip_credit_debit(where: $trip_credit_debit,) {
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
        partner_connected_city {
          connected_city {
            branch {
              region {
                name
              }
            }
          }
        }
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
}
`

const Pending = () => {
  const { role } = u
  const access = [role.admin, role.rm, role.partner_support]
  const approve_roles = [role.admin, role.rm, role.partner_manager, role.partner_support]
  const reject_roles = [role.admin, role.rm, role.partner_manager, role.partner_support]
  const initial = {
    commentData: [],
    commentVisible: false,
    approveData: [],
    approveVisible: false,
    title: null,
    responsibity: null,
    searchText: null,
    pending: [],
    partnername: null,
    region: []
  }

  const context = useContext(userContext)
  const approval_access = u.is_roles(approve_roles, context)
  const rejected_access = u.is_roles(reject_roles, context)
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const [filter, setFilter] = useState(initial)
  console.log('filter', filter)
  const trip_credit_debit = {
    credit_debit_type: { name: { _neq: "Shortage" } },
    credit_debit_status: { name: { _in: ["PENDING"] } },
    trip: { partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null }, partner_connected_city: { connected_city: { branch: { region: filter.region && filter.region.length > 0 ? { name: { _in: filter.region } } : { name: { _in: null } } } } } } }
  }

  const { loading, error, data } = useSubscription(
    PENDING_SUBSCRIPTION,
    {
      variables: {
        trip_credit_debit: trip_credit_debit
      }
    }
  )
  let _data = {}
  if (!loading) {
    _data = data
  }

  const pending_list = get(_data, 'trip_credit_debit', null)

  useEffect(() => {
    setFilter({ ...filter, pending: pending_list })
  }, [pending_list])

  const regions = u.regions
  const regionsList = regions.map((data) => {
    return { value: data.text, label: data.text }
  })


  const onSearch = (e) => {
    setFilter({ ...filter, searchText: e.target.value })
    const searchText = e.target.value
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
  const onPartnerSearch = (e) => {
    setFilter({ ...filter, partnername: e.target.value })
  }
  const onRegionFilter = (checked) => {
    setFilter({ ...filter, region: checked })
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
      width: '9%',
      render: (text, record) => <Truncate data={text} length={11} />
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      width: '6%',
      render: (text, record) => get(record, 'trip.partner.partner_connected_city.connected_city.branch.region.name', null),
      filterDropdown: (
        <Checkbox.Group
          options={regionsList}
          defaultValue={filter.region}
          onChange={onRegionFilter}
          className='filter-drop-down'
        />
      )
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
            data={get(record, 'trip.partner.name', null) + '-' + get(record, 'trip.partner.cardcode', null)}
            id={get(record, 'trip.partner.cardcode', null)}
            length={14}
          />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search'
          id='partner_name'
          name='partner_name'
          value={filter.partnername}
          onChange={onPartnerSearch}
        />
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
      width: '7%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Responsibility',
      dataIndex: 'responsibility',
      key: 'responsibility',
      width: '11%',
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
      width: '9%',
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
                  handleShow('approveVisible', 'Approve', 'approveData', record)}
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
                  handleShow('approveVisible', 'Reject', 'approveData', record)}
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
          trip_id={object.approveData.trip_id}
        />
      )}
    </>
  )
}

export default Pending
