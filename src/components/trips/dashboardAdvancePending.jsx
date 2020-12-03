import { Table, Input, Tooltip, Button } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import { SearchOutlined, CommentOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'
import Phone from '../common/phone'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TripFeedBack from './tripFeedBack'
import { useState } from 'react'

const DASHBOARD_ADVANCE_PENDING_QUERY = gql`
subscription customerAdvancePending(
    $regions: [Int!], 
    $branches: [Int!], 
    $cities: [Int!], 
    $truck_type: [Int!], 
    $managers: [Int!]
    $date: timestamp,
    $customer_name:String
    ) {
    trip(where: {
      source_out: {_gt: $date},
      trip_status: {name: {_nin: ["Cancelled"]}},
      trip_accounting: {receipt: {_is_null: true}},
      customer:{name:{_ilike:$customer_name}},
      branch:{region_id:{_in:$regions}},
      branch_id:{_in:$branches},
      source_connected_city_id:{_in:$cities},
      truck_type_id:{_in:$truck_type},
      branch_employee_id:{_in: $managers}
    }) {
      id
      advance_tat
      source_out
      created_at
      trip_status {
        name
      }
      partner {
        id
        name
        cardcode
        partner_users(where: {is_admin: {_eq: true}}) {
            mobile
          }
      }
      source {
        name
      }
      destination {
        name
      }
      customer {
        id
        name
        cardcode
      }
      last_comment{
        description
        id
      }
      trip_receivables_aggregate{
        aggregate{
          sum{
            amount
          }
        }
      }
      truck {
        truck_no
        truck_type {
          code
        }
      }
    }
  }  
`
const AdvancePending = (props) => {
    const { filters } = props

    const date = new Date(new Date().getFullYear(), 0, 1);
    const startDate = moment(date).format('YYYY-MM-DD')
    const initial = {
        commentData: [],
        commentVisible: false,
    }
    const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
    const initialFilter = {
        customer_name: null
    }
    const [customerName, setCustomerName] = useState(initialFilter)

    const { loading, error, data } = useSubscription(
        DASHBOARD_ADVANCE_PENDING_QUERY,
        {
            variables: {
                date: startDate,
                customer_name: customerName.customer_name ? `%${customerName.customer_name}%` : null,
                regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
                branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
                cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
                truck_type: (filters.types && filters.types.length > 0) ? filters.types : null,
                managers: (filters.managers && filters.managers.length > 0) ? filters.managers : null
            }
        }
    )
    console.log('Advance pending error', error)

    let _data = []
    if (!loading) {
        _data = data
    }
    const trips = get(_data, 'trip', null)

    const onCustomerNameSearch = (e) => {
        setCustomerName({...customerName, customer_name:e.target.value } )
    }

    const advancePending = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => (a.id > b.id ? 1 : -1),
            width: '5%',
            render: (text, record) => (
                <LinkComp
                    type='trips'
                    data={text}
                    id={record.id}
                />
            )
        },
        {
            title: 'O.Date',
            dataIndex: 'created_at',
            width: '7%',
            render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '-',
            sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
        },
        {
            title: 'Truck No',
            width: '12%',
            render: (text, record) => {
                const truck_no = get(record, 'truck.truck_no', null)
                const truck_type = get(record, 'truck.truck_type.code', null)
                return (
                    <LinkComp
                        type='trucks'
                        data={`${truck_no} - ${truck_type}`}
                        id={truck_no}
                    />
                )
            },
        },
        {
            title: 'Partner',
            width: '10%',
            sorter: (a, b) => (a.partner.name > b.partner.name ? 1 : -1),
            render: (text, record) => {
                const partner = get(record, 'partner.name', null)
                const cardcode = get(record, 'partner.cardcode', null)
                return (
                    <LinkComp
                        type='partners'
                        data={partner}
                        id={cardcode}
                        length={10}
                    />
                )
            }
        },
        {
            title: 'Customer',
            width: '10%',
            render: (text, record) => {
                const customer = get(record, 'customer.name', null)
                const cardcode = get(record, 'customer.cardcode', null)
                return (
                    <LinkComp
                        type='customers'
                        data={customer}
                        id={cardcode}
                        length={10}
                    />
                )
            },
            filterDropdown: (
                <Input
                    placeholder='Search'
                    value={customerName.customer_name}
                    onChange={onCustomerNameSearch}
                />
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            )
        },
        {
            title: 'Source',
            width: '9%',
            render: (text, record) => get(record, 'source.name', '-'),
            sorter: (a, b) => (a.source.name > b.source.name ? 1 : -1),
        },
        {
            title: 'Destination',
            width: '9%',
            render: (text, record) => get(record, 'destination.name', '-'),
            sorter: (a, b) => (a.destination.name > b.destination.name ? 1 : -1),
        },
        {
            title: 'Status',
            width: '8%',
            render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={15} />
        },
        {
            title: 'Receivable',
            width: '6%',
            sorter: (a, b) => (a.trip_receivables_aggregate.aggregate.sum.amount - b.trip_receivables_aggregate.aggregate.sum.amount),
            render: (record) => get(record, 'trip_receivables_aggregate.aggregate.sum.amount', 0)
        },
        {
            title: 'TAT',
            key: 'advance_tat',
            dataIndex: 'advance_tat',
            sorter: (a, b) => (a.advance_tat - b.advance_tat),
            defaultSortOrder: 'descend',
            width: '5%'
        },
        {
            title: 'Comment',
            key: 'advance_tat',
            dataIndex: 'advance_tat',
            render: (text, record) => <Truncate data={get(record, 'last_comment.description', '-')} length={15} />,
            width: '12%'
        },
        {
            title: 'Action',
            render: (text, record) => {
                return (
                    <span>
                        <Tooltip title={get(record, 'partner.partner_users[0].mobile', null)}>
                            <Phone number={get(record, 'partner.partner_users[0].mobile', null)} icon />
                        </Tooltip>
                        <Tooltip title='Comment'>
                            <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)} />
                        </Tooltip>
                    </span>
                )
            },
        },

    ]
    return (
        <>
            <Table
                columns={advancePending}
                dataSource={trips}
                rowKey={(record) => record.id}
                size='small'
                scroll={{ x: 1256 }}
                pagination={false}
                loading={loading}
            />
            {object.commentVisible &&
                <TripFeedBack
                    visible={object.commentVisible}
                    tripid={object.commentData}
                    onHide={handleHide}
                />}
        </>
    )
}
export default AdvancePending