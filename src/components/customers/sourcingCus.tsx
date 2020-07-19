import React from 'react'
import { Table, Input, Switch,Row, Button,Space,Tooltip, Popover} from 'antd'
import {DownSquareOutlined,ExclamationCircleTwoTone,CommentOutlined,CloseCircleTwoTone} from '@ant-design/icons'
import mock from '../../../mock/customer/sourcingMock'
import useShowHide from '../../hooks/useShowHide'
const CusSource=[
  { value: 1, text: 'DIRECT' },
  { value: 2, text: 'SOCIAL MEDIA' },
  { value: 3, text: 'REFERRAL' },
  { value: 4, text: 'APP' },
]
const CusState=[
  { value: 1, text: 'OPEN' },
  { value: 2, text: 'ON-BOARDED' },
  { value: 3, text: 'REJECTED' },
]

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
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
const SourcingCus = () => {
  const initial = { comment: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const columnsCurrent = [
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'User',
      dataIndex: 'name'
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
        filters: CusSource
      },
    {
        title: 'Status',
        dataIndex: 'status',
        filters: CusState
      },
      {
        title: 'Comment',
        dataIndex: 'comment'
      },
      {
        title: 'Created Date',
        dataIndex: 'date',
        sorter:true,
      },
    {
        title: 'Priority',
        dataIndex: 'Priority',
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
</Popover>,
          </span>
        )
      }
  ]
  return (
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
  )
}

export default SourcingCus
