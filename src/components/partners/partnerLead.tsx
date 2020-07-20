import React, { useState } from 'react'  
import {Space, Table, Input, Switch, Popover, Button,Tooltip,Row } from 'antd'
import {DownSquareOutlined, CommentOutlined,CloseCircleTwoTone,ExclamationCircleTwoTone} from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import mock from '../../../mock/customer/sourcingMock'


const source = [
  { value: 1, text: 'DIRECT' },
  { value: 2, text: 'SOCIAL MEDIA' },
  { value: 3, text: 'REFERRAL' },
  { value: 4, text: 'APP' },
  
]
const status =[
  { value: 1, text: 'OPEN' },
  { value: 2, text: 'ON-BOARDED' },
  { value: 3, text: 'REJECTED' },
]
const comment =[
  { value: 1, text: 'No Comment' },
]
const content = (
  <div>
    <p> <ExclamationCircleTwoTone twoToneColor="#eca92b"/> Are you sure want to cancel the lead?</p>
    <Row justify='end' className='m5'>
      <Space>
      <Button>No</Button>
    <Button  type="primary">Yes</Button>
      </Space>
    </Row>
  </div>
);
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};


const PartnerKyc = () => {
  const [selectionType, setSelectionType] = useState('checkbox');
  const initial = { comment: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const columnsCurrent = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'number',
            filterDropdown: (
              <div > 
                  <Input placeholder="Search Phone Number" />  
              </div>
            ),
          filterIcon:<DownSquareOutlined />
    },
    {
      title: 'City',
      dataIndex: 'cityName',
      filterDropdown: (
        <div > 
            <Input placeholder="Search City Name" />  
        </div>
      ),
    filterIcon:<DownSquareOutlined />
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      filterDropdown: (
        <div > 
            <Input placeholder="Search Employee Name" />  
        </div>
      ),
    filterIcon:<DownSquareOutlined />
    },
    {
      title: 'Source',
      dataIndex: 'source',
      filters:source
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters:status
    },
    {
        title: 'Last Comment',
        dataIndex: 'comment',
        filters:comment
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
          <Switch onChange={onChange}></Switch>
          ),
      },
      {
          title: 'Action',
          dataIndex: 'action',
          render: (text, record) => (
            <span className='actions'>
              <Tooltip title='Comment'>
                <Button type='link' icon={<CommentOutlined />} onClick={() => onShow('comment')} />
              </Tooltip>
              <Popover content={content} >
    <CloseCircleTwoTone />
  </Popover>
            </span>
          )
        },
  ]
  return (
    
      <Table
      rowSelection={{
        ...rowSelection,
      }}
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />
   
  )
}

export default PartnerKyc
