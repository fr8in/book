import { useState } from 'react'
import { Table, Button, Space, Pagination, Checkbox, Tooltip } from 'antd'
import Link from 'next/link'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import TruckReject from '../../components/trucks/truckReject'
import TruckActivation from '../trucks/truckActivation'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useQuery } from '@apollo/client'
import u from '../../lib/util'

const TRUCKS_QUERY = gql`
query trucks(
  $offset: Int!
  $limit: Int!
  $truck_statusName: [String!]){
    truck(
      offset: $offset
      limit: $limit
       where: {truck_status: {name: {_in:$truck_statusName}}}) {
      id
      truck_no
      truck_comments(limit:1,order_by:{created_at:desc}){
        id
        topic
        description
        created_at
        created_by_id
      }
      truck_status {
        id
        name
      }
      partner {
        id
        cardcode
        name
      }
    }
    truck_aggregate(  where: {truck_status: {name: {_in: ["Verification","Rejected"],}}}){
      aggregate{
        count
     }
    }
    truck_status(where:{name: {_in: ["Verification","Rejected"]}}, order_by: {id: asc}) {
      id
      name
    }
  }
  
`

const TruckVerification = (props) => {
  const initial = {
    offset: 0,
    limit: u.limit,
    truckActivationVisible: false,
    truckActivationData: [],
    truckRejectVisible: false,
    truckRejectData: [],
    truck_statusName: ['Verification']
  }

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const truckQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    truck_statusName: filter.truck_statusName
  }

  const { loading, error, data } = useQuery(TRUCKS_QUERY, {
    variables: truckQueryVars,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('TrucksVerification error', error)

  var truck = []
  var truck_aggregate = 0
  var truck_status = []
  var truck_info = {}
  if (!loading) {
    truck = data && data.truck
    truck_aggregate = data && data.truck_aggregate
    truck_status = data && data.truck_status
    truck_info = truck[0] ? truck[0] : { name: 'ID does not exist' }
  }

  const truck_status_name = truck_info && truck_info.truck_status && truck_info.truck_status.name

  const record_count =
    truck_aggregate &&
    truck_aggregate.aggregate &&
    truck_aggregate.aggregate.count

  console.log('record_count', record_count)

  const trucksStatus = truck_status.map((data) => {
    return { value: data.name, label: data.name }
  })

  console.log('truckStatus', trucksStatus)

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }

  const onFilter = (value) => {
    setFilter({ ...filter, truck_statusName: value, offset: 0 })
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const handleStatus = (checked) => {
    onFilter(checked)
    setCurrentPage(1)
  }

  const columnsCurrent = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      render: (text, record) => {
        return (
          <Link href='trucks/[id]' as={`trucks/${record.truck_no}`}>
            <a>{record.truck_no}</a>
          </Link>
        )
      },
      width: '10%'
    },
    {
      title: 'Partner Code',
      dataIndex: 'code',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${record.partner && record.partner.cardcode}`}>
            <a>{record.partner && record.partner.cardcode}</a>
          </Link>
        )
      },
      width: '10%'
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      width: '18%',
      render: (text, record) => {
        return record.partner && record.partner.name
      }
    },
    {
      title: 'Truck Status',
      dataIndex: 'status',
      width: '17%',
      filterDropdown: (
        <Checkbox.Group
          options={trucksStatus}
          defaultValue={filter.truck_statusName}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        return record.truck_status && record.truck_status.name
      }
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, record) => {
        return (
          <Space>
            <Button
              type='primary'
              size='small'
              shape='circle'
              className='btn-success'
              icon={<CheckOutlined />}
              onClick={() => handleShow('truckActivationVisible', null, 'truckActivationData', record.id)}
            />
            <Button
              type='primary'
              size='small'
              shape='circle'
              danger
              icon={<CloseOutlined />}
              onClick={() => handleShow('truckRejectVisible', 'Reject Truck', 'truckRejectData', record.id)}
            />
          </Space>
        )
      }
    },
    truck_status_name === 'Rejected'
      ? {
        title: 'Reject Reason',
        dataIndex: 'reason',
        width: '35%',
        render: (text, record) => {
          const comment = record.truck_comments && record.truck_comments.length > 0 &&
        record.truck_comments[0].description ? record.truck_comments[0].description : '-'
          return comment && comment.length > 12 ? (
            <Tooltip title={comment}>
              <span> {comment.slice(0, 12) + '...'}</span>
            </Tooltip>
          ) : (
            comment
          )
        }
      } : {}
  ]
  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={truck}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1150 }}
        pagination={false}
        className='withAction'
      />
      {!loading && record_count
        ? (
          <Pagination
            size='small'
            current={currentPage}
            pageSize={filter.limit}
            showSizeChanger={false}
            total={record_count}
            onChange={pageChange}
            className='text-right p10'
          />) : null}
      {object.truckActivationVisible && (
        <TruckActivation
          visible={object.truckActivationVisible}
          onHide={handleHide}
          truck_id={object.truckActivationData}
        />
      )}
      {object.truckRejectVisible && (
        <TruckReject
          visible={object.truckRejectVisible}
          onHide={handleHide}
          truck_id={object.truckRejectData}
        />
      )}
    </>
  )
}

export default TruckVerification
