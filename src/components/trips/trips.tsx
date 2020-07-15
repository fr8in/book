import tripsData from '../../../mock/trip/tripsData'
import { Table, Tooltip, Input, Checkbox } from 'antd'
import Link from 'next/link'
import { SearchOutlined, DownSquareOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import moment from 'moment'

const CheckboxGroup = Checkbox.Group
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
  const initial = { tripIdSearch: false }
  const { visible, onShow } = useShowHide(initial)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (text, record) => {
        return (
          <Link href='/trips/trip/[id]' as={`/trips/trip/${record.id} `}>
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
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilterDropdownVisibleChange: () => onShow('tripIdSearch')
    },
    {
      title: <Tooltip title='Order date'><span>O.Date</span></Tooltip>,
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (text, record) => {
        return text ? (
          moment(text).format('DD-MMM')
        ) : ''
      },
      sorter: (a, b) => (a.orderDate > b.orderDate ? 1 : -1),
      width: '6%'
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (text, record) => {
        return (
          <Link href='/customers/[id]' as={`/customers/${record.customerId} `}>
            {text && text.length > 12
              ? <Tooltip title={text}><a>{text.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{text}</a>}
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Customer Name'
            id='customer'
            name='customer'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilterDropdownVisibleChange: () => onShow('tripCustomerSearch'),
      width: '9%'
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      key: 'partner',
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
            id='partner'
            name='partner'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilterDropdownVisibleChange: () => onShow('tripPartnerSearch'),
      width: '9%'
    },
    {
      title: 'Truck',
      dataIndex: 'truck',
      key: 'truckNo',
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
            id='truck'
            name='truck'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilterDropdownVisibleChange: () => onShow('tripTruckSearch'),
      width: '13%'
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
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
            id='source'
            name='source'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilterDropdownVisibleChange: () => onShow('tripSourceSearch')
    },

    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
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
            id='destination'
            name='destination'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilterDropdownVisibleChange: () => onShow('tripDestSearch')
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
      dataIndex: 'soPrice',
      key: 'soPrice',
      width: '6%'
    },
    {
      title: 'PO Price',
      dataIndex: 'poPrice',
      key: 'poPrice',
      width: '6%'
    },
    {
      title: 'Trip KM',
      dataIndex: 'tripKm',
      key: 'tripKm',
      width: '6%'
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={tripsData}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
    />
  )
}

export default Trips
