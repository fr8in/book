import { Table, Tooltip, Button, Popconfirm, message, Badge, Checkbox,Avatar } from 'antd'
import { CommentOutlined, CheckOutlined,PlusOutlined ,ArrowDownOutlined,ArrowUpOutlined,MinusOutlined} from '@ant-design/icons'
import moment from 'moment'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TripFeedBack from './tripFeedBack'
import Truncate from '../common/truncate'
import get from 'lodash/get'
import LinkComp from '../common/link'
import Phone from '../common/phone'
import { gql, useMutation } from '@apollo/client'
import u from '../../lib/util'
import { useContext, useState } from 'react'
import userContext from '../../lib/userContaxt'
import PartnerLink from '../common/PartnerLink'
import EditDriver from './editDriver'
import TruckLink from '../common/truckLink'

const ASSIGN_TO_CONFIRM_STATUS_MUTATION = gql`
mutation update_trip_status($id: Int , $trip_status_id : Int) {
  update_trip(_set: {trip_status_id: $trip_status_id}, where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}
`

const Trips = (props) => {
  const { trips, loading, partnerRegionFilter, setPartnerRegionFilter } = props
  const initial = {
    commentData: [],
    commentVisible: false
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const { role } = u
  const context = useContext(userContext)
  const ad_am = [role.admin, role.accounts_manager, role.accounts]
  const confirm_access = u.is_roles(ad_am, context)
  const regions = u.regions
  const regionsList = regions.map((data) => {
    return { value: data.text, label: data.text }
  })

  const onRegionFilter = (checked) => {
    setPartnerRegionFilter(checked)
  }

  const [assign_to_confirm] = useMutation(
    ASSIGN_TO_CONFIRM_STATUS_MUTATION, {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })
  const onSubmit = (id) => {
    assign_to_confirm({
      variables: {
        trip_status_id: 3,
        id: id
      }
    })
  }

  const tat = {
    Assigned: (record) => parseInt(record.confirmed_tat, 10),
    Confirmed: (record) => parseInt(record.confirmed_tat, 10),
    'Reported at source': (record) => parseInt(record.loading_tat, 10),
    Intransit: (record) => parseInt(record.intransit_tat, 10),
    'Intransit halting': (record) => parseInt(record.intransit_tat, 10),
    'Reported at destination': (record) => parseInt(record.unloading_tat, 10)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          props.intransit
            ? (
              <span className='pl10'>
                {record.loaded === 'Yes' ? '' : <Badge className='pl5' dot style={{ backgroundColor: '#dc3545' }} />}
                <LinkComp
                  type='trips'
                  data={text}
                  id={record.id}
                />
              </span>)
            : <LinkComp type='trips' data={text} id={record.id} />
        )
      },
      sorter: (a, b) => a.id - b.id,
      width: '6%'
    },
    {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = get(record, 'customer.cardcode', null)
        const name = get(record, 'customer.name', null)
        return (
          <LinkComp
            type='customers'
            data={name}
            id={cardcode}
            length={9}
          />
        )
      },
      sorter: (a, b) => (a.customer.name > b.customer.name ? 1 : -1),
      width: '8%'
    },
    {
      title: 'Partner',
      render: (text, record) => {
        const id = get(record, 'partner.id', null)
        const cardcode = get(record, 'partner.cardcode', null)
        const name = get(record, 'partner.name', null)
        const active_category_id =  get(record, 'partner.active_category_id', null)
        const count = (active_category_id === 2) ?<Avatar  style={{ backgroundColor: '#3b7ddd',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<PlusOutlined />} /> : (active_category_id === 3) ?<Avatar  style={{ backgroundColor: '#28a745',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<ArrowUpOutlined/>}/> : (active_category_id === 4) ? <Avatar  style={{ backgroundColor: '#fd7e14',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<ArrowDownOutlined/>}/>  : (active_category_id === 5) ? <Avatar  style={{ fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} /> : (active_category_id === 6) ? <Avatar icon={<MinusOutlined />} style={{ fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px',backgroundColor:'#dc3545'}} /> : null
        return (
          <>
          <Badge  count={count} />
          <PartnerLink
            id={id}
            type='partners'
            data={name}
            cardcode={cardcode}
            length={9}
          />
          </>
        )
      },
      filterDropdown: (
        props.partner_region_filter
          ? <Checkbox.Group options={regionsList} defaultValue={partnerRegionFilter} onChange={onRegionFilter} className='filter-drop-down' />
          : null
      ),
      sorter: (a, b) => (a.partner.name > b.partner.name ? 1 : -1),
      width: '8%'
    },
    {
      title: 'Driver No',
      render: (text, record) => {
        const mobile = get(record, 'driver.mobile', null)
        return (
          <EditDriver trip_info={record} mobile={mobile} />
        )
      },
      width: '13%'
    },
    {
      title: 'Partner No',
      render: (text, record) => {
        const mobile = get(record, 'partner.partner_users[0].mobile', null)
        return (
          mobile ? <Phone number={mobile} /> : null
        )
      },
      width: '8%'
    },
    {
      title: 'Truck',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type_code = get(record, 'truck.truck_type.code', null)
        const truck_type = truck_type_code ? truck_type_code.slice(0, 9) : null
       const avg_km =  get(record, 'partner.avg_km', null)
       const avg_km_speed_category_id =  get(record, 'partner.avg_km_speed_category_id', null)
       const count = (avg_km_speed_category_id === 2) ? 'N' : (avg_km_speed_category_id === 3) ? 'F' : (avg_km_speed_category_id === 4) ? 'S' : (avg_km_speed_category_id === 5) ? 'E' : null
        return (
          <TruckLink
            type='trucks'
            data={truck_no + ' - ' + truck_type}
            id={truck_no}
           avg_km={avg_km}
           count={count}
           avg_km_speed_category_id={avg_km_speed_category_id}
           length={14}
          />
        )
      },
      width: '14%'
    },
    {
      title: 'Source',
      render: (text, record) => {
        const source = get(record, 'source.name', null)
        return <Truncate data={source} length={7} />
      },
      sorter: (a, b) => (a.source.name > b.source.name ? 1 : -1),
      width: '7%'
    },
    {
      title: 'Destination',
      render: (text, record) => {
        const destination = get(record, 'destination.name', null)
        return <Truncate data={destination} length={7} />
      },
      sorter: (a, b) => (a.destination.name > b.destination.name ? 1 : -1),
      width: '7%'
    },
    !props.intransit
      ? {
          title: 'TAT',
          render: (text, record) => {
            const status = get(record, 'trip_status.name', null)
            return tat[status](record)
          },
          sorter: (a, b) => {
            const status = get(a, 'trip_status.name', null)
            return tat[status](a) > tat[status](b) ? 1 : -1
          },
          defaultSortOrder: 'descend',
          width: '4%'
        }
      : {},
    props.intransit
      ? {
          title: 'TAT',
          dataIndex: 'delay',
          width: '4%',
          sorter: (a, b) => (a.delay > b.delay ? 1 : -1),
          defaultSortOrder: 'descend'
        }
      : {},
    props.intransit
      ? {
          title: 'ETA',
          dataIndex: 'eta',
          width: '6%',
          sorter: (a, b) => (a.eta > b.eta ? 1 : -1),
          render: (text, record) => text ? moment(text).format('DD-MMM') : null
        }
      : {},
    {
      title: 'Comment',
      render: (text, record) => {
        const comment = get(record, 'last_comment.description', null)
        return (
          props.intransit
            ? <Truncate data={comment} length={9} />
            : <Truncate data={comment} length={15} />)
      },
      width: props.intransit ? '13%' : '15%'
    },
    {
      title: 'Action',
      render: (text, record) => {
        const is_execption = get(record, 'customer.is_exception', null)
        const assign_status = get(record, 'trip_status.name', null)

        return (
          <span>
            <a><Phone number={get(record, 'partner.partner_users[0].mobile', null)} icon /></a>
            <Tooltip title='Comment'>
              <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)} />
            </Tooltip>
            {
                confirm_access && assign_status === 'Assigned'
                  ? (
                    <Popconfirm
                      title='Are you sure you want to change this status to confirmed?'
                      okText='Yes'
                      cancelText='No'
                      onConfirm={() => onSubmit(record.id)}
                    >
                      <Button icon={<CheckOutlined />} type='primary' size='small' shape='circle' />
                    </Popconfirm>)
                  : null
              }
          </span>
        )
      },
      width: props.intransit ? '6%' : '10%'
    }
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={trips}
        className='withAction'
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1180 }}
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

export default Trips
