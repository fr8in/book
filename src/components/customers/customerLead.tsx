import { Table, Input, Switch, Button, Tooltip, Popconfirm, Space, Pagination, message, Modal, Checkbox } from 'antd'
import {
  SearchOutlined,
  CommentOutlined,
  CloseOutlined
} from '@ant-design/icons'
import moment from 'moment'
import { useState } from 'react'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import CustomerComment from '../customers/customerComment'
import { gql, useQuery, useMutation } from '@apollo/client'
import u from '../../lib/util'
import Truncate from '../common/truncate'
import get from 'lodash/get'

const CUSTOMERS_LEAD_QUERY = gql`
query customers_lead( $offset: Int!
  $limit: Int!
  $customer_status_name:[String!]
  $channel_name:[String!]
  $mobile: String){
  customer(  offset: $offset
    limit: $limit
    order_by: 
    {lead_priority: desc_nulls_last},
     where: { mobile: {_like:$mobile }, channel: {name: {_in:$channel_name}},status:{name:{_in:$customer_status_name}}},){
    id
    cardcode
    name
    lead_priority
    mobile
     onboarded_by{
    name
  }
  channel{
    id
    name
  }
  city{
    id
    name
  }
   status{
    id
    name
  }
  customer_comments{
    id
    topic
    description
    created_at
    created_by
  }
  }
  customer_aggregate(where: {status: {name: {_in: ["Lead","Registered","Rejected"]}}}){
    aggregate{
      count
    }
  }
  customer_status(where:{name: {_in: ["Lead","Registered","Rejected"]}}, order_by: {id: asc}){
    id 
    name
  }
  channel {
    id
    name
  }
}
`

const LEAD_REJECT_MUTATION = gql`
mutation customer_lead_reject($status_id:Int,$id:Int! ) {
  update_customer_by_pk(pk_columns: {id: $id}, _set: {status_id: $status_id}) {
    id
    name
  }
}
`

const UPDATE_LEAD_PRIORITY_STATUS_MUTATION = gql`
mutation lead_priority_status($lead_priority: Boolean, $id: Int) {
  update_partner(_set: {lead_priority: $lead_priority}, where: {id: {_eq: $id}}) {
    returning {
      id
      lead_priority
    }
  }
}
`

const CusSource = [
  { value: 1, text: 'DIRECT' },
  { value: 2, text: 'SOCIAL MEDIA' },
  { value: 3, text: 'REFERRAL' },
  { value: 4, text: 'APP' }
]
const CusState = [
  { value: 1, text: 'OPEN' },
  { value: 2, text: 'ON-BOARDED' },
  { value: 3, text: 'REJECTED' }
]

const CustomerLead = () => {
  const rowSelection = {

    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name
    })
  }
  const initial = {
    commentData: [],
    commentVisible: false,
    offset: 0,
    limit: u.limit,
    mobile: null,
    customer_status_name: ['Lead', 'Registered'],
    channel_name: ['Direct', 'Social Media', 'Referral', 'App']
  }

  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const customerQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    customer_status_name: filter.customer_status_name,
    mobile: filter.mobile ? `%${filter.mobile}%` : null,
    channel_name: filter.channel_name
  }

  const { loading, error, data } = useQuery(
    CUSTOMERS_LEAD_QUERY, {
      variables: customerQueryVars,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    })


  const [insertComment] = useMutation(
    LEAD_REJECT_MUTATION, {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })
  const onSubmit = (id) => {
    insertComment({
      variables: {
        status_id: 7,
        id: id
      }
    })
  }

  const [updateStatusId] = useMutation(
    UPDATE_LEAD_PRIORITY_STATUS_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })

  const onLeadChange = (checked, id) => {
    updateStatusId({
      variables: {
        id: id,
        lead_priority: checked
      }
    })

  }

  let _data = {}

  if (!loading) {
    _data = data
  }
  const customer = get(_data, 'customer', [])
  const customer_aggregate = get(data, 'customer_aggregate', 0)
  const customer_status = get(data, 'customer_status', null)
  const channel = get(data, 'channel', null)

  const record_count = get(customer_aggregate, 'aggregate.count', 0)

  const customers_status = customer_status.map((data) => {
    return { value: data.name, label: data.name }
  })

  const channels = channel.map((data) => {
    return { value: data.name, label: data.name }
  })

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }

  const onMobileSearch = (value) => {
    setFilter({ ...filter, mobile: value })
  }

  const onChannelFilter = (value) => {
    setFilter({ ...filter, channel_name: value, offset: 0 })
  }

  const onFilter = (value) => {
    setFilter({ ...filter, customer_status_name: value, offset: 0 })
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const handleChannelStatus = (checked) => {
    onChannelFilter(checked)
    setCurrentPage(1)
  }

  const handleStatus = (checked) => {
    onFilter(checked)
    setCurrentPage(1)
  }

  const handleMobile = (e) => {
    onMobileSearch(e.target.value)
  }

  const columnsCurrent = [
    {
      title: 'Company',
      dataIndex: 'company'
    },
    {
      title: 'User',
      dataIndex: 'name'
    },
    {
      title: 'Phone',
      dataIndex: 'mobile',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Phone Number'
            id='number'
            name='number'
            type='number'
            value={filter.mobile}
            onChange={handleMobile}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'City',
      dataIndex: 'cityName',
      render: (text, record) => {
        return record.city && record.city.name
      },
      filterDropdown: (
        <div>
          <Input placeholder='Search City Name' id='cityName' name='cityName' />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      render: (text, record) => {
        return record.onboarded_by && record.onboarded_by.name
      },
      filterDropdown: (
        <div>
          <Input placeholder='Search Employee Name' id='owner' name='owner' />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Source',
      dataIndex: 'source',
      filterDropdown: (
        <Checkbox.Group
          options={channels}
          defaultValue={filter.channel_name}
          onChange={handleChannelStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        return record.channel && record.channel.name
      },
      filters: CusSource
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filterDropdown: (
        <Checkbox.Group
          options={customers_status}
          defaultValue={filter.customer_status_name}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        return record.status && record.status.name
      },
      filters: CusState
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      render: (text, record) => {
        const comment = get(record, 'last_comment.description', '-')
        return <Truncate data={comment} length={20} />
      }
    },
    {
      title: 'Created Date',
      dataIndex: 'date',
      render: (text, record) => {
        const create_date = get(record, 'customer_comments[0].created_at', '-')
        return (create_date ? moment(create_date).format('DD-MMM-YY') : null)
      },
      sorter: (a, b) => (a.date > b.date ? 1 : -1)
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (text, record) => <Switch onChange={(checked) => onLeadChange(checked, record.id)} checked={text} size='small' />
    },
    {
      title: 'Action',
      render: (text, record) => (
        <Space>
          <Tooltip title='Comment'>
            <Button
              type='link'
              icon={<CommentOutlined />}
              onClick={() => handleShow('commentVisible', null, 'commentData', record.id)}
            />
          </Tooltip>
          <Popconfirm
            title='Are you sure want to Reject the lead?'
            okText='Yes'
            cancelText='No'
            onConfirm={() => onSubmit(record.id)}
          >
            <Button
              type='primary'
              size='small'
              shape='circle'
              danger
              icon={<CloseOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]
  return (
    <>
      <Table
        rowSelection={{ ...rowSelection }}
        columns={columnsCurrent}
        dataSource={customer}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />
      {!loading && record_count
        ? (
          <Pagination
            size='small'
            current={currentPage}
            pageSize={filter.limit}
            showSizeChanger={false}
            onChange={pageChange}
            className='text-right p10'
          />) : null}
      {object.commentVisible && (
        <Modal
          title='Comments'
          visible={object.commentVisible}
          onCancel={handleHide}
          bodyStyle={{ padding: 10 }}
          footer={null}
        >
          <CustomerComment customer_id={object.commentData} />
        </Modal>)}
    </>
  )
}

export default CustomerLead
