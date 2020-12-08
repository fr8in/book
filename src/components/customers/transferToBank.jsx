import { Table,  Tooltip, Button, Space, Modal } from 'antd'
import {
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useState,  useContext } from 'react'
import Truncate from '../common/truncate'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Comment from './customerComment'
import Approve from './transfertobankAccept'
import { gql,  useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import LinkComp from '../common/link'
import u from '../../lib/util'
import userContext from '../../lib/userContaxt'

const TRANSFER_SUBSCRIPTION = gql`
subscription customerWalletOutgoing {
  customer_wallet_outgoing(where: {status: {_eq: "PENDING"}}) {
    id
    card_code
    load_id
    amount
    created_by
    created_on
    payment_status
    account_no
    account_holder_name
    ifsc_code
    is_mamul_charges_included
    customers {
      id
      name
      last_comment {
        description
      }
    }
  }
}
`

const TransfertoBank = () => {
  const { role } = u
  const access = [role.admin, role.accounts_manager]
  const approve_roles = [role.admin, role.accounts_manager]
  const reject_roles = [role.admin, role.accounts_manager]
  const initial = {
    commentData: [],
    commentVisible: false,
    approveData: [],
    approveVisible: false,
    title: null
  }

  const context = useContext(userContext)
  const approval_access = u.is_roles(approve_roles, context)
  const rejected_access = u.is_roles(reject_roles, context)
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const [filter, setFilter] = useState(initial)

  const { loading, error, data } = useSubscription(
    TRANSFER_SUBSCRIPTION)

  console.log('pending error', error)

  let _transfertobankdata = {}
  if (!loading) {
    _transfertobankdata = data
  }

  const transferdata = get(_transfertobankdata, 'customer_wallet_outgoing', null)
  const customer_id = get (_transfertobankdata,'customer_wallet_outgoing.customers[0].id',null)
  
  const ApprovalPending = [
    {
      title: 'Customer Name',
      width: '25%',
      render: (text, record) => {
        const cardcode = get(record, 'card_code', null)
        const name = get(record, 'customers[0].name', null)
        return (
          <LinkComp type='customers' data={name} id={cardcode} length={38} blank />
        )
      }
    },
    {
      title: 'Trip Id',
      dataIndex: 'load_id',
      key:'load_id',
      width: '15%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '10%'
    },

    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      width: '15%',
      render: (text, record) => <Truncate data={text} length={18} />
    },
    
    {
      title: 'Req.On',
      dataIndex: 'created_on',
      key: 'created_on',
      sorter: (a, b) => (a.created_on > b.created_on ? 1 : -1),
      width: '10%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      },
      defaultSortOrder: 'descend'
    },
    {
      title: 'Mamul',
      dataIndex: 'is_mamul_charges_included',
      key: 'is_mamul_charges_included',
      width: '15%',
      render: (text, record) => {
        return record.is_mamul_charges_included === true ? 'Mamul Charge' : 'Special Mamul' 
      }
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, record) => (
        <Space>
          <Tooltip title='Accept'>
            {approval_access ? (
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
          <Tooltip title='Decline'>
            {rejected_access ? (
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
