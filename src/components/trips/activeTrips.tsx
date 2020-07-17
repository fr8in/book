import tripsData from '../../../mock/trip/tripsData'
import { Table, Tooltip, Button } from 'antd'
import Link from 'next/link'
import { PhoneOutlined, CommentOutlined, WhatsAppOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'

const Trips = (props) => {
  const initial = { comment: false }
  const { visible, onShow, onHide } = useShowHide(initial)
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
      sorter: (a, b) => a.tripId - b.tripId,
      width: '8%'
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      render: (text, record) => {
        return (
          <Link href='/customers/[id]' as={`/customers/${record.customerId} `}>
            {text && text.length > 12
              ? <Tooltip title={text}><a>{text.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{text}</a>}
          </Link>)
      },
      sorter: (a, b) =>
        (a.customerName ? a.customerName.toLowerCase() : '') >
          (b.customerName ? b.customerName.toLowerCase() : '')
          ? 1
          : -1,
      width: '10%'
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      render: (text, record) => {
        return (
          <Link href='/partners/partner/[id]' as={`/partners/partner/${record.partnerId} `}>
            {text && text.length > 12
              ? <Tooltip title={text}><a>{text.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{text}</a>}
          </Link>)
      },
      sorter: (a, b) =>
        (a.partner ? a.partner.toLowerCase() : '') >
          (b.partner ? b.partner.toLowerCase() : '')
          ? 1
          : -1,
      width: '10%'
    },
    {
      title: 'Driver No',
      dataIndex: 'driverNo',
      render: (text, record) => {
        return (
          <span onClick={() => callNow(record.driverNo)} className='link'>{record.driverNo}</span>
        )
      },
      width: props.intransit ? '8%' : '9%'
    },
    {
      title: 'Truck',
      dataIndex: 'truck',
      render: (text, record) => {
        return (
          <Link href='/trucks/truck/[id]' as={`/trucks/truck/${record.truckId} `}>
            <a>{text}</a>
          </Link>)
      },
      width: props.intransit ? '12%' : '14%'
    },
    {
      title: 'Source',
      dataIndex: 'source',
      render: (text, record) => {
        return text && text > 10 ? text.slice(0, 10) + '...' : text
      },
      sorter: (a, b) =>
        (a.source ? a.source.toLowerCase() : '') >
          (b.source ? b.source.toLowerCase() : '')
          ? 1
          : -1,
      width: '8%'
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      render: (text, record) => {
        return text && text.length > 10 ? text.slice(0, 10) + '...' : text
      },
      sorter: (a, b) =>
        (a.destination ? a.destination.toLowerCase() : '') >
          (b.destination ? b.destination.toLowerCase() : '')
          ? 1
          : -1,
      width: '9%'
    },
    {
      title: 'TAT',
      dataIndex: 'deviceTat',
      sorter: (a, b) =>
        (a.deviceTat ? a.deviceTat : 0) -
          (b.deviceTat ? b.deviceTat : 0),
      render: (text, record) => {
        return text && text ? text.toFixed(2) : 0
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
      width: '5%',
      sorter: (a, b) => (a.eta > b.eta ? 1 : -1)
    } : {},
    {
      title: 'Comment',
      dataIndex: 'comment',
      render: (text, record) => {
        return (
          text ? (
            <Tooltip title={text}><span>{text.slice(0, 18) + '...'}</span></Tooltip>
          ) : null
        )
      },
      width: props.intransit ? '11%' : '17%'
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title={record.driverPhoneNo}>
            <Button type='link' icon={<PhoneOutlined />} onClick={() => callNow(record.driverPhoneNo)} />
          </Tooltip>
          <Tooltip title='Comment'>
            <Button type='link' icon={<CommentOutlined />} onClick={() => onShow('comment')} />
          </Tooltip>
          <span>
            <Tooltip title='click to copy message'>
              <Button type='link' icon={<WhatsAppOutlined />} />
            </Tooltip>
          </span>
        </span>
      ),
      width: '11%'
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={tripsData}
      className='withAction'
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
    />
  )
}

export default Trips
