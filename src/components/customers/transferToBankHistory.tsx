import React, { useState } from 'react'
import { Table,Checkbox,Input,Pagination} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Truncate from '../common/truncate'
import Link from 'next/link'
import { gql, useQuery, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import u from '../../lib/util'

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
  }
}`


const ApprovedAndRejected = (props) => {
 const {cardcode} =props
 console.log('cardcode',cardcode)


const [filter, setFilter] = useState()
const [currentPage, setCurrentPage] = useState(1)



console.log('filter', filter)

  const { loading, error, data } = useSubscription(
    APPROVED_REJECTED_SUBSCRIPTION,{
    variables:{
      cardcode:cardcode
    }
}
  )
  console.log('approvedRejected error', error)

  

  let _data = {}
  if (!loading) {
    _data = data
  }
  const approvedAndRejected = get(_data,'customer_wallet_outgoing', null)
  
  
console.log('aa',data)
console.log('bb',approvedAndRejected)
  const ApprovalPending = [
    {
      title: 'Cardcode',
      dataIndex: 'card_code',
      key: 'card_code',
      width: '10%',
    },
    {
      title: 'Trip Id',
      dataIndex: 'load_id',
      key:'load_id',
      width: '10%',
    },
    {
      title: 'Amount ₹',
      dataIndex: 'amount',
      width: '10%',
    },
    {
      title: 'Request By ',
      dataIndex: 'created_by',
      key: 'created_by',
      width: '10%',
      render: (text, record) => <Truncate data={text} length={20} />,
    },
    {
      title: 'Request On',
      dataIndex: 'created_on',
      key: 'created_on',
      width: '10%',
      sorter: (a, b) => (a.created_on > b.created_on ? 1 : -1),
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
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
      title: 'Closed On',
      dataIndex: 'approved_on',
      key: 'approved_on',
      width: '10%',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
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
