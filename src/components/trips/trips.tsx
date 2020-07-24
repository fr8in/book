//import tripsData from '../../../mock/trip/tripsData'
import { Table, Tooltip, Input } from 'antd'
import Link from 'next/link'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'

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
  const { trips } = props
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
        return (
          <Link href='/customers/[id]' as={`/customers/${record.customer.cardcode} `}>
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
          <Link href='/trucks/truck/[id]' as={`/trucks/truck/${record.truck_no} `}>
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
        return  text > 12 ? (
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
    props.trips ?{
      title: 'SO Price',
      dataIndex: 'partner_price',
      key: 'partner_price',
      width: '9%'
    } : {},
    props.trips ?{
      title: 'PO Price',
      dataIndex: 'customer_price',
      key: 'customer_price',
      width: '9%'
    }: {},
    props.trips ?{
      title: 'Trip KM',
      dataIndex: 'km',
      key: 'km',
      width: '11%'
    }:{},
    props.delivered ?{
      title: 'O.Type',
      dataIndex: 'order_type',
      key: 'order_type',
      width: '6%'
    } : {},
    props.delivered ?{
      title: 'Aging',
      dataIndex: 'aging',
      key: 'aging',
      width: '6%'
    } : {},
    props.delivered ?{
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: '6%'
    } : {}
  ]
  return (
    <Table
      columns={columns}
      dataSource={trips}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
    />
  )
}

export default Trips
