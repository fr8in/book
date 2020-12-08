import React, { useState } from 'react'
import { Table,Tooltip} from 'antd'
import Truncate from '../common/truncate'
import { gql,  useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import LinkComp from '../common/link'

const APPROVED_REJECTED_SUBSCRIPTION = gql`
subscription customerTransfertoBank_history($cardcode:String) {
  customer_wallet_outgoing(where:{card_code:{_eq:$cardcode}status:{_in:["APPROVED","REJECTED"]}}){
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


const ApprovedAndRejected = (props) => {
 const {cardcode} =props

  const { loading, error, data } = useSubscription(
    APPROVED_REJECTED_SUBSCRIPTION,{
    variables:{
      cardcode:cardcode
    }
}
  )
 
  let _data = {}
  if (!loading) {
    _data = data
  }
  const approvedAndRejected = get(_data,'customer_wallet_outgoing', null)
  
  const ApprovalPending = [
    {
      title: 'Customer Name',
      width: '15%',
      render: (text, record) => {
        const cardcode = get(record, 'card_code', null)
        const name = get(record, 'customers[0].name', null)
        return (
          <LinkComp type='customers' data={name} id={cardcode} length={20} blank />
        )
      }
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
      width: '8%',
      render: (text, record) => <Truncate data={text} length={10} />,
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
      width: '7%',
      render: (text, record) => <Truncate data={text} length={20} />,
    },
    {
      title: (
        <Tooltip title='Request On'>
          <span>Req.On</span>
        </Tooltip>
      ),
      dataIndex: 'created_on',
      key: 'created_on',
      width: '7%',
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
      title: 'Payment Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (text, record) => <Truncate data={text} length={18} />
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
      width: '12%',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      defaultSortOrder: 'descend',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    }
  ]

  return (
    <>
      <Table
        columns={ApprovalPending}
        dataSource={approvedAndRejected}
        rowKey={(record) => record.id}
        loading={loading}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />
    </>
  )
}

export default ApprovedAndRejected
