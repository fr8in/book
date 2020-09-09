import { useState } from 'react'
import {
  Table,
  Button,
  Space,
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
import BranchCreation from '../customers/branchCreation'
import CustomerAdvancePercentage from './customerAdvancePercentage'
import { gql, useMutation } from '@apollo/client'
import moment from 'moment'
import Truncate from '../common/truncate'
import get from 'lodash/get'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import LinkComp from '../common/link'

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
      render: (text, record) => <Truncate data={text} length={14} />
    },
    {
      title: 'Company Name',
      width: '11%',
      render: (text, record) => {
        const company = get(record, 'customer.name', '-')
        const cardcode = get(record, 'customer.cardcode', null)
        return (
          <LinkComp
            type='customers'
            data={company}
            id={cardcode}
            length={12}
          />)
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
      render: (text, record) => get(record, 'customer.customer_type.name', '-')
    },
    {
      title: 'Reg Date',
      width: '9%',
      render: (text, record) => {
        const registered = get(record, 'customer.created_at', '-')
        return registered ? moment(registered).format('DD-MMM-YY') : '-'
      }
    },
    {
      title: 'PAN',
      width: '9%',
      render: (text, record) => get(record, 'customer.pan', '-')
    },
    {
      title: 'Mamul',
      width: '8%',
      render: (text, record) => {
        const statusId = get(record, 'customer.status.id', null)
        return (
          <span>
            {statusId === 1 || statusId === 5 ? (
              `${text || 0}` // TODO get mamul
            ) : statusId === 3 || statusId === 4 ? (
              <Input
                type='number'
                min={0}
                value={defaultMamul.selectedId === record.cardcode ? defaultMamul.mamul : ''}
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
        const advancePercentage = get(record, 'customer.customer_advance_percentage.name', '-')
        const advancePercentageId = get(record, 'customer.advance_percentage.id', null)
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
      render: (text, record) => get(record, 'customer.status.name', null),
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
        const statusId = get(record, 'customer.status.id', null)
      const pan_files = record && record.customer && record.customer.customer_files.filter(file => file.type === 'PAN')
        return (
          <Space>
            {pan_files && pan_files.length > 0 ? (
            <Space>
              <ViewFile
               size='small'
                id={record.id}
                type='customer'
                folder='pan/'
                file_type='PAN'
                file_list={pan_files}
              />
            </Space>
          ) : (
              <FileUploadOnly
              size='small'
                id={record.id}
                type='customer'
                folder='pan/'
                file_type='PAN'
                file_list={pan_files}
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
        scroll={{ x: 960, y: 530 }}
        className='withIcon paginated'
        loading={loading}
        pagination={false}
      />
      {!loading && (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
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
