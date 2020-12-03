import { Table, Input, Tooltip, Button, Space,Modal } from 'antd'
import {
  SearchOutlined,
  CommentOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useState, useEffect, useContext } from 'react'
import Truncate from '../common/truncate'
import Link from 'next/link'
import useShowHideWithRecord from  '../../hooks/useShowHideWithRecord'
import Comment from '../customers/customerComment'
import Approve from '../customers/transfertobankAccept'
import { gql,useQuery, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import LinkComp from '../common/link'
import u from '../../lib/util'
import userContext from '../../lib/userContaxt'

import isEmpty from 'lodash/isEmpty'

const TRANSFER_SUBSCRIPTION = gql`
subscription customerWalletOutgoing{
    customer_wallet_outgoing(where:{status:{_eq:"PENDING"}}){
        id
        card_code
        amount
        created_by
        created_on
        payment_status
      }
    }`

const TransfertoBank = () => {
  const { role } = u
  const access = [role.admin, role.accounts_manager]
  const approve_roles = [role.admin,role.accounts_manager]
  const reject_roles = [role.admin,role.accounts_manager]
  const initial = {
    commentData: [],
    commentVisible: false,
    approveData: [],
    approveVisible: false,
    title: null
  }

  const context = useContext(userContext)
  const approval_access =  u.is_roles(approve_roles,context)
  const rejected_access =  u.is_roles(reject_roles,context)
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const [filter, setFilter] = useState(initial)

  const { loading, error, data } = useSubscription(
    TRANSFER_SUBSCRIPTION)

  console.log('pending error', error)

  let _transfertobankdata = {}
  if (!loading) {
    _transfertobankdata = data
  }

  const transferdata = get (_transfertobankdata,'customer_wallet_outgoing' ,null)
console.log('a',data)
console.log('b',_transfertobankdata)
console.log('c',transferdata)
//   const pending_list = get(_data, 'trip_credit_debit', null)

//   useEffect(() => {
//     setFilter({ ...filter, pending: pending_list })
//   }, [pending_list])

//   const onSearch = (e) => {
//     setFilter({ ...filter, searchText: e.target.value })
//     const searchText = e.target.value
//     console.log('searchText', filter)
//     if (searchText.length >= 3) {
//       const regex = new RegExp(searchText, 'gi')
//       const removeNull = filter.pending.filter(record => record.responsibility != null)
//       const newData = removeNull.filter(record => record.responsibility.name.match(regex))
//       const result = newData || filter.pending
//       setFilter({ ...filter, pending: result })
//     } else {
//       setFilter({ ...filter, pending: pending_list })
//     }
//   }

  const ApprovalPending = [
    {
      title: 'Cardcode',
      dataIndex: 'card_code',
      key: 'card_code',
      width: '20%',
    //   render: (text, record) =>
    //     <Link href='/trips/[id]' as={`/trips/${record.trip_id} `}>
    //       <a>{text}</a>
    //     </Link>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '20%'
    },
    
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      width: '20%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    // {
    //   title: 'customer Name',
    //   dataIndex: 'customer',
    //   key: 'customer',
    //   width: '12%',
    //   render: (text, record) => {
    //     return (
    //       <LinkComp
    //         type='partners'
    //         data={get(record, 'trip.partner.cardcode', null) + '-' + get(record, 'trip.partner.name', null)}
    //         id={get(record, 'trip.partner.cardcode', null)}
    //         length={14}
    //       />
    //     )
    //   }
    // },
    {
      title: 'Req.On',
      dataIndex: 'created_on',
      key: 'created_on',
      sorter: (a, b) => (a.created_on > b.created_on ? 1 : -1),
      width: '20%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    // {
    //   title: 'Comment',
    //   dataIndex: 'last_comment',
    //   key: 'last_comment',
    //   width: '11%',
    //   render: (text, record) => <Truncate data={get(record, 'trip.last_comment.description', null)} length={15} />
    // },
    {
      title: 'Action',
      width: '20%',
      render: (text, record) => (
        <Space>
           <Tooltip title='Comment'>
            <Button
              type='link'
              icon={<CommentOutlined />}
              onClick={() => handleShow('commentVisible', null, 'commentData', record.id)}
            />
          </Tooltip> 
          <Tooltip title='Accept'>
            {approval_access ? (
              <Button
                type='primary'
                shape='circle'
                size='small'
                className='btn-success'
                icon={<CheckOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Approved', 'approveData', record)}
              />) : null}
          </Tooltip>
          <Tooltip title='Decline'>
            {rejected_access ? (
              <Button
                type='primary'
                shape='circle'
                size='small'
                danger
                icon={<CloseOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Rejected', 'approveData', record.id)}
              />) : null}
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <>
      <Table
        columns={ApprovalPending}
        dataSource={transferdata}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1256 }}
        pagination={false}
        className='withAction'
        loading={loading}
      />
       {object.commentVisible && (
            <Modal
            title='Comments'
            visible={object.commentVisible}
            onCancel={handleHide}
            bodyStyle={{ padding: 10 }}
            footer={null}
          >
        <Comment
          customer_id={object.commentData}
          onHide={handleHide}
        />
        </Modal>
      )} 
       {object.approveVisible && (
        <Approve
          visible={object.approveVisible}
          onHide={handleHide}
          item_id={object.approveData}
          title={object.title}
        />
      )} 
    </>
  )
}

export default TransfertoBank
