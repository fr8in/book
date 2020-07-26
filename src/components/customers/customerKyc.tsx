import { Table, Button, Space, Tooltip } from 'antd'
import { CloseOutlined, CheckOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import newCusMock from '../../../mock/customer/newCusMock'

const statusList = [
  { value: 1, text: 'Active' },
  { value: 2, text: 'Registered' },
  { value: 3, text: 'Verification' },
  { value: 4, text: 'Verification' },
  { value: 5, text: 'Deactivated' },
  { value: 6, text: 'Blacklisted' },
  { value: 7, text: 'Rejected' },
  { value: 8, text: 'Lead' }
]

const CustomerKyc = () => {
  const initial = { visible: false, data: [], title: null }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const newCustomer = [
    {
      title: 'User Name',
      dataIndex: 'name',
      width: '12%',
      render: (text, record) => {
        return (
          text && text.length > 14 ? (
            <Tooltip title={text}>
              <span> {text.slice(0, 14) + '...'}</span>
            </Tooltip>
          ) : text
        )
      }
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      width: '12%',
      render: (text, record) => {
        return (
          text && text.length > 14 ? (
            <Tooltip title={text}>
              <span> {text.slice(0, 14) + '...'}</span>
            </Tooltip>
          ) : text
        )
      }
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobileNo',
      width: '10%'
    },
    {
      title: 'Type',
      dataIndex: 'companyType',
      width: '6%'
    },
    {
      title: 'Reg Date',
      dataIndex: 'registrationDate',
      width: '9%',
      render: (text, record) => {
        return (
          text && text.length > 10 ? (
            <Tooltip title={text}>
              <span> {text.slice(0, 10) + '..'}</span>
            </Tooltip>
          ) : text
        )
      }
    },
    {
      title: 'PAN',
      dataIndex: 'panNo',
      width: '9%'
    },
    {
      title: 'Credit Limit',
      dataIndex: 'type',
      width: '8%'
    },
    {
      title: 'De. Mamul',
      dataIndex: 'mamul',
      width: '8%'
    },
    {
      title: 'Adv %',
      dataIndex: 'advancePercentage',
      width: '6%'
    },
    {
      title: 'Status',
      render: (text, record) => record.status && record.status.value,
      width: '10%',
      filters: statusList
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, record) => {
        return (
          <Space>
            {record.panNo
              ? (
                <Button
                  type='primary'
                  size='small'
                  shape='circle'
                  icon={<EyeOutlined />}
                  onClick={() => console.log('View')}
                />)
              : (
                <Button
                  size='small'
                  shape='circle'
                  icon={<UploadOutlined />}
                  onClick={() => console.log('Upload')}
                />)}
            <Button
              type='primary'
              size='small'
              shape='circle'
              className='btn-success'
              icon={<CheckOutlined />}
              onClick={() => handleShow(null, null, null, null)}
            />
            <Button
              type='primary'
              size='small'
              shape='circle'
              danger
              icon={<CloseOutlined />}
              onClick={() => handleShow(null, null, null, null)}
            />
          </Space>
        )
      }
    }
  ]

  return (
    <Table
      columns={newCustomer}
      dataSource={newCusMock}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 960, y: 400 }}
      pagination={false}
    />
  )
}

export default CustomerKyc
