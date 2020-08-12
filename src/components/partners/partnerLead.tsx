import { Table, Input, Switch, Popconfirm, Button, Tooltip, message,Pagination,Checkbox,Modal } from 'antd'
import {
  EditTwoTone,
  CommentOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import {useState} from 'react'
import EmployeeList from '../branches/fr8EmpolyeeList'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Comment from '../../components/partners/comment'
import { gql, useQuery, useMutation } from '@apollo/client'


const PARTNERS_QUERY = gql`
query(
  $offset: Int!
  $limit: Int!
  $partner_status_name:[String!]
  ){
  partner(
    offset: $offset
    limit: $limit
    where:{partner_status:{name:{_in:$partner_status_name}}}){
    id
    name
    cardcode
    partner_users{
      mobile
    }
    city{
      name
    }
    channel{
      id
      name
    }
    partner_status{
      name
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
  channel(order_by: {id: asc}){
    id
    name
  }
}
`
const PARTNER_LEAD_REJECT_MUTATION = gql`
mutation partner_lead_reject($partner_status_id:Int,$id:Int! ){
  update_partner_by_pk(
      pk_columns: { id: $id }
      _set: { partner_status_id: $partner_status_id }
    ) {
  id
    name
  }
}
`

const comment = [{ value: 1, text: 'No Comment' }]

const PartnerKyc = () => {
  const initial = {
     comment: false,
      employeeList: false,
      offset: 0,
      limit: 10,
      partner_status_name:['Lead','Registered']
    }

    const [filter, setFilter] = useState(initial)
    const [currentPage, setCurrentPage] = useState(1)

  const { visible, onShow, onHide } = useShowHide(initial)
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const partnerQueryVars = { 
    offset: filter.offset,
    limit: filter.limit,
    partner_status_name: filter.partner_status_name
  }

  const { loading, error, data } = useQuery(PARTNERS_QUERY, {
   variables: partnerQueryVars,
      fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('partnerLead error', error)

  var partner = []
  var partner_aggregate = 0;
  var partner_status = [];
  var channel = [];
  var id ={}
  if (!loading) {
    partner = data && data.partner
    partner_aggregate = data && data.partner_aggregate
    partner_status = data && data.partner_status
    channel = data && data.channel
    id = data && data.id
  }

console.log('partnerLead',partner)

const record_count =
partner_aggregate &&
partner_aggregate.aggregate &&
partner_aggregate.aggregate.count;

console.log("record_count",record_count)

const partners_status = partner_status.map((data) => {
  return { value: data.name, label: data.name }
})
const channels = channel.map((data) => {
  return { value: data.name, label: data.name }
})

console.log("truckStatus",partners_status)

const onPageChange = (value) => {
  setFilter({ ...filter, offset: value })
}
const onFilter = (value) => {
  setFilter({ ...filter, partner_status_name: value, offset: 0 })
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
const [insertComment] = useMutation(PARTNER_LEAD_REJECT_MUTATION, {
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
  console.log("customers");
};
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
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
      dataIndex: 'name'
    },
    {
      title: 'Phone',
      //dataIndex: 'number',
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
        return record.city && record.city.name;
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
        return (
          <div>
            <span>{text}&nbsp;</span>
            <EditTwoTone onClick={() => onShow('employeeList')} />
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
      filterDropdown: (
        <Checkbox.Group
          options={channels}
          //defaultValue={filter.partner_status_name}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        return record.channel && record.channel.name;
      },
      
    },
    {
      title: 'Status',
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
      filters: comment
    },
    {
      title: 'Created Date',
      dataIndex: 'date',
      sorter: (a, b) => (a.date > b.date ? 1 : -1)
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (text, record) => <Switch onChange={onChange} />
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title='Comment'>
            <Button
              type='link'
              icon={<CommentOutlined />}
              onClick={() =>
                handleShow(
                  'commentVisible',
                  null,
                  'commentData',
                  record.id
                )}
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
        dataSource={partner}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
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
          />) : null}
      

{object.commentVisible && (
        <Modal
          title='Comments'
          visible={object.commentVisible}
          onCancel={handleHide}
          bodyStyle={{ padding: 10 }}
        >
          <Comment partnerId={object.commentData} />
        </Modal>
      )}
      {visible.employeeList && (
        <EmployeeList visible={visible.employeeList} onHide={onHide} />
      )}
    </>
  )
}

export default PartnerKyc
