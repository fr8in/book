import { Table, Tooltip, Button } from 'antd'
import { PhoneOutlined, CommentOutlined, WhatsAppOutlined } from '@ant-design/icons'
import moment from 'moment'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TripFeedBack from '../trips/tripFeedBack'
import Truncate from '../common/truncate'
import get from 'lodash/get'
import LinkComp from '../common/link'

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
      title: 'ID',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <LinkComp
            type='trips'
            data={text}
            id={record.id}
          />)
      },
      sorter: (a, b) => a.id - b.id,
      width: '7%'
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
            length={12}
          />)
      },
      sorter: (a, b) => (a.customer.name > b.customer.name ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Partner',
      render: (text, record) => {
        const cardcode = get(record, 'partner.cardcode', null)
        const name = get(record, 'partner.name', null)
        return (
          <LinkComp
            type='partners'
            data={name}
            id={cardcode}
            length={12}
          />)
      },
      sorter: (a, b) => (a.partner.name > b.partner.name ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Driver No',
      render: (text, record) => {
        const mobile = get(record, 'truck.driver.mobile', null)
        return (
          mobile ? <span onClick={() => callNow(mobile)} className='link'>{mobile}</span> : null
        )
      },
      width: props.intransit ? '8%' : '9%'
    },
    {
      title: 'Truck',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type_name = get(record, 'truck.truck_type.name', null)
        const truck_type = truck_type_name ? truck_type_name.slice(0, 9) : null
        return (
          <LinkComp
            type='trucks'
            data={truck_no + ' - ' + truck_type}
            id={truck_no}
          />)
      },
      width: '16%'
    },
    {
      title: 'Source',
      render: (text, record) => {
        const source = get(record, 'source.name', null)
        return <Truncate data={source} length={10} />
      },
      sorter: (a, b) => (a.source.name > b.source.name ? 1 : -1),
      width: '8%'
    },
    {
      title: 'Destination',
      render: (text, record) => {
        const destination = get(record, 'destination.name', null)
        return <Truncate data={destination} length={10} />
      },
      sorter: (a, b) => (a.destination.name > b.destination.name ? 1 : -1),
      width: '8%'
    },
    {
      title: 'TAT',
      render: (text, record) => {
        const status = get(record, 'trip_status.name', null)
        return (
          (status === 'Assigned' || status === 'Confirmed') ? record.confirmed_tat
            : status === 'Reported at source' ? record.loading_tat
              : status === 'Intransit' ? record.intransit_tat
                : status === 'Reported at destination' ? record.unloading_tat : null
        )
      },
      sorter: (a, b) => {
        const status = get(a, 'trip_status.name', null)
        return (
          (status === 'Assigned' || status === 'Confirmed') ? a.confirmed_tat > b.confirmed_tat ? 1 : -1
            : status === 'Reported at source' ? a.loading_tat > b.loading_tat ? 1 : -1
              : status === 'Intransit' ? a.intransit_tat > b.intransit_tat ? 1 : -1
                : status === 'Reported at destination' ? a.unloading_tat > b.unloading_tat ? 1 : -1 : null
        )
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
        const comment = get(record, 'last_comment.description', null)
        return <Truncate data={comment} length={26} />
      },
      width: props.intransit ? '9%' : '17%'
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
      width: props.intransit ? '9%' : '11%'
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
