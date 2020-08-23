import { Table, Tooltip, Button } from 'antd'
import Link from 'next/link'
import { PhoneOutlined, CommentOutlined, WhatsAppOutlined } from '@ant-design/icons'
import moment from 'moment'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TripFeedBack from '../trips/tripFeedBack'

const Trips = (props) => {
  const { trips, loading } = props

  const initial = {
    commentData: [],
    commentVisible: false
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const callNow = record => {
    window.location.href = 'tel:' + record
  }

  const columns = [
    {
      title: 'Load Id',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>)
      },
      sorter: (a, b) => a.id - b.id,
      width: '8%'
    },
    props.customername ? {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = record.customer && record.customer.cardcode
        const name = record.customer && record.customer.name
        return (
          <Link href='/customers/[id]' as={`/customers/${cardcode} `}>
            {name && name.length > 12
              ? <Tooltip title={name}><a>{name.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{name}</a>}
          </Link>)
      },
      sorter: (a, b) => (a.customer.name > b.customer.name ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Partner',
      render: (text, record) => {
        const cardcode = record.partner && record.partner.cardcode
        const name = record.partner && record.partner.name
        return (
          <Link href='/partners/[id]' as={`/partners/${cardcode} `}>
            {name && name.length > 12
              ? <Tooltip title={name}><a>{name.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{name}</a>}
          </Link>)
      },
      sorter: (a, b) => (a.partner.name > b.partner.name ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Driver No',
      dataIndex: 'driver',
      render: (text, record) => {
        return (
          text ? <span onClick={() => callNow(text)} className='link'>{text}</span> : null
        )
      },
      width: props.intransit ? '8%' : '9%'
    },
    {
      title: 'Truck',
      render: (text, record) => {
        const truck_no = record.truck && record.truck.truck_no
        const truck_type = record.truck && record.truck.truck_type && record.truck.truck_type.name
        return (
          <Link href='/trucks/[id]' as={`/trucks/${truck_no} `}>
            <a>{truck_no + ' - ' + truck_type}</a>
          </Link>)
      },
      width: props.intransit ? '12%' : '14%'
    },
    {
      title: 'Source',
      render: (text, record) => {
        const source = record.source && record.source.name
        return source && source > 10 ? source.slice(0, 10) + '...' : source
      },
      sorter: (a, b) => (a.source.name > b.source.name ? 1 : -1),
      width: '8%'
    },
    {
      title: 'Destination',
      render: (text, record) => {
        const destination = record.destination && record.destination.name
        return destination && destination.length > 10 ? destination.slice(0, 10) + '...' : destination
      },
      sorter: (a, b) => (a.destination.name > b.destination.name ? 1 : -1),
      width: '9%'
    },
    {
      title: 'TAT',
      dataIndex: 'tat',
      sorter: (a, b) => a.tat > b.tat ? 1 : -1,
      render: (text, record) => {
        return text && text ? text : 0
      },
      width: '4%'
    },
    props.intransit ? {
      title: 'Delay',
      dataIndex: 'delay',
      width: '5%',
      sorter: (a, b) => (a.delay > b.delay ? 1 : -1)
    } : {},
    props.intransit ? {
      title: 'ETA',
      dataIndex: 'eta',
      width: '6%',
      sorter: (a, b) => (a.eta > b.eta ? 1 : -1),
      render: (text, record) => text ? moment(text).format('DD-MMM') : null
    } : {},
    {
      title: 'Comment',
      render: (text, record) => {
        const comment = record.trip_comments && record.trip_comments.length > 0 ? record.trip_comments[0].description : null
        return (
          comment ? <Tooltip title={comment}><span>{comment.slice(0, 12) + '...'}</span></Tooltip>
            : null
        )
      },
      width: props.intransit ? '10%' : '17%'
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Tooltip title={record.driverPhoneNo}>
            <Button type='link' icon={<PhoneOutlined />} onClick={() => callNow(record.driverPhoneNo)} />
          </Tooltip>
          <Tooltip title='Comment'>
            <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)} />
          </Tooltip>
          {/* <Tooltip title='click to copy message'>
            <Button type='link' icon={<WhatsAppOutlined />} />
          </Tooltip> */}
        </span>
      ),
      width: props.intransit ? '10%' : '11%'
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
        scroll={{ x: 1156 }}
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
