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
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <Link href='/customers/[id]' as={`/customers/${record.cardcode} `}>
            {text && text.length > 12
              ? <Tooltip title={text}><a>{text.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{text}</a>}
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Customer Name'
            id='name'
            name='name'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      width: '9%'
    },
    {
      title: 'Partner',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <Link href='/partners/partner/[id]' as={`/partners/partner/${record.partnerId} `}>
            {text && text.length > 12
              ? <Tooltip title={text}><a>{text.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{text}</a>}
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner Name'
            id='name'
            name='name'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      width: '9%'
    },
    {
      title: 'Truck',
      dataIndex: 'truck_no',
      key: 'truck_no',
      render: (text, record) => {
        return (
          <Link href='/trucks/truck/[id]' as={`/trucks/truck/${record.truckId} `}>
            <a>{text}</a>
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
      dataIndex: 'name',
      key: 'name',
      width: '8%',
      render: (text, record) => {
        return text > 12 ? (
          <Tooltip title={text}>
            <span>{text.slice(0, 9) + '...'}</span>
          </Tooltip>
        ) : text
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
      dataIndex: 'name',
      key: 'name',
      width: '8%',
      render: (text, record) => {
        return text > 12 ? (
          <Tooltip title={text}>
            <span>{text.slice(0, 9) + '...'}</span>
          </Tooltip>
        ) : text
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
      dataIndex: 'status',
      key: 'status',
      width: '7%',
      filters: statusList
    },
    {
      title: 'SO Price',
      dataIndex: 'partner_price',
      key: 'partner_price',
      width: '6%'
    },
    {
      title: 'PO Price',
      dataIndex: 'customer_price',
      key: 'customer_price',
      width: '6%'
    },
    {
      title: 'Trip KM',
      dataIndex: 'km',
      key: 'km',
      width: '6%'
    }
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
