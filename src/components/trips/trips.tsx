import { useState } from 'react'
import { Table, Tooltip, Input, Button,Pagination,Radio} from 'antd'
import Link from 'next/link'
import { SearchOutlined, CommentOutlined } from '@ant-design/icons'
import moment from 'moment'
import TripFeedBack from '../trips/tripFeedBack'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'

const Trips = (props) => {
  const initial = {
    commentData: [],
    commentVisible: false
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const { trips, loading, record_count,total_page,sorter,
     onPageChange, filter, onPartnerNameSearch,onCustomerNameSearch,trip_status_list,
     onFilter,onSourceNameSearch,onDestinationNameSearch ,onTruckNoSearch,onTripIdSearch} = props

  const [currentPage, setCurrentPage] = useState(1)

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const handlePartnerName = (e) => {
    onPartnerNameSearch(e.target.value)
  }

  const handleCustomerName = (e) => {
    onCustomerNameSearch(e.target.value)
  }
  const handleSourceName = (e) => {
    onSourceNameSearch(e.target.value)
  }
  const handleDestinationName = (e) => {
    onDestinationNameSearch(e.target.value)
  }
  const handleTruckNo = (e) => {
    onTruckNoSearch(e.target.value);
  }
  const handleStatus = (e) => {
    onFilter(e.target.value);
  };
  const handleTripId = (e) => {
    onTripIdSearch(e.target.value);
  };
 
  const trip_status = trip_status_list.map((data) => {
    return { name: data.id, label: data.name };
  });

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
            value={filter.id}
            onChange={handleTripId}
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
      // sorter: (
      //       order: 'descend',
      //       columnKey: 'order_date' )
    },
    {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = record.customer && record.customer.cardcode
        return (
          <Link href='/customers/[id]' as={`/customers/${cardcode} `}>
            {record.customer && record.customer.name && record.customer.name.length > 12
              ? <Tooltip title={record.customer && record.customer.name}><a>{record.customer.name.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{record.customer && record.customer.name}</a>}
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Customer Name'
            value={filter.customername}
            onChange={handleCustomerName}
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
          <Link href='/partners/partner/[id]' as={`/partners/partner/${record.partner && record.partner.cardcode} `}>
            {record.partner && record.partner.name && record.partner.name.length > 12
              ? <Tooltip title={record.partner && record.partner.name}><a>{record.partner && record.partner.name.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{record.partner && record.partner.name}</a>}
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner Name'
            value={filter.name}
            onChange={handlePartnerName}
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
          <Link href='/trucks/[id]' as={`/trucks/${record.truck && record.truck.truck_no} `}>
            <a>{record.truck && record.truck.truck_no}</a>
          </Link>)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Truck'
            value={filter.truck_no}
            onChange={handleTruckNo}
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
            value={filter.Sourcename}
            onChange={handleSourceName}
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
            value={filter.Destinationname}
            onChange={handleDestinationName}
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: "Status",
      render: (text, record) =>
        record.trip_status && record.trip_status.name,
      width: "14%",
      filterDropdown: (
        <Radio.Group
          options={trip_status}
          defaultValue={filter.trip_statusId[0]}
          onChange={handleStatus}
          className="filter-drop-down"
        />
      ),
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
      {!loading &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />}
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
