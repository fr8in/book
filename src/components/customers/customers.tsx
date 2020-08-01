import { useState } from 'react'
import { Table, Button, Space, Tooltip, Input, Popconfirm, Radio, Pagination } from 'antd'
import {
  CloseOutlined,
  CheckOutlined,
  EyeOutlined,
  UploadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Link from 'next/link'
import BranchCreation from '../customers/branchCreation'
import CustomerAdvancePercentage from './customerAdvancePercentage'

const CustomerKyc = (props) => {
  const {
    loading,
    customers,
    customer_status_list,
    filter,
    record_count,
    total_page,
    onFilter,
    onNameSearch,
    onMobileSearch,
    onPageChange
  } = props

  const initial = {
    visible: false,
    data: [],
    title: null,
    createBranchVisible: false,
    createBranchData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const mamulInitial = { mamul: null, selectedId: null }
  const [defaultMamul, setDefaultMamul] = useState(mamulInitial)
  const [currentPage, setCurrentPage] = useState(1)


  const onMamul = (record, e) => {
    const givenMamul = e.target.value
    setDefaultMamul({
      ...defaultMamul,
      mamul: givenMamul,
      selectedId: record.cardcode
    })
  }

  const handleName = (e) => {
    onNameSearch(e.target.value)
  }

  const handleStatus = (e) => {
    onFilter(e.target.value)
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const customer_status = customer_status_list.map(data => {
    return { value: data.id, label: data.value }
  })

  const newCustomer = [
    {
      title: 'User Name',
      width: '11%',
      render: (text, record) => {
        const user = record.customer_users[0] && record.customer_users[0].name
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
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Customer'
            value={filter.name}
            onChange={handleName}
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobile',
      width: '10%'
    },
    {
      title: 'Type',
      dataIndex: 'type_id',
      width: '8%'
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
      title: 'Mamul',
      dataIndex: 'mamul',
      width: '8%',
      render: (text, record) => {
        const statusId = record.status && record.status.id
        return (
          <span>
            {statusId === 1 || statusId === 5 ? (
              `${text || 0}`
            ) : statusId === 3 || statusId === 4 ? (
              <Input
                type='number'
                min={0}
                value={
                  defaultMamul.selectedId === record.cardcode
                    ? defaultMamul.mamul
                    : ''
                }
                defaultValue={defaultMamul.mamul}
                onChange={(e) => onMamul(record, e)}
                size='small'
              />
            ) : null}
          </span>
        )
      }
    },
    {
      title: 'Adv %',
      width: '10%',
      render: (text, record) => {
        const advancePercentage =
          record.advancePercentage && record.advancePercentage.value
        const advancePercentageId =
          record.advancePercentage && record.advancePercentage.Id
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
      filterDropdown: (
        <Radio.Group
          options={customer_status}
          defaultValue={filter.statusId[0]}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      )
      //, filterMultiple: false,
      // filters: customer_status,
      // onFilter: (value, record) => record.status && record.status.value.indexOf(value) === 0
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, record) => {
        const statusId = record.status && record.status.id
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
            {(statusId === 3 || statusId === 4) && (
              <Space>
                <Button
                  type='primary'
                  size='small'
                  shape='circle'
                  className='btn-success'
                  icon={<CheckOutlined />}
                  onClick={() =>
                    handleShow('createBranchVisible', null, null, record)}
                />
                <Popconfirm
                  title='Are you sure want to Reject the Customer?'
                  okText='Yes'
                  cancelText='No'
                  onConfirm={() => console.log('Rejected!')}
                >
                  <Button
                    type='primary'
                    size='small'
                    shape='circle'
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleShow(null, null, null, null)}
                  />
                </Popconfirm>
              </Space>
            )}
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
        scroll={{ x: 960, y: 550 }}
        className='withIcon paginated'
        loading={loading}
        pagination={false}
      />
      {!loading &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />}
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
