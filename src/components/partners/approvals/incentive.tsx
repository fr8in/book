import { Table, Input, Tooltip, Button, Space, Checkbox } from 'antd'
import {
    SearchOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons'
import { useState, useContext } from 'react'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import { gql, useSubscription, useQuery } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import IncentiveApprove from '../../partners/approvals/incentiveApprove'
import LinkComp from '../../common/link'
import u from '../../../lib/util'
import userContext from '../../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'

const INCENTIVE = gql`
subscription incentive($incentive_where:incentive_bool_exp) {
    incentive(where: $incentive_where) {
      id
      trip_id
      trip {
        partner {
          name
          cardcode
        }
        branch {
          region {
            name
          }
        }
      }
      amount
      comment
      created_at
      created_by
      source
      incentive_config {
        type
      }
      incentive_status {
        status
      }
    }
  }  
  `
const region_query = gql`
  query region_query{
    region{
      id
      name
    }
  }`

const Incentive = () => {
    const { role } = u
    const approve_roles = [role.admin, role.rm, role.partner_manager, role.partner_support]
    const reject_roles = [role.admin, role.rm, role.partner_manager, role.partner_support]
    const initial = {
        approveData: [],
        approveVisible: false,
        title: null,
        pending: [],
        partnername: null,
        region: []
    }
    const context = useContext(userContext)
    const approval_access = u.is_roles(approve_roles, context)
    const rejected_access = u.is_roles(reject_roles, context)

    const [filter, setFilter] = useState(initial)

    const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
    const incentive_where = {
        source: {_eq: "TRACK"},
        incentive_status: { status: { _eq: "PENDING" } },
        incentive_config: { auto_creation: { _eq: false } },
        trip: {
            branch: { region: filter.region && filter.region.length > 0 ? { name: { _in: filter.region } } : { name: { _in: null } } },
            partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } }
        }
    }
    const { loading, error, data } = useSubscription(
        INCENTIVE,
        {
            variables: {
                incentive_where: incentive_where
            }
        }
    )

    let _data = {}
    if (!loading) {
        _data = data
    }

    const incentive_list = get(_data, 'incentive', null)

    const { loading: region_loading, error: region_error, data: region_data } = useQuery(
        region_query,
    )

    let _region = {}
    if (!region_loading) {
        _region = region_data
    }

    const region_list = get(_region, 'region', null)
    const region_options = !isEmpty(region_list) ? region_list.map((data) => {
        return { value: data.name, label: data.name }
    }) : []


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
            title: 'Incentive Type',
            width: '8%',
            render: (text, record) => <Truncate data={get(record, 'incentive_config.type', null)} length={16} />
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: '6%'
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
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
            width: '6%',
            render: (text, record) => get(record, 'trip.branch.region.name', null),
            filterDropdown: (
                <Checkbox.Group
                    options={region_options}
                    defaultValue={filter.region}
                    onChange={onRegionFilter}
                    className='filter-drop-down'
                />
            )
        },
        {
            title: 'Reason',
            dataIndex: 'comment',
            key: 'comment',
            width: '11%',
            render: (text, record) => <Truncate data={text} length={17} />
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
            width: '12%',
            render: (text, record) => {
                return (
                    <LinkComp
                        type='partners'
                        data={get(record, 'trip.partner.name', null) + '-' + get(record, 'trip.partner.cardcode', null)}
                        id={get(record, 'trip.partner.cardcode', null)}
                        length={20}
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
            title: 'Action',
            width: '8%',
            render: (text, record) => (
                <Space>
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
                dataSource={incentive_list}
                rowKey={(record) => record.id}
                size='small'
                scroll={{ x: 1256 }}
                pagination={false}
                className='withAction'
                loading={loading}
            />
            {object.approveVisible && (
                <IncentiveApprove
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

export default Incentive
