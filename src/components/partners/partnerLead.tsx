import { Table, Input, Switch, Popconfirm, Button, Tooltip, message, Pagination, Checkbox, Modal,Radio } from 'antd'
import {
  EditTwoTone,
  CommentOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import moment from 'moment'
import { gql, useQuery, useMutation } from '@apollo/client'
import EmployeeList from '../branches/fr8EmpolyeeList'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Comment from '../../components/partners/comment'


const PARTNERS_LEAD_QUERY = gql`
query(
  $offset: Int!
  $limit: Int!
  $partner_status_name:[String!]
  $channel_name:[String!]
  $mobile: String
  $city_name:String
  $no_comment:Boolean
  ){
  partner(
    offset: $offset
    limit: $limit
    order_by: 
    {lead_priority: desc_nulls_last},
    where:{
      partner_users:{mobile:{ _like: $mobile}},
      city:{name:{_ilike:$city_name}},
      partner_status:{name:{_in:$partner_status_name}},
      channel: {name: {_in:$channel_name}}}
      ){
    id
    name
    lead_priority
    onboarded_by{
      id
      email
    }
    partner_users{
      mobile
    }
    city{
      id
      name
    }
    channel{
      id
      name
    }
    partner_status{
      name
    }
    partner_comments(where:{partner_id:{_is_null: $no_comment}}){
      created_at
      description
    }
  }
  partner_aggregate(where: {partner_status: {name: {_in: ["Lead","Registered","Rejected"]}}}) {
    aggregate {
      count
    }
  }
  partner_status(where:{name: {_in: ["Lead","Registered","Rejected"]}}, order_by: {id: asc}) {
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
  mutation partner_lead_reject($partner_status_id:Int,$id:Int! ){
    update_partner_by_pk(
        pk_columns: { id: $id }
        _set: { partner_status_id: $partner_status_id }) 
    {
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
const no_comment = [{ value:1, label: 'No Comment' }]

const PartnerLead = () => {
  const initial = {
    no_comment:[],
    comment: false,
    employeeList: false,
    ownerVisible: false,
    ownerData: [],
    offset: 0,
    limit: 10,
    mobile: null,
    city_name:null,
    partner_status_name: ['Lead', 'Registered'],
    channel_name: null
  }

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const partnerQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    no_comment:filter.no_comment && filter.no_comment.length > 0 ? true : false ,
    partner_status_name: filter.partner_status_name,
    channel_name: filter.channel_name,
    mobile: filter.mobile ? `%${filter.mobile}%` : null,
    city_name: filter.city_name ? `%${filter.city_name}%` : null

  }

  const { loading, error, data } = useQuery(
    PARTNERS_LEAD_QUERY, {
    variables: partnerQueryVars,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })
  console.log('partnerLead error', error)
  console.log('partnerLead data', data)


  const [insertComment] = useMutation(
    LEAD_REJECT_MUTATION, {
    onError(error) {
      message.error(error.toString());
    },
    onCompleted() {
      message.success("Updated!!");
    },
  });
  const onSubmit = (id) => {
    insertComment({
      variables: {
        partner_status_id: 3,
        id: id,
      },
    });
  };


  const [updateStatusId] = useMutation(
    UPDATE_LEAD_PRIORITY_STATUS_MUTATION,
    {
      onError(error) {
        message.error(error.toString())
      },
      onCompleted() {
        message.success('Updated!!')
      }
    })
  const onChange = (checked, id) => {
    updateStatusId({
      variables: {
        id: id,
        lead_priority: checked
      }
    })
    console.log('id priority', id)
  }

  var partners = []
  var partner_aggregate = 0;
  var partner_status = [];
  var channel = [];

  if (!loading) {
    partners = data && data.partner
    partner_aggregate = data && data.partner_aggregate
    partner_status = data && data.partner_status
    channel = data && data.channel
  }
  console.log('channel', channel)

  const record_count =
    partner_aggregate &&
    partner_aggregate.aggregate &&
    partner_aggregate.aggregate.count;
  console.log("record_count", record_count)

  const partners_status = partner_status.map((data) => {
    return { value: data.name, label: data.name }
  })
  const channels = channel.map((data) => {
    return { value: data.name, label: data.name }
  })

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    setFilter({ ...filter, offset: newOffset })
  }

  const handleStatus = (checked) => {
    setCurrentPage(1)
    setFilter({ ...filter, partner_status_name: checked, offset: 0 })
  }
  
  const handleChannelStatus = (checked) => {
    setCurrentPage(1)
    setFilter({ ...filter, channel_name: checked, offset: 0 })
  }
   
  const handleMobile = (e) => {
    setFilter({ ...filter, mobile: e.target.value, offset: 0 })
  };
  
  const handleCityName = (e) => {
    setFilter({ ...filter, city_name: e.target.value, offset: 0 })
  };
  const handleNoComment = (checked) => {
    console.log('checked',checked)
    setCurrentPage(1)
    setFilter({ ...filter, no_comment:checked, offset: 0 })
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      )
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name
    })
  }

  const columnsCurrent = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '9%',
      render: (text, record) => {
        return record.name.length > 12 ? (
          <Tooltip title={record.name}>
            <span> {record.name.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
            record.name
          )
      }
    },
    {
      title: 'Phone',
      dataIndex: 'number',
      width: '9%',
      render: (text, record) => {
        return record.partner_users[0] && record.partner_users[0].mobile;
      },
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
      width: '9%',
      render: (text, record) => {
        return record.city && record.city.name;
      },
      filterDropdown: (
        <div>
          <Input placeholder='Search City Name'
           id='cityName' 
           name='cityName' 
           value={filter.city_name}
           onChange={handleCityName}
           />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      width: '10%',
      render: (text, record) => {
        const owner = record.onboarded_by && record.onboarded_by.email
        return (
          <div>
            <span>{owner}&nbsp;</span>
            <EditTwoTone onClick={() =>
              handleShow("ownerVisible", null, "ownerData", record)
            } />
          </div>
        )
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
      title: 'Channel',
      dataIndex: 'source',
      width: '12%',
      filterDropdown: (
        <Checkbox.Group
          options={channels}
          defaultValue={filter.channel_name}
          onChange={handleChannelStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        return record.channel && record.channel.name;
      },
    },
    {
      title: 'Status',
      width: '12%',
      filterDropdown: (
        <Checkbox.Group
          options={partners_status}
          defaultValue={filter.partner_status_name}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        return record.partner_status && record.partner_status.name;
      },
    },
    {
      title: 'Last Comment',
      dataIndex: 'comment',
      width: '13%',
      render: (text, record) => {
        const comment = record.partner_comments && record.partner_comments.length > 0 &&
          record.partner_comments[0].description ? record.partner_comments[0].description : '-'
        return comment && comment.length > 20 ? (
          <Tooltip title={comment}>
            <span> {comment.slice(0, 20) + '...'}</span>
          </Tooltip>
        ) : (
            comment
          )
      },
      filterDropdown: (
        <Checkbox.Group
          options={no_comment}
          defaultValue={filter.no_comment}
          onChange={handleNoComment}
          className='filter-drop-down'
        />
      ),
      
    },
    {
      title: 'Created Date',
      dataIndex: 'date',
      width: '12%',
      render: (text, record) => {
        const create_date = record.partner_comments && record.partner_comments.length > 0 &&
          record.partner_comments[0].created_at ? record.partner_comments[0].created_at : '-'
        return (create_date ? moment(create_date).format('DD-MMM-YY') : null)
      },
      sorter: (a, b) => (a.date > b.date ? 1 : -1)
    },
    {
      title: 'Priority',
      dataIndex: 'lead_priority',
      width: '8%',
      render: (text, record) => <Switch onChange={(checked) => onChange(checked, record.id)} checked={text} />
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '8%',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title='Comment'>
            <Button
              type='link'
              icon={<CommentOutlined />}
              onClick={() =>
                handleShow('commentVisible', null,'commentData',record.id)}
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
        </span>
      )
    }
  ]
  return (
    <>
      <Table
        rowSelection={{
          ...rowSelection
        }}
        columns={columnsCurrent}
        dataSource={partners}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        //onMobileSearch={onMobileSearch}
        className='withAction'
      />
      {!loading && record_count
        ? (
          <Pagination
            size='small'
            current={currentPage}
            pageSize={filter.limit}
            total={record_count}
            onChange={pageChange}
            className='text-right p10'
          />) : null
      }
      {object.commentVisible && (
        <Modal
          title='Comments'
          visible={object.commentVisible}
          onCancel={handleHide}
          bodyStyle={{ padding: 10 }}
        >
          <Comment partner_id={object.commentData} />
        </Modal>)
      }
      {object.ownerVisible && (
        <EmployeeList
          visible={object.ownerVisible}
          partner={object.ownerData}
          onHide={handleHide}
        />
      )}
    </>
  )
}

export default PartnerLead
