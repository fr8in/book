import React from 'react'
import { Table,Tooltip,Input,Button, Space,Checkbox,Pagination} from 'antd'
import { useContext,useState } from 'react'
import Truncate from '../common/truncate'
import { gql,  useSubscription,useQuery } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import LinkComp from '../common/link'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import TransferToBankAccept from './transfertobankAccept'
import u from '../../lib/util'
import userContext from '../../lib/userContaxt'
import {
  CheckOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons'
import isEmpty from 'lodash/isEmpty'


const TRANSFER_TO_BANK_HISTORY = gql`
subscription customerTransfertoBank_history($where:customer_wallet_outgoing_bool_exp,$offset:Int,$limit:Int){
  customer_wallet_outgoing(where:$where){
    id
    card_code
    load_id
    amount
    created_by
    created_on
    payment_status
    approved_by
    approved_on
    status
    account_no
    account_holder_name
    is_mamul_charges_included
    customers{
      id
      name
      last_comment{
        description
      }
    }
  }
}`

const Aggregate = gql`
query CUSTOMERWALLETOUTGOINGAGGREGATE ($where:customer_wallet_outgoing_bool_exp) {
  customer_wallet_outgoing_aggregate(where:$where){
    aggregate{
      count
    }
  }
}`

const TransferToBankHistory = (props) => {
 const {cardcode} =props

 const { role } = u
  const context = useContext(userContext)
  const approve_roles = [role.admin, role.accounts_manager]
  const approval_access = u.is_roles(approve_roles, context)
  const reject_roles = [role.admin, role.accounts_manager]
  const rejected_access = u.is_roles(reject_roles, context)

  
  const initial = {
    approveData: [],
    approveVisible: false,
    title: null,
    customername: null,
    status: ['PENDING'],
    offset:0,
    limit:u.limit
  }

  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

const [filter, setFilter] = useState(initial)
const [currentPage, setCurrentPage] = useState(1)
 const where = {
    card_code: {_eq:cardcode },
    customers: {name: {_ilike: filter.customername ? `%${filter.customername}%` : null}},
    status: {_in: !isEmpty(filter.status) ? filter.status : null }
  }

  const { loading, error, data } = useSubscription(
    TRANSFER_TO_BANK_HISTORY,{
    variables:{
     where:where,
     offset: filter.offset,
     limit: u.limit
    }
}
  )
 
  let _data = {}
  if (!loading) {
    _data = data
  }
  const approvedAndRejected = get(_data,'customer_wallet_outgoing', null)

  const { loading: aggreagate_loading, error: aggreagate_error, data: aggreagate_data } = useQuery(
    Aggregate, {
    variables: {
        where: where},
        fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
}
)

let _aggregate = {}
if (!aggreagate_loading) {
  _aggregate = aggreagate_data
}
  
const record_count = get(_aggregate, 'customer_wallet_outgoing_aggregate.aggregate.count', 0)

  const _status = [
    {id:1,name:'PENDING'},
    {id:2,name:'APPROVED'},
    {id:3,name:'REJECTED'}
  ]

   const status_list = !isEmpty(_status) ? _status.map((data) => {
    return { value: data.name, label: data.name }
  }) : []

  const onCustomerSearch = (e) => {
    setFilter({ ...filter, customername: e.target.value,offset: 0 })
  }

  const onFilter = (value) => {
    setFilter({ ...filter, status: value ,offset: 0})
  }
  const handleStatus = (checked) => {
    onFilter(checked)
  }

const onPageChange = (page, pageSize) => {
  const newOffset = page * pageSize - filter.limit
  setCurrentPage(page)
  setFilter({...filter, offset:newOffset})
}
  
  const ApproveandRejectHistory = [
    {
      title: (
        <Tooltip title='Customer Name'>
          <span>Cus.Name</span>
        </Tooltip>
      ),
      width: '10%',
      render: (text, record) => {
        const cardcode = get(record, 'card_code', null)
        const name = get(record, 'customers[0].name', null)
        return (
          <LinkComp type='customers' data={name} id={cardcode} length={10} />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search'
          id='customer_name'
          value={filter.customername}
          onChange={onCustomerSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Trip Id',
      dataIndex: 'load_id',
      key:'load_id',
      width: '7%',
    },
    {
      title: 'Amount ₹',
      dataIndex: 'amount',
      width: '7%',
    },
    {
      title: (
        <Tooltip title='Beneficiary Name'>
          <span>B.Name</span>
        </Tooltip>
      ),
      dataIndex: 'account_holder_name',
      width: '7%',
      render: (text, record) => <Truncate data={text} length={7} />,
    },
    {
      title: (
        <Tooltip title='Beneficiary Acc.No'>
          <span>B.Account NO</span>
        </Tooltip>
      ),
      dataIndex: 'account_no',
      width: '10%',
    },
    {
      title: (
        <Tooltip title='Request By'>
          <span>Req.by</span>
        </Tooltip>
      ),
      dataIndex: 'created_by',
      key: 'created_by',
      width: '6%',
      render: (text, record) => <Truncate data={text} length={15} />,
    },
    {
      title: (
        <Tooltip title='Request On'>
          <span>Req.On</span>
        </Tooltip>
      ),
      dataIndex: 'created_on',
      key: 'created_on',
      width: '8%',
      sorter: (a, b) => (a.created_on > b.created_on ? 1 : -1),
      defaultSortOrder: 'descend',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Mamul',
      dataIndex: 'is_mamul_charges_included',
      key: 'is_mamul_charges_included',
      width: '10%',
      render: (text, record) => 
        <Truncate data={record.is_mamul_charges_included === true ? 'Mamul Charge' : 'Special Mamul '}  length={14}/>
      
    },
    {
      title: (
        <Tooltip title='Payment Status'>
          <span>P.Status</span>
        </Tooltip>
      ),
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (text, record) => <Truncate data={text} length={18} />,
      filterDropdown: (
        <Checkbox.Group
          options={status_list}
          defaultValue={filter.status}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'Closed By',
      dataIndex: 'approved_by',
      key: 'approved_by',
      render: (text, record) => <Truncate data={text} length={20} />,
      width: '10%',
    },
    {
      title: (
        <Tooltip title='Closed On'>
          <span>C.On</span>
        </Tooltip>
      ),
      dataIndex: 'approved_on',
      key: 'approved_on',
      width: '7%',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      defaultSortOrder: 'descend',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
   {
      title: 'Action',
      width: '15%',
      render: (text, record) => (
        <Space>
          <Tooltip title='Approve'>
            {approval_access &&record.status === 'PENDING' ? (
              <Button
                type='primary'
                shape='circle'
                size='small'
                className='btn-success'
                icon={<CheckOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Approve', 'approveData', record)}
              />) : null}
          </Tooltip>
          <Tooltip title='Reject'>
            {rejected_access &&record.status === 'PENDING'? (
              <Button
                type='primary'
                shape='circle'
                size='small'
                danger
                icon={<CloseOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Reject', 'approveData', record)}
              />) : null}
          </Tooltip>
        </Space>
      )
    } 
  ]

  return (
    <>
      <Table
        columns={ApproveandRejectHistory}
        dataSource={approvedAndRejected}
        rowKey={(record) => record.id}
        loading={loading}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />
       {object.approveVisible && (
        <TransferToBankAccept
          visible={object.approveVisible}
          onHide={handleHide}
          item_id={object.approveData}
          title={object.title}
        />
      )}
      {!loading && record_count
                ? (
                    <Pagination
                        size='small'
                        current={currentPage}
                        pageSize={u.limit}
                        showSizeChanger={false}
                        total={record_count}
                        onChange={onPageChange}
                        className='text-right p10'
                    />
                ) : null}
    </>
  )
}

export default TransferToBankHistory
