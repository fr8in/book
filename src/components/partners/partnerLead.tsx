import React, { useState } from 'react'  
import {Space, Table, Input, Switch, Popover, Button,Tooltip,Row } from 'antd'
import {
  EditTwoTone,
  CommentOutlined,
  CloseCircleTwoTone,
  ExclamationCircleTwoTone,
  SearchOutlined,
    } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import mock from '../../../mock/customer/sourcingMock'
import EmployeeList from '../branches/fr8EmpolyeeList'


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


const PartnerKyc = () => {

  const [selectionType, setSelectionType] = useState('checkbox');
  const initial = { comment: false,employeeList:false  }
  const { visible, onShow, onHide } = useShowHide(initial)

  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', 
      name: record.name,
    }),
  };
  
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
              <Input placeholder="Search Phone Number" 
              id='number'
              name='number'
              type='number'/>  
          </div>
                ),
                filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
                onFilterDropdownVisibleChange: () => onShow('phoneNumberSearch') 
    
    },
    {
      title: 'City',
      dataIndex: 'cityName',
      filterDropdown: (
            <div > 
              <Input placeholder="Search City Name" 
              id='cityName'
              name='cityName'
              />  
          </div>
                ),
                filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
                onFilterDropdownVisibleChange: () => onShow('cityNameSearch') 
                  },
    {
      title: 'Owner',
      dataIndex: 'owner',
      render: (text, record) => {
        return (
          <span className='pull-left'>
         <a>{text} </a>
         <EditTwoTone onClick={() => onShow('employeeList')} />
        </span>
        )
      },
      filterDropdown: (
                  <div > 
                  <Input placeholder="Search Employee Name" 
                  id='owner'
                  name='owner'
                  />  
              </div>
          ),
          filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
          onFilterDropdownVisibleChange: () => onShow('employeeNameSearch') 
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
    <>
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
      {visible.employeeList && <EmployeeList visible={visible.employeeList} onHide={onHide} />}

   </>
  )
  
}

export default PartnerKyc
