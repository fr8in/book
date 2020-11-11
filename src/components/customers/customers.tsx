import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
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
  SearchOutlined
} from '@ant-design/icons'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import BranchCreation from '../customers/branchCreation'
import CustomerAdvancePercentage from './customerAdvancePercentage'
import { gql, useMutation } from '@apollo/client'
import moment from 'moment'
import get from 'lodash/get'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import LinkComp from '../common/link'
import isEmpty from 'lodash/isEmpty'
import u from '../../lib/util'
import Phone from '../common/phone'

const CUSTOMER_REJECT_MUTATION = gql`
mutation customer_reject($description: String, $topic: String, $customer_id: Int, $created_by: String,$status_id: Int, $id: Int!,$updated_by:String!) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
    update_customer_by_pk(
      pk_columns: { id: $id }
      _set: { status_id: $status_id,updated_by:$updated_by }
    ) {
      id
      name
      status{
        name
      }
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
    onPageChange,
    edit_access
  } = props

 const context = useContext(userContext)
  
  const initial = {
    visible: false,
    createBranchVisible: false,
    createBranchData: null
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const mamulInitial = { mamul: null, selectedId: null }
  const { topic } = u
  const [defaultMamul, setDefaultMamul] = useState(mamulInitial)
  const [currentPage, setCurrentPage] = useState(1)
  const approvalRejectAccess = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false
  const onMamul = (record, e) => {
    const givenMamul = e.target.value
    setDefaultMamul({
      ...defaultMamul,
      mamul: givenMamul,
      selectedId: record.id
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

  const onReject = (id) => {
    insertComment({
      variables: {
        status_id: 7,
        updated_by: context.email,
        id: id,
        created_by: context.email,
        description:`${topic.customer_reject} updated by ${context.email}`,
        topic:topic.customer_reject,
        customer_id: id
      }
    })
  }

  const onApproval = (record, pan_files) => {
    if (!defaultMamul.mamul) {
      message.error('Enter mamul')
    } else if (defaultMamul.mamul < 0) {
      message.error("Mamul can't be negative")
    } else if (pan_files && pan_files.length === 0) {
      message.error('PAN document required!')
    } else if (record.customer_advance_percentage === null){
      message.error('Advance Percentage Required!')
    }else {
      handleShow('createBranchVisible', null, 'createBranchData', record)
    }
  }

  const newCustomer = [
    {
      title: 'Company Name',
      dataIndex: 'name',
      width: '11%',
      render: (text, record) => {
        return (
          record.cardcode ? (
            <LinkComp
              type='customers'
              data={text}
              id={record.cardcode}
              length={12}
            />) : text
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
      render : (text,record) => <Phone number={record.mobile} />,
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
      render: (text, record) => get(record, 'customer_type.name', '-')
    },
    {
      title: 'Reg Date',
      width: '9%',
      render: (text, record) => {
        const registered = get(record, 'created_at', '-')
        return registered ? moment(registered).format('DD-MMM-YY') : '-'
      }
    },
    {
      title: 'PAN',
      width: '9%',
      render: (text, record) => get(record, 'pan', null)
    },
    {
      title: 'Mamul',
      width: '8%',
      render: (text, record) => {
        const statusId = get(record, 'status.id', null)
        const mamul = get(record, 'system_mamul', null)
        return (
          <span>
            {statusId === 1 || statusId === 5 ? (
              `${mamul || 0}`
            ) : statusId === 3 || statusId === 4 ? (
              <Input
                type='number'
                min={0}
                value={defaultMamul.selectedId === record.id ? defaultMamul.mamul : ''}
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
      render: (text, record) => <CustomerAdvancePercentage record={record} />
    },
    {
      title: 'Loads',
      width: '10%',
      sorter: (a, b) => (a.trips_aggregate.aggregate.count > b.trips_aggregate.aggregate.count ? 1 : -1),
      render: (text,record) => get (record,'trips_aggregate.aggregate.count',null)
    },
    {
      title: 'Status',
      render: (text, record) => get(record, 'status.name', null),
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
        const statusId = get(record, 'status.id', null)
        const pan_files = record && record.customer_files.filter(file => file.type === u.fileType.customer_pan)
        return (
          <Space>
            {pan_files && pan_files.length > 0 ? (
              <Space>
                <ViewFile
                  size='small'
                  id={record.id}
                  type='customer'
                  folder={u.folder.customer_pan}
                  file_type={u.fileType.customer_pan}
                  file_list={pan_files}
                />
              </Space>
            ) : (
              <FileUploadOnly
                size='small'
                id={record.id}
                type='customer'
                folder={u.folder.customer_pan}
                file_type={u.fileType.customer_pan}
                file_list={pan_files}
              />
            )}
            {(statusId === 3 || statusId === 4) && (
              <Space>
                {approvalRejectAccess ? (
                  <>
                    <Button
                      type='primary'
                      size='small'
                      shape='circle'
                      className='btn-success'
                      icon={<CheckOutlined />}
                      onClick={() => onApproval(record, pan_files)}
                    />
                    <Popconfirm
                      title='Are you sure want to Reject the Customer?'
                      okText='Yes'
                      cancelText='No'
                      onConfirm={() => onReject(record.id)}
                    >
                      <Button
                        type='primary'
                        size='small'
                        shape='circle'
                        danger
                        icon={<CloseOutlined />}
                      />
                    </Popconfirm>
                  </>) : null}
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
        scroll={{ x: 1156 }}
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
          customer_data={object.createBranchData}
          mamul={defaultMamul.mamul}
        />
      )}
    </>
  )
}

export default CustomerKyc
