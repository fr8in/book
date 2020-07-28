import { useState } from 'react'
import { Table, Button, Space, Tooltip, Input } from 'antd'
import { CloseOutlined, CheckOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Link from 'next/link'

const CustomerKyc = (props) => {
  const { customers, status } = props
  const customerStatus = status.map(data => {
    return { value: data.id.toString(), text: data.value }
  })

  const mamulInitial = { mamul: null, selectedId: null }
  const [defaultMamul, setDefaultMamul] = useState(mamulInitial)

  const initial = { visible: false, data: [], title: null }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const onMamul = (record, e) => {
    const givenMamul = e.target.value
    setDefaultMamul({
      ...defaultMamul,
      mamul: givenMamul,
      selectedId: record.cardcode
    })
  }

  const newCustomer = [
    {
      title: 'User Name',
      width: '12%',
      render: (text, record) => {
        const user = record.customerUsers[0] && record.customerUsers[0].name
        return (
          user && user.length > 14 ? (
            <Tooltip title={user}>
              <span> {user.slice(0, 14) + '...'}</span>
            </Tooltip>
          ) : user
        )
      }
    },
    {
      title: 'Company Name',
      dataIndex: 'name',
      width: '12%',
      render: (text, record) => {
        return (
          <Link href='customers/[id]' as={`customers/${record.cardcode}`}>
            {text && text.length > 14 ? (
              <Tooltip title={text}>
                <a>{text.slice(0, 14) + '...'}</a>
              </Tooltip>
            ) : <a>{text}</a>}
          </Link>
        )
      }
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobile',
      width: '10%'
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
      dataIndex: 'pan',
      width: '9%'
    },
    {
      title: 'De. Mamul',
      dataIndex: 'mamul',
      width: '8%',
      render: (text, record) => {
        const statusId = record.status && record.status.id
        return (
          <span>
            {(statusId === 1 || statusId === 5) ? `${text || 0}`
              : (statusId === 3 || statusId === 4) ? (
                <Input
                  type='number'
                  min={0}
                  value={defaultMamul.selectedId === record.cardcode ? defaultMamul.mamul : ''}
                  defaultValue={defaultMamul.mamul}
                  onChange={(e) => onMamul(record, e)}
                  size='small'
                />) : null}
          </span>
        )
      }
    },
    {
      title: 'Adv %',
      width: '6%',
      render: (text, record) => record.advancePercentage && record.advancePercentage.value
    },
    {
      title: 'Status',
      render: (text, record) => record.status && record.status.value,
      width: '14%',
      filters: customerStatus
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
      dataSource={customers}
      rowKey={record => record.cardcode}
      size='small'
      scroll={{ x: 960, y: 400 }}
      pagination={false}
    />
  )
}

export default CustomerKyc
