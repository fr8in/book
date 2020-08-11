import { Table, Input, Switch, Popconfirm, Button, Tooltip, message } from 'antd'
import {
  EditTwoTone,
  CommentOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import mock from '../../../mock/customer/sourcingMock'
import EmployeeList from '../branches/fr8EmpolyeeList'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Comment from '../../components/trips/tripFeedBack'
import { gql, useQuery, useMutation } from '@apollo/client'


const PARTNERS_QUERY = gql`
query($partner_status_name:[String!]){
  partner(where:{partner_status:{name:{_in:["Lead","Registered","Rejected"]}}}){
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
const source = [
  { value: 1, text: 'DIRECT' },
  { value: 2, text: 'SOCIAL MEDIA' },
  { value: 3, text: 'REFERRAL' },
  { value: 4, text: 'APP' }
]

const status = [
  { value: 1, text: 'OPEN' },
  { value: 2, text: 'ON-BOARDED' },
  { value: 3, text: 'REJECTED' }
]

const comment = [{ value: 1, text: 'No Comment' }]

const PartnerKyc = () => {
  const initial = { comment: false, employeeList: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)


  const partnerQueryVars = { 
    partner_status_name: initial.partner_status_name
  }

  const { loading, error, data } = useQuery(PARTNERS_QUERY, {
   variables: partnerQueryVars,
      fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('partnerLead error', error)

  var partner = []
 
  
  if (!loading) {
    partner = data && data.partner
  }

console.log('partnerLead',partner)

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
      render: (text, record) => {
        return record.channel && record.channel.name;
      },
      filters: source
    },
    {
      title: 'Status',
      //dataIndex: 'status',
      filters: status,
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
                  record.previousComment
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
      {object.commentVisible && (
        <Comment
          visible={object.commentVisible}
          data={object.commentData}
          onHide={handleHide}
        />
      )}
      {visible.employeeList && (
        <EmployeeList visible={visible.employeeList} onHide={onHide} />
      )}
    </>
  )
}

export default PartnerKyc
