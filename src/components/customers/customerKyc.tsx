import { Table, Button, Space, Tooltip } from 'antd'
import {
  CloseOutlined,
  CheckOutlined,
  EyeOutlined,
  UploadOutlined
} from '@ant-design/icons'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Link from 'next/link'
import BranchCreation from '../customers/branchCreation'
import CustomerAdvancePercentage from './customerAdvancePercentage'

const CustomerKyc = (props) => {
  const { customers, status, statusId } = props
  const initial = {
    visible: false,
    data: [],
    title: null,
    createBranchVisible: false,
    createBranchData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const newCustomer = [
    {
      title: 'User Name',
      width: '11%',
      render: (text, record) => {
        const user = record.customerUsers[0] && record.customerUsers[0].name
        return user && user.length > 14 ? (
          <Tooltip title={user}>
            <span> {user.slice(0, 14) + '...'}</span>
          </Tooltip>
        ) : (
          user
        )
      }
    },
    {
      title: 'Company Name',
      dataIndex: 'name',
      width: '11%',
      render: (text, record) => {
        return (
          <Link href='customers/[id]' as={`customers/${record.cardcode}`}>
            {text && text.length > 14 ? (
              <Tooltip title={text}>
                <a>{text.slice(0, 14) + '...'}</a>
              </Tooltip>
            ) : (
              <a>{text}</a>
            )}
          </Link>
        )
      }
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobile',
      width: '8%'
    },
    {
      title: 'Type',
      dataIndex: 'type_id',
      width: '10%'
    },
    {
      title: 'Reg Date',
      dataIndex: 'created_at',
      width: '9%',
      render: (text, record) => {
        return text && text.length > 10 ? (
          <Tooltip title={text}>
            <span> {text.slice(0, 10) + '..'}</span>
          </Tooltip>
        ) : (
          text
        )
      }
    },
    {
      title: 'PAN',
      dataIndex: 'pan',
      width: '9%'
    },
    {
      title: 'De. Mamul',
      dataIndex: 'mamul',
      width: '8%'
    },
    {
      title: 'Adv %',
      width: '10%',
      render: (text, record) => {
        const advancePercentage = record.advancePercentage && record.advancePercentage.value
        const advancePercentageId = record.advancePercentage && record.advancePercentage.Id
        return (
          <CustomerAdvancePercentage
            advancePercentage={advancePercentage}
            advancePercentageId={advancePercentageId}
            cardcode={record.cardcode}
          />
        )
      }
    },
    {
      title: 'Status',
      render: (text, record) => record.status && record.status.value,
      width: '14%',
      defaultFilteredValue: statusId,
      filters: status
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, record) => {
        return (
          <Space>
            {record.panNo ? (
              <Button
                type='primary'
                size='small'
                shape='circle'
                icon={<EyeOutlined />}
                onClick={() => console.log('View')}
              />
            ) : (
              <Button
                size='small'
                shape='circle'
                icon={<UploadOutlined />}
                onClick={() => console.log('Upload')}
              />
            )}
            <Button
              type='primary'
              size='small'
              shape='circle'
              className='btn-success'
              icon={<CheckOutlined />}
              onClick={() =>
                handleShow('createBranchVisible', null, null, record)}
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
    <>
      <Table
        columns={newCustomer}
        dataSource={customers}
        rowKey={(record) => record.cardcode}
        size='small'
        scroll={{ x: 960, y: 400 }}
        pagination={false}
      />
      {object.createBranchVisible && (
        <BranchCreation
          visible={object.createBranchVisible}
          onHide={handleHide}
          data={object.createBranchData}
        />
      )}
    </>
  )
}

export default CustomerKyc
