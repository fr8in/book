import { Table, Input, Tooltip, Button, Popconfirm } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { SearchOutlined,CommentOutlined,CheckOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'
import Phone from '../common/phone'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TripFeedBack from './tripFeedBack'
import { useState } from 'react'

const DASHBOARD_ADVANCE_PENDING_QUERY = gql`
query customerAdvancePending($date: timestamp,$partner_name:String,$customer_name:String,$truck_no:String,$source_name:String,$destination_name:String) {
    trip(where: {
      source_out: {_gt: $date},
      trip_status: {name: {_nin: ["Cancelled"]}},
      trip_accounting: {receipt: {_is_null: true}}
      partner:{name:{_ilike:$partner_name}}
      customer:{name:{_ilike:$customer_name}}
      truck:{truck_no:{_ilike:$truck_no}}
      source:{name:{_ilike:$source_name}}
      destination:{name:{_ilike:$destination_name}}
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
const AdvancePending = () => {
   
    const date = new Date(new Date().getFullYear(), 0, 1);
    const startDate= moment(date).format('YYYY-MM-DD')
   const initial ={
    commentData: [],
    commentVisible: false,
   }
   const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
    const initialFilter = {
        partner_name: null,
        customer_name: null,
        truck_no: null,
        source_name: null,
        destination_name: null
    }
     const [filter, setFilter] = useState(initialFilter)

    const { loading, error, data } = useQuery(
        DASHBOARD_ADVANCE_PENDING_QUERY,
        {
            variables: {
               date: startDate, 
               partner_name: filter.partner_name ? `%${filter.partner_name}%` : null,
               customer_name:filter.customer_name ? `%${filter.customer_name}%` : null,
               truck_no: filter.truck_no ? `%${filter.truck_no}%` : null,
               source_name: filter.source_name ? `%${filter.source_name}%` : null,
               destination_name: filter.destination_name ? `%${filter.destination_name}%` : null
            }
        }
    )
    console.log('Advance pending error', error)
    console.log('Advance pending data', data)
    let _data = []
    if (!loading) {
        _data = data
    }
    const trips = get(_data, 'trip', null)
    console.log('trips', trips)

    const onTruckNoSearch = (e) => {
        setFilter({ ...filter, truck_no: e.target.value })
    }
    const onPartnerNameSearch = (e) => {
        setFilter({ ...filter, partner_name: e.target.value })
    }
    const onCustomerNameSearch = (e) => {
        setFilter({ ...filter, customer_name: e.target.value })
    }
    const onSourceNameSearch = (e) => {
        setFilter({ ...filter, source_name: e.target.value })
    }
    const onDestinationNameSearch = (e) => {
        setFilter({ ...filter, destination_name: e.target.value })
    }

    const receivable =get(trips, 'trip_receivables_aggregate.aggregate.sum.amount', 0)

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
            render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '-'
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
            filterDropdown: (
                <Input
                    placeholder='Search'
                    value={filter.truck_no}
                    onChange={onTruckNoSearch}
                />
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            )
        },
        {
            title: 'Partner',
            width: '10%',
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
            },
            filterDropdown: (
                <Input
                    placeholder='Search'
                    value={filter.partner_name}
                    onChange={onPartnerNameSearch}
                />
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            )
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
                    value={filter.customer_name}
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
            filterDropdown: (
                <Input
                    placeholder='Search'
                    value={filter.source_name}
                    onChange={onSourceNameSearch}
                />
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            )
        },
        {
            title: 'Destination',
            width: '9%',
            render: (text, record) => get(record, 'destination.name', '-'),
            filterDropdown: (
                <Input
                    placeholder='Search'
                    value={filter.destination_name}
                    onChange={onDestinationNameSearch}
                />
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            )
        },
        {
            title: 'Status',
            width: '8%',
            render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={15} />
        },
        {
            title: 'Receivable',
            width: '6%',
            sorter: (a, b) => (a.trip_receivables_aggregate.aggregate.sum.amount-b.trip_receivables_aggregate.aggregate.sum.amount),
            render: (record) => get(record, 'trip_receivables_aggregate.aggregate.sum.amount', 0)
        },
        {
            title: 'TAT',
            key: 'advance_tat',
            dataIndex: 'advance_tat',
            sorter: (a, b) => (a.advance_tat - b.advance_tat),
          //  defaultSortOrder: 'descend',
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
                    <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)}/>
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