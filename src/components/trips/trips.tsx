// import tripsData from '../../../mock/trip/tripsData'
import { Table, Tooltip, Input, Button } from 'antd'
import Link from 'next/link'
import { SearchOutlined, CommentOutlined } from '@ant-design/icons'
import moment from 'moment'
import TripFeedBack from '../trips/tripFeedBack'
// import loadData from '../../../mock/trucks/loadData'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'

const statusList = [
  { value: 1, text: 'Delivered' },
  { value: 11, text: 'Approval Pending' },
  { value: 12, text: 'POD Verified' },
  { value: 13, text: 'Invoiced' },
  { value: 20, text: 'Paid' },
  { value: 21, text: 'Received' },
  { value: 22, text: 'Closed' }
]

const Trips = (props) => {
  const initial = {
    commentData: [],
    commentVisible: false
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const { trips, loading } = props
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>)
      },

      filterDropdown: (
        <div>
          <Input
            placeholder='Search TripId'
            id='id'
            name='id'
            type='number'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: <Tooltip title='Order date'><span>O.Date</span></Tooltip>,
      dataIndex: 'order_date',
      key: 'order_date',
      render: (text, record) => {
        return text ? (
          moment(text).format('DD-MMM')
        ) : ''
      },
      sorter: (a, b) => (a.order_date > b.order_date ? 1 : -1),
      width: '6%'
    },
    {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = record.customer && record.customer.cardcode
        return (
          <Link href='/customers/[id]' as={`/customers/${cardcode} `}>
            {record.customer.name && record.customer.name.length > 12
              ? <Tooltip title={record.customer.name}><a>{record.customer.name.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{record.customer.name}</a>}
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Customer Name'
            id='customer.name'
            name='customer.name'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      width: '12%'
    },
    {
      title: 'Partner',
      render: (text, record) => {
        return (
          <Link href='/partners/partner/[id]' as={`/partners/partner/${record.partner.cardcode} `}>
            {record.partner.name && record.partner.name.length > 12
              ? <Tooltip title={record.partner.name}><a>{record.partner.name.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{record.partner.name}</a>}
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner Name'
            id='partner.name'
            name='partner.name'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      width: '13%'
    },
    {
      title: 'Truck',
      render: (text, record) => {
        return (
          <Link href='/trucks/[id]' as={`/trucks/${record.truck.truck_no} `}>
            <a>{record.truck.truck_no}</a>
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Truck'
            id='truck_no'
            name='truck_no'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      width: '13%'
    },
    {
      title: 'Source',
      width: '8%',
      render: (text, record) => {
        return text > 12 ? (
          <Tooltip title={record.source.name}>
            <span>{record.source.name.slice(0, 9) + '...'}</span>
          </Tooltip>
        ) : record.source.name
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Source City'
            id='name'
            name='name'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },

    {
      title: 'Destination',
      width: '8%',
      render: (text, record) => {
        return text > 12 ? (
          <Tooltip title={record.destination.name}>
            <span>{record.destination.name.slice(0, 9) + '...'}</span>
          </Tooltip>
        ) : record.destination.name
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Destination City'
            id='name'
            name='name'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Status',
      render: (record) => {
        return (record.trip_status.value)
      },
      width: '12%',
      filters: statusList
    },
    props.tripsTable ? {
      title: 'SO Price',
      render: (record) => {
        console.log()
        return (record.trip_prices && record.trip_prices.length > 0 && record.trip_prices[0].customer_price)
      },
      width: '9%'
    } : {},
    props.tripsTable ? {
      title: 'PO Price',
      render: (record) => {
        return (record.trip_prices && record.trip_prices.length > 0 && record.trip_prices[0].partner_price)
      },
      width: '9%'
    } : {},
    props.tripsTable ? {
      title: 'Trip KM',
      dataIndex: 'km',
      key: 'km',
      width: '11%'
    } : {},
    props.delivered ? {
      title: 'Aging',
      dataIndex: 'tat',
      key: 'tat',
      width: '10%'
    } : {},
    props.delivered ? {
      title: 'Comment',
      width: '11%',
      render: (text, record) => {
        const comment = record.trip_comments && record.trip_comments.length > 0 &&
          record.trip_comments[0].description ? record.trip_comments[0].description : '-'
        return comment && comment.length > 12 ? (
          <Tooltip title={comment}>
            <span> {comment.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          comment
        )
      }
    } : {},
    props.delivered ? {
      render: (text, record) => {
        return (
          <span>
            <Tooltip title='Comment'>
              <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)} />
            </Tooltip>
          </span>)
      },
      width: '2%'
    } : {}
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={trips}
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
