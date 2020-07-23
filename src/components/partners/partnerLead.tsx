import { Table, Input, Switch, Popconfirm, Button, Tooltip } from 'antd'
import {
  EditTwoTone,
  CommentOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import mock from '../../../mock/customer/sourcingMock'
import EmployeeList from '../branches/fr8EmpolyeeList'

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

const comment = [
  { value: 1, text: 'No Comment' }
]

const PartnerKyc = () => {
  const initial = { comment: false, employeeList: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: record => ({
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
      dataIndex: 'number',
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
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'City',
      dataIndex: 'cityName',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search City Name'
            id='cityName'
            name='cityName'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
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
          <Input
            placeholder='Search Employee Name'
            id='owner'
            name='owner'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Source',
      dataIndex: 'source',
      filters: source
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: status
    },
    {
      title: 'Last Comment',
      dataIndex: 'comment',
      filters: comment
    },
    {
      title: 'Created Date',
      dataIndex: 'date',
      sorter: true
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (text, record) => (
        <Switch onChange={onChange} />
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title='Comment'>
            <Button type='link' icon={<CommentOutlined />} onClick={() => onShow('comment')} />
          </Tooltip>
          <Popconfirm
            title='Are you sure want to Reject the lead?'
            okText='Yes'
            cancelText='No'
            onConfirm={() => console.log('Rejected!')}
          >
            <Button type='primary' danger icon={<CloseOutlined />} />
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
        dataSource={mock}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        className='withAction'
      />
      {visible.employeeList && <EmployeeList visible={visible.employeeList} onHide={onHide} />}
    </>
  )
}

export default PartnerKyc
