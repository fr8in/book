import { useContext } from 'react'
import { Table, Tooltip, Button, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import moment from 'moment'
import get from 'lodash/get'
import Approve from '../partners/approvals/accept'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useSubscription } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'

const CREDIT_NOTE_TABLE_SUBSCRIPTION = gql`
subscription credit_debits($id:Int){
  trip(where: {id: {_eq: $id}}) {
    credit_debits {
      id
      type
      created_by
      created_at
      approved_at
      approved_by
      credit_debit_type {
        name
      }
      amount
      approved_amount
      comment
      credit_debit_status {
        name
      }
    }
  }
}
`

const CreditNoteTable = (props) => {
  const { trip_id, trip_info, setCreditNoteRefetch } = props

  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.rm, role.accounts_manager, role.billing,role.partner_manager,role.partner_support]
  const authorised = u.is_roles(edit_access,context)

  const invoiced = get(trip_info, 'invoiced_at', null)
  const received = get(trip_info, 'received_at', null)
  const closed = get(trip_info, 'closed_at', null)
  const lock = get(trip_info, 'transaction_lock', null)

  const initial = {
    approveData: [],
    approveVisible: false
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const { loading, error, data } = useSubscription(
    CREDIT_NOTE_TABLE_SUBSCRIPTION,
    {
      variables: {
        id: trip_id
      }
    }
  )
  console.log('CreditNoteTable error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const credit_debit_list = get(_data, 'trip[0].credit_debits', null)

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      width: authorised ? '10%' : '14%'
    },
    {
      title: 'Issue Type',
      width: authorised ? '17%' : '19%',
      render: (text, record) => {
        return get(record, 'credit_debit_type.name', null)
      }
    },
    {
      title: 'Claim ₹',
      dataIndex: 'amount',
      width: authorised ? '11%' : '12%'
    },
    {
      title: 'Approved ₹',
      dataIndex: 'approved_amount',
      width: '14%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: authorised ? '24%' : '27%',
      render: (text, record) => {
        return (
             <Tooltip
            title={` Created_at: ${record.created_at && moment(record.created_at).format('DD-MMM-YYYY')} Created_by: ${record.created_by}`}
          >
            <span>{record.comment}</span>
          </Tooltip>)
      }
    }, {
      title: 'Status',
      width: authorised ? '12%' : '14%',
      render: (text, record) => {
          return (
           record.approved_by ? (
             <Tooltip
                title={`Approved_at: ${record.approved_at && moment(record.approved_at).format('DD MMM YYYY')} Approved_by: ${record.approved_by}`}
              >
                {get(record, 'credit_debit_status.name', null)}
              </Tooltip>) 
            : get(record, 'credit_debit_status.name', null)
          )}
    },
    authorised
      ? {
        title: 'Action',
        width: '12%',
        render: (text, record) => (
          get(record, 'credit_debit_status.name', null) === 'PENDING' ? (
            <Space>
              <Button
                type='primary'
                size='small'
                shape='circle'
                className='btn-success'
                disabled={!(invoiced && !received && !closed) || lock}
                icon={<CheckOutlined />}
                onClick={() => handleShow('approveVisible', 'Approve', 'approveData', record)}
              />
              <Button
                type='primary'
                size='small'
                shape='circle'
                danger
                icon={<CloseOutlined />}
                onClick={() => handleShow('approveVisible', 'Reject', 'approveData', record.id)}
              />
            </Space>)
            : <div />)
      } : {}
  ]
  return (
    <div className='cardFix'>
      <Table
        dataSource={credit_debit_list}
        columns={columns}
        pagination={false}
        size='small'
        scroll={{ x: authorised ? 780 : 650, y: 240 }}
        rowKey={record => record.id}
      />

      {object.approveVisible && (
        <Approve
          visible={object.approveVisible}
          onHide={handleHide}
          item_id={object.approveData}
          title={object.title}
          setCreditNoteRefetch={setCreditNoteRefetch}
        />
      )}
    </div>
  )
}

export default CreditNoteTable
