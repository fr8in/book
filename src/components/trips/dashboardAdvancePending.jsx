import { Table, Input, Tooltip, Button,Pagination,Avatar,Badge } from 'antd'
import { gql, useSubscription,useQuery } from '@apollo/client'
import { SearchOutlined, CommentOutlined,PlusOutlined ,ArrowDownOutlined,ArrowUpOutlined,MinusOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'
import TruckLink from '../common/truckLink'
import Phone from '../common/phone'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TripFeedBack from './tripFeedBack'
import u from '../../lib/util'
import { useState,useContext } from 'react'
import {filterContext} from '../../context'


const DASHBOARD_ADVANCE_PENDING_QUERY = gql`
subscription customerAdvancePending($offset: Int, $limit: Int,
    $where:trip_bool_exp ) {
     trip(where:$where,offset:$offset,limit:$limit) {
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
         active_category_id
         avg_km
         avg_km_speed_category_id
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
   }`

   const Aggregate_count = gql`
   query aggreate($where:trip_bool_exp){
    trip_aggregate(where:$where){
      aggregate{
        count
      }
    }
  }`


const AdvancePending = (props) => {
    
    const {state} = useContext(filterContext)

    const initial = {
        commentData: [],
        commentVisible: false,
    }
    const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

    const initialFilter = {
        offset: 0,
        limit: u.limit,
        customer_name: null
      }
      const [filter, setFilter] = useState(initialFilter)
      const [currentPage, setCurrentPage] = useState(1)
    

      const where= {
              trip_status: {name: {_nin: ["Waiting for truck","Assigned","Confirmed","Cancelled","Closed","Recieved"]}},
              trip_accounting: {receipt_ratio: {_lt: 0.5}},
              customer: {name: {_ilike: filter.customer_name ? `%${filter.customer_name}%` : null}},
              branch:{region_id:{_in: (state.regions && state.regions.length > 0) ? state.regions : null}},
              branch_id:{_in:(state.branches && state.branches.length > 0) ? state.branches : null},
              source_connected_city_id:{_in:(state.cities && state.cities.length > 0) ? state.cities : null},
              truck_type_id:{_in:(state.types && state.types.length > 0) ? state.types : null},
              branch_employee_id:{_in: (state.managers && state.managers.length > 0) ? state.managers : null},
              partner:{avg_km_speed_category_id : {_in:(state.speed && state.speed.length > 0) ? state.speed : null}}
           }

      const variables = {
        offset: filter.offset,
        limit: filter.limit,
        where: where
      }

    const { loading, error, data } = useSubscription(
        DASHBOARD_ADVANCE_PENDING_QUERY,
        {
            variables: variables   
        }
    )
    console.log('Advance pending error', error)

    let _data = []
    if (!loading) {
        _data = data
    }
    const trips = get(_data, 'trip', null)

    const { loading:advance_loading, error:advance_error, data:advance_data } = useQuery(
        Aggregate_count ,
        {
          variables:{ where : where}
        }
      )
    
      let _advance_data = {}
      if (!advance_loading) {
        _advance_data = advance_data 
      }
    
     const record_count= get(_advance_data,'trip_aggregate.aggregate.count',0)
    

    const onPageChange = (page, pageSize) => {
        const newOffset = page * pageSize - filter.limit
        setCurrentPage(page)
        setFilter({ ...filter, offset: newOffset })
      }
    
    const onCustomerNameSearch = (e) => {
        setFilter({...filter, customer_name:e.target.value } )
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
                const avg_km =  get(record, 'partner.avg_km', null)
                const avg_km_speed_category_id =  get(record, 'partner.avg_km_speed_category_id', null)
                const count = (avg_km_speed_category_id === 2) ? 'N' : (avg_km_speed_category_id === 3) ? 'F' : (avg_km_speed_category_id === 4) ? 'S' : (avg_km_speed_category_id === 5) ? 'E' : null         
                return (
                  <TruckLink
                  type='trucks'
                  data={`${truck_no} - ${truck_type}`}
                  id={truck_no}
                 avg_km={avg_km}
                 count={count}
                 avg_km_speed_category_id={avg_km_speed_category_id}
                 length={14}
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
                const active_category_id =  get(record, 'partner.active_category_id', null)
                const count = (active_category_id === 2) ?<Avatar  style={{ backgroundColor: '#3b7ddd',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<PlusOutlined />} /> : (active_category_id === 3) ?<Avatar  style={{ backgroundColor: '#28a745',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<ArrowUpOutlined/>}/> : (active_category_id === 4) ? <Avatar  style={{ backgroundColor: '#fd7e14',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<ArrowDownOutlined/>}/>  : (active_category_id === 5) ? <Avatar  style={{ fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} /> : (active_category_id === 6) ? <Avatar icon={<MinusOutlined />} style={{ fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px',backgroundColor:'#dc3545'}} /> : null
                return (
                  <>
                 <Badge  count={count} />
                    <LinkComp
                        type='partners'
                        data={partner}
                        id={cardcode}
                        length={10}
                    />
                    </>
                )
            }
        },
        {
            title: 'Customer',
            width: '10%',
            sorter: (a, b) => (a.customer.name > b.customer.name ? 1 : -1),
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
            render: (text, record) => <Truncate data={get(record, 'source.name', '-')} length={10} />,
            sorter: (a, b) => (a.source.name > b.source.name ? 1 : -1),
        },
        {
            title: 'Destination',
            width: '9%',
            render: (text, record) => <Truncate data={get(record, 'destination.name', '-')} length={10} />,
            sorter: (a, b) => (a.destination.name > b.destination.name ? 1 : -1),
        },
        {
            title: 'Status',
            width: '8%',
            render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={10} />
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
                {!loading && (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={onPageChange}
          className='text-right p10'
        />
      )}
        </>
    )
}
export default AdvancePending