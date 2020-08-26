import { useState } from 'react'
import {
  Table,
  Button,
  Space,
  Tooltip,
  Input,
  Popconfirm,
  Radio,
  Pagination,
  message
} from 'antd'
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
import { gql, useMutation } from '@apollo/client'
import moment from 'moment'

const CUSTOMER_REJECT_MUTATION = gql`
  mutation customerReject($status_id: Int, $id: Int!) {
    update_customer_by_pk(
      pk_columns: { id: $id }
      _set: { status_id: $status_id }
    ) {
      id
      name
    }
  }
`

const CustomerKyc = (props) => {
  const {
    loading,
    customers,
    customer_status_list,
    filter,
    record_count,
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

  const handleMobile = (e) => {
    onMobileSearch(e.target.value)
  }

  const handleStatus = (e) => {
    onFilter(e.target.value)
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const customer_status = customer_status_list.map((data) => {
    return { value: data.id, label: data.name }
  })

  const [insertComment] = useMutation(CUSTOMER_REJECT_MUTATION, {
    onError (error) {
      message.error(error.toString())
    },
    onCompleted () {
      message.success('Updated!!')
    }
  })

  const onSubmit = (id) => {
    insertComment({
      variables: {
        status_id: 7,
        id: id
      }
    })
    console.log('customers')
  }

  const newCustomer = [
    {
      title: 'User Name',
      dataIndex: 'name',
      width: '11%',
      render: (text, record) => {
        return text > 14 ? (
          <Tooltip title={text}>
            <span> {text.slice(0, 14) + '...'}</span>
          </Tooltip>
        ) : (
          text
        )
      }
    },
    {
      title: 'Company Name',
      width: '11%',
      render: (text, record) => {
        const company = record.customer && record.customer.name
        const cardcode = record.customer && record.customer.cardcode
        return (
          <Link href='customers/[id]' as={`customers/${cardcode}`}>
            {company && company.length > 14 ? (
              <Tooltip title={company}>
                <a>{company.slice(0, 14) + '...'}</a>
              </Tooltip>
            ) : (
              <a>{company}</a>
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
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.name ? '#1890ff' : undefined }}
        />
      )
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobile',
      width: '10%',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Customer'
            value={filter.mobile}
            onChange={handleMobile}
          />
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.mobile ? '#1890ff' : undefined }}
        />
      )
    },
    {
      title: 'Type',
      width: '8%',
      render: (text, record) => {
        const type = record.customer && record.customer.customer_type && record.customer.customer_type.name ? record.customer.customer_type.name : '-'
        return type
      }
    },
    {
      title: 'Reg Date',
      width: '9%',
      render: (text, record) => {
        const registered = record.customer && record.customer.created_at ? record.customer.created_at : '-'
        return registered && registered.length > 10 ? (
          <Tooltip title={registered}>
            <span>{registered ? moment(registered).format('DD-MMM-YY') : '-'}</span>
          </Tooltip>
        ) : (
          registered
        )
      }
    },
    {
      title: 'PAN',
      width: '9%',
      render: (text, record) => {
        const type = record.customer && record.customer.pan ? record.customer.pan : '-'
        return type
      }
    },
    {
      title: 'Mamul',
      width: '8%',
      render: (text, record) => {
        const statusId = record.customer && record.customer.status && record.customer.status.id ? record.customer.status.id : null
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
        record.customer && record.customer.advancePercentage && record.customer.advancePercentage.name ? record.customer.advancePercentage.name : '-'
        const advancePercentageId =
        record.customer && record.customer.advance_percentage_id ? record.advance_percentage_id : null
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
      render: (text, record) => record.customer && record.customer.status && record.customer.status.name,
      width: '14%',
      filterDropdown: (
        <Radio.Group
          options={customer_status}
          defaultValue={filter.statusId[0]}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, record) => {
        const statusId = record.customer && record.customer.status && record.customer.status.id ? record.customer.status.id : null
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
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 960, y: 550 }}
        className='withIcon paginated'
        loading={loading}
        pagination={false}
      />
      {!loading && (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />
      )}
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
