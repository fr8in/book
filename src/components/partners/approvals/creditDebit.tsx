import { Table, Input, Pagination, Tooltip, Button, Space, Checkbox, Radio } from 'antd'
import Link from 'next/link'
import {
    SearchOutlined,
    CommentOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons'
import u from '../../../lib/util'
import Truncate from '../../common/truncate'
import get from 'lodash/get'
import moment from 'moment'
import PartnerOnBoardedBy from '../partnerOnboardedByName'
import { gql, useSubscription, useQuery } from '@apollo/client'
import { useState, useEffect, useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import userContext from '../../../lib/userContaxt'
import Comment from '../../trips/tripFeedBack'
import Approve from './accept'

const CREDIT_DEBIT_LIST = gql`
subscription trip_credit_debit($offset:Int,$limit:Int,$where:trip_credit_debit_bool_exp) {
trip_credit_debit(offset:$offset,where:$where,limit:$limit) {
      id
      trip_id
      type
      amount
      comment
      approved_by
      approved_amount
      approval_comment
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
  }
`

const CREDIT_DEBIT_TYPE_QUERY = gql`
query credit_debit_agg_type($where: trip_credit_debit_bool_exp!){
  trip_credit_debit_aggregate(where:$where){
      aggregate{
        count
      }
    }
  credit_debit_type {
    id
    active
    name
  }
}
`


const CreditDebit = () => {

    const initial = {
        offset: 0,
        trip_id: null,
        type: null,
        issue_type: null,
        created_by: null,
        partnername: null,
        status_name: 'PENDING',
        region: [],
        commentData: [],
        commentVisible: false,
        approveData: [],
        approveVisible: false,
        title: null,
        responsibity: null,
        searchText: null,
        pending: []
    }
    const [filter, setFilter] = useState(initial)
    const [currentPage, setCurrentPage] = useState(1)
    const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
    const pending_list = filter.status_name.includes("PENDING")

    const creditDebitStatus = u.creditDebitStatus
    const typeList = u.creditDebitType
    const region = u.regions

    const { role } = u
    const access = [role.admin, role.rm, role.partner_support]
    const approve_roles = [role.admin, role.rm, role.partner_manager, role.partner_support]
    const reject_roles = [role.admin, role.rm, role.partner_manager, role.partner_support]
    const context = useContext(userContext)
    const approval_access = u.is_roles(approve_roles, context)
    const rejected_access = u.is_roles(reject_roles, context)


    const where = {
        trip_id: { _eq: !isEmpty(filter.trip_id) ? filter.trip_id : null },
        type: !isEmpty(filter.type) ? { _in: filter.type } : { _in: null },
        credit_debit_type: { name: { _in: !isEmpty(filter.issue_type) ? filter.issue_type : null } },
        credit_debit_status: { name: { _in: filter.status_name ? [filter.status_name] : null } },
        created_by: { _ilike: filter.created_by ? `%${filter.created_by}%` : null },
        _and: {
            trip: {
                partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } }
            }
        }
    }

    const { loading, error, data } = useSubscription(
        CREDIT_DEBIT_LIST,
         {
            variables: {
                offset: filter.offset,
                limit: u.limit,
                where: where
            }
        }
    )

    const { data: filter_data, loading: filter_loading } = useQuery(
        CREDIT_DEBIT_TYPE_QUERY,
        {
            variables: { where: where },
            fetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: true
        }
    )

    let _data = {}
    if (!loading) {
        _data = data
    }
    const tripCreditDebit = get(_data, 'trip_credit_debit', null)

    let _filter_data = {}
    if (!filter_loading) {
        _filter_data = filter_data
    }
    const record_count = get(filter_data, 'trip_credit_debit_aggregate.aggregate.count', 0)
    const credit_debit_type = get(_filter_data, 'credit_debit_type', [])

    const issueTypeList = !isEmpty(credit_debit_type) ? credit_debit_type.map((data) => {
        return { value: data.name, label: data.name }
    }) : []
    
    const creditDebitList = typeList.map((data) => {
        return { value: data.text, label: data.text }
    })
   
    const regionsList = region.map((data) => {
        return { value: data.text, label: data.text }
    })
    
    const creditDebitStatusList = creditDebitStatus.map((data) => {
        return { value: data.text, label: data.text }
    })

    const onSearch = (e) => {
        setFilter({ ...filter, searchText: e.target.value })
        const searchText = e.target.value
        console.log('searchText', filter.searchText, searchText)
        if (searchText.length >= 3) {
            const regex = new RegExp(searchText, 'gi')
            const removeNull = filter.pending.filter(record => record.responsibility != null)
            const newData = removeNull.filter(record => record.responsibility.name.match(regex))
            const result = newData || filter.pending
            setFilter({ ...filter, pending: result })
        } else {
            setFilter({ ...filter, pending: tripCreditDebit })
        }
    }
    const onPageChange = (value) => {
        setFilter({ ...filter, offset: value })
    }
    const pageChange = (page, pageSize) => {
        const newOffset = page * pageSize - u.limit
        setCurrentPage(page)
        onPageChange(newOffset)
    }
    const onRegionFilter = (checked) => {
        setFilter({ ...filter, region: checked })
        setCurrentPage(1)
    }
    const onTripIdSearch = (e) => {
        setFilter({ ...filter, trip_id: e.target.value })
        setCurrentPage(1)
    }
    const onTypeFilter = (checked) => {
        setFilter({ ...filter, type: checked, offset: 0 })
        setCurrentPage(1)
    }
    const onPartnerSearch = (e) => {
        setFilter({ ...filter, partnername: e.target.value })
        setCurrentPage(1)
    }
    const onCreatedBySearch = (e) => {
        setFilter({ ...filter, created_by: e.target.value })
        setCurrentPage(1)
    }
    const onIssueTypeFilter = (checked) => {
        setFilter({ ...filter, issue_type: checked, offset: 0 })
        setCurrentPage(1)
    }
    const onStatusFilter = (e) => {
        setFilter({ ...filter, status_name: e.target.value, offset: 0 })
        setCurrentPage(1)
    }

    let credit_debit_list = !isEmpty(filter.pending) ? filter.pending : tripCreditDebit

    const columns = [
        {
            title: '#',
            dataIndex: 'trip_id',
            key: 'trip_id',
            width: '6%',
            render: (text, record) => {
                return (
                    <Link href='/trips/[id]' as={`/trips/${record.trip_id} `}>
                        <a>{text}</a>
                    </Link>)
            },
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
            width: '6%',
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
            render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name', null)} length={10} />,
            filterDropdown: (
                <Checkbox.Group
                    options={issueTypeList}
                    defaultValue={filter.issue_type}
                    onChange={onIssueTypeFilter}
                    className='filter-drop-down'
                />
            )
        },
        {
            title: 'Claim ₹',
            dataIndex: 'amount',
            width: '5%'
        },
        pending_list ? {} :
            {
                title: 'Approved ₹',
                dataIndex: 'approved_amount',
                key: 'approved',
                width: '10%'
            }
        ,
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
            width: '5%',
            render: (text, record) => get(record, 'trip.branch.region.name', null),
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
            title: 'Partner',
            key: 'partner',
            width: '10%',
            render: (text, record) => <Truncate data={get(record, 'trip.partner.name', null)} length={12} />,
            filterDropdown: (
                <div>
                    <Input
                        placeholder='Search'
                        id='partner_name'
                        name='partner_name'
                        value={filter.partnername}
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
            width: '10%',
            render: (text, record) => <Truncate data={text} length={12} />
        },
        {
            title: 'Req.By',
            dataIndex: 'created_by',
            key: 'created_by',
            width: pending_list ? '10%' : '7%',
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
            title: 'Status',
            dataIndex: 'comment',
            key: 'comment',
            width: '8%',
            render: (text, record) => get(record, 'credit_debit_status.name', null),
            filterDropdown: (
                <Radio.Group
                    options={creditDebitStatusList}
                    defaultValue={filter.status_name}
                    onChange={onStatusFilter}
                    className='filter-drop-down'
                />
            )
        },
        pending_list ?
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
            } : {},

        pending_list ? {} :
            {
                title: 'Closed By',
                dataIndex: 'approved_by',
                key: 'approved_by',
                width: '8%',
                render: (text, record) => <Truncate data={text} length={18} />
            },
        pending_list ? {} :
            {
                title: 'Remarks',
                dataIndex: 'approval_comment',
                key: 'approval_comment',
                width: '7%',
                render: (text, record) => <Truncate data={text} length={10} />
            },
        pending_list ?
            {
                title: 'Action',
                width: '12%',
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
                                />)
                                : null}
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
                                />)
                                : null}
                        </Tooltip>
                    </Space>
                )
          } : {}
    ]

    return (
        <>
            <Table
                columns={columns}
                dataSource={credit_debit_list}
                rowKey={(record) => record.id}
                size='small'
                scroll={{ x: 1200 }}
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
            {!loading && record_count ? (
                <Pagination
                    size='small'
                    current={currentPage}
                    pageSize={u.limit}
                    showSizeChanger={false}
                    total={record_count}
                    onChange={pageChange}
                    className='text-right p10'
                />) : null}
        </>
    )
}
export default CreditDebit