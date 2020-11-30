import { useState } from 'react'
import { Table, Tooltip, Input, Pagination, Checkbox, Button } from 'antd'
import LinkComp from '../common/link'
import moment from 'moment'
import { SearchOutlined, CommentOutlined } from '@ant-design/icons'
import TripFeedBack from '../trips/tripFeedBack'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import PodReceiptAndDispatch from '../trips/podReceiptAndDispatch'
import get from 'lodash/get'

const TripsTracking = (props) => {
  const initial = {
    commentData: [],
    commentVisible: false
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const {
    trips,
    loading,
    record_count,
    onPageChange,
    filter,
    onPartnerNameSearch,
    onCustomerNameSearch,
    trip_status_list,
    onFilter,
    onSourceNameSearch,
    onDestinationNameSearch,
    onTruckNoSearch,
    onTripIdSearch,
    visible_receipt,
    visible_dispatch,
    onHide,
    verified,
    setCountFilter, countFilter, invoiced_countFilter, invoiced_setCountFilter, delivered
  } = props

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedTrips, setSelectedTrips] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const trip_list = selectedRows && selectedRows.length > 0 ? selectedRows.map(row => row.id) : []
    setSelectedRowKeys(selectedRowKeys)
    setSelectedTrips(trip_list)
    delivered ? setCountFilter({ ...countFilter, pod_receipt_count: selectedRows.length })
      : invoiced_setCountFilter({ ...invoiced_countFilter, pod_dispatch_count: selectedRows.length })
  }
  const onRemoveTag = (removed) => {
    const trip_list = selectedTrips.filter(t_id => t_id !== removed)
    const selectedRows = selectedRowKeys.filter(selectedRowKeys => selectedRowKeys !== removed)
    setSelectedRowKeys(selectedRows)
    setSelectedTrips(trip_list)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const handlePartnerName = (e) => {
    onPartnerNameSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleCustomerName = (e) => {
    onCustomerNameSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleSourceName = (e) => {
    onSourceNameSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleDestinationName = (e) => {
    onDestinationNameSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleTruckNo = (e) => {
    onTruckNoSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleStatus = (checked) => {
    onFilter(checked)
    setCurrentPage(1)
  }
  const handleTripId = (e) => {
    onTripIdSearch(e.target.value)
    setCurrentPage(1)
  }

  const trip_status = trip_status_list.map((data) => {
    return { value: data.name, label: data.name }
  })

  const tat = (record) => {
    const status = get(record, 'trip_status.name', null)
    const pod_verified = get(record, 'pod_verified_at', null)
    const pod_dispatched = get(record, 'pod_dispatched_at', null)
    let tat = null
    switch (status) {
      case 'Delivered':
        tat = pod_verified ? record.pod_verified_tat : record.delivered_tat
        break
      case 'Invoiced':
        tat = pod_dispatched ? record.pod_dispatched_tat : record.invoiced_tat
        break
      case 'Paid':
        tat = record.paid_tat
        break
      case 'Recieved':
        tat = record.received_tat
        break
      case 'Closed':
        tat = record.closed_tat
        break
    }
    return parseInt(tat, 10)
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '7%',
      render: (text, record) => {
        return (
          <LinkComp type='trips' data={text} id={record.id} blank />)
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
      filterIcon: () => <SearchOutlined style={{ color: filter.id ? '#1890ff' : undefined }} />
    },
    {
      title: 'Order date',
      dataIndex: 'created_at',
      render: (text, record) => {
        return text ? (
          moment(text).format('DD-MMM-YY')
        ) : ''
      },
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '8%'
    },
    {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = record.customer && record.customer.cardcode
        return (
          <LinkComp type='customers' data={get(record, 'customer.name', null)} id={cardcode} length={12} blank />
        )
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
      filterIcon: () => <SearchOutlined style={{ color: filter.customername ? '#1890ff' : undefined }} />,
      width: '11%'
    },
    {
      title: 'Partner',
      render: (text, record) => {
        return (
          <LinkComp type='partners' data={get(record, 'partner.name', null)} id={get(record, 'partner.cardcode', null)} length={12} blank />
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner Name'
            value={filter.partnername}
            onChange={handlePartnerName}
          />
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ color: filter.partnername ? '#1890ff' : undefined }} />,
      width: '11%'
    },
    {
      title: 'Truck',
      render: (text, record) => {
        return (
          <LinkComp type='trucks' data={get(record, 'truck.truck_no', null)} id={get(record, 'truck.truck_no', null)} blank />
        )
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
      filterIcon: () => <SearchOutlined style={{ color: filter.truck_no ? '#1890ff' : undefined }} />,
      width: '10%'
    },
    {
      title: 'Source',
      width: '9%',
      render: (text, record) => {
        return text > 8 ? (
          <Tooltip title={record.source.name}>
            <span>{record.source.name.slice(0, 8) + '...'}</span>
          </Tooltip>
        ) : record.source.name
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Source City'
            value={filter.sourcename}
            onChange={handleSourceName}
          />
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ color: filter.sourcename ? '#1890ff' : undefined }} />
    },
    {
      title: 'Destination',
      width: '10%',
      render: (text, record) => {
        return text > 8 ? (
          <Tooltip title={record.destination.name}>
            <span>{record.destination.name.slice(0, 8) + '...'}</span>
          </Tooltip>
        ) : record.destination.name
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Destination City'
            value={filter.destinationname}
            onChange={handleDestinationName}
          />
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ color: filter.destinationname ? '#1890ff' : undefined }} />
    },
    {
      title: 'Status',
      render: (text, record) =>
        record.trip_status && record.trip_status.name,
      width: '10%',
      filterDropdown: (
        <Checkbox.Group
          options={trip_status}
          defaultValue={filter.trip_statusName}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'TAT',
      render: (text, record) => tat(record),
      sorter: (a, b) => {
        const status = get(a, 'trip_status.name', null)
        console.log(trip_status.name)
        return status ? (tat(a) > tat(b) ? 1 : -1) : null
      },
      width: '8%'
    },
    {
      title: 'Comment',
      width: '12%',
      render: (text, record) => {
        const comment = record.last_comment && record.last_comment.description
        return comment && comment.length > 12 ? (
          <Tooltip title={comment}>
            <span> {comment.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          comment
        )
      }
    },
    {
      render: (text, record) => {
        return (
          <span>
            <Tooltip title='Comment'>
              <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)} />
            </Tooltip>
          </span>
        )
      },
      width: '4%'
    }
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={trips}
        rowKey={record => record.id}
        rowSelection={!verified ? rowSelection : null}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
        className='withAction'
      />
      {!loading && record_count ? (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />) : null}
      {object.commentVisible &&
        <TripFeedBack
          visible={object.commentVisible}
          tripid={object.commentData}
          onHide={handleHide}
        />}
      {visible_receipt && (
        <PodReceiptAndDispatch
          visible={visible_receipt}
          onHide={onHide}
          trip_ids={selectedTrips}
          onRemoveTag={onRemoveTag}
        />
      )}
      {visible_dispatch && (
        <PodReceiptAndDispatch
          visible={visible_dispatch}
          onHide={onHide}
          trip_ids={selectedTrips}
          onRemoveTag={onRemoveTag}
          podDispatch
        />
      )}
    </>
  )
}

export default TripsTracking
