
import { useState } from 'react'
import { Table, Space, Button } from 'antd'
import mock from '../../../mock/customer/sourcingMock'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import VasConfirmation from './vasConfirmation'

const VasRequest = () => {
  const initial = { visible: false, data: [], status: null }
  const [confirm, setConfirm] = useState(initial)

  const showConfirmation = (status, record) => {
    setConfirm({ ...confirm, data: record, status, visible: true })
  }

  const closeConfirm = () => {
    setConfirm(initial)
  }

  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'partnerCode',
      width: '12%'
    },
    {
      title: 'Partner Name',
      dataIndex: 'name',
      width: '12%'
    },
    {
      title: 'Contact No',
      dataIndex: 'number',
      width: '13%'
    },
    {
      title: 'Requested Service',
      dataIndex: 'service',
      width: '13%'
    },
    {
      title: 'Request Date',
      dataIndex: 'date',
      width: '12%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '12%'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '25%',
      render: (text, record) => {
        return (
          <Space>
            <Button
              type='primary'
              className='btn-success'
              icon={<CheckOutlined />}
              onClick={() => showConfirmation('Accept', record)}
            />
            <Button
              type='primary'
              danger
              icon={<CloseOutlined />}
              onClick={() => showConfirmation('Reject', record)}
            />
          </Space>
        )
      }
    }
  ]
  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 1156 }}
        pagination={false}
      />
      {confirm.visible &&
        <VasConfirmation
          visible={confirm.visible}
          data={confirm.data}
          status={confirm.status}
          onHide={closeConfirm}
        />}
    </>
  )
}

export default VasRequest
