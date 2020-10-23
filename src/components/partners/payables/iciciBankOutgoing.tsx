import { useContext, useState } from 'react'
import { Table, Button, message, Tooltip } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'

import userContext from '../../../lib/userContaxt'
import Truncate from '../../common/truncate'
import get from 'lodash/get'
import moment from 'moment'
import Refno from './refNum'

const pendingTransaction = gql`
query pending_transaction {
  pending_transaction {
    docNum
    docDate
    bankAmount
    partner_code
    partner_name
    transfer_type
    account_name
    account_no
    ifsc_code
    payable_status
    bank_name
  }
}`

const Execute_Transfer = gql`
mutation execute_transfer($doc_num:String!,$updated_by:String!) {
  execute_transfer(doc_num:$doc_num, updated_by:$updated_by) {
    description
    status
  }
}`

const OutGoing = (props) => {
  const { label } = props
  const context = useContext(userContext)
  const initial = { loading: false, selected_id: null }
  const [disableBtn, setDisableBtn] = useState(initial)

  const { loading, error, data, refetch } = useQuery(
    pendingTransaction, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('pendingTransaction error', error)

  var _data = []
  if (!loading) {
    _data = data
  }

  const pendingtransaction = get(_data, 'pending_transaction', [])

  const [executeTransfer] = useMutation(
    Execute_Transfer,
    {
      onError (error) {
        message.error(error.toString())
        setDisableBtn(initial)
      },
      onCompleted (data) {
        setDisableBtn(initial)
        const status = get(data, 'execute_transfer.status', null)
        const description = get(data, 'execute_transfer.description', null)
        if (status) {
          refetch()
          message.success(description || 'Updated!!')
        } else {
          message.error(description)
        }
      }
    }
  )

  const onSubmit = (record, docNum) => {
    setDisableBtn({ ...disableBtn, loading: true, selected_id: docNum })
    executeTransfer({
      variables: {
        doc_num: docNum.toString(),
        updated_by: context.email
      }
    })
  }

  const columns = [
    {
      title: <Tooltip title='Outgoing No'>O.No</Tooltip>,
      dataIndex: 'docNum',
      key: 'docNum',
      sorter: (a, b) => (a.docNum > b.docNum ? 1 : -1),
      width: '8%'
    },
    {
      title: 'DocDate',
      sorter: (a, b) => (a.docDate > b.docDate ? 1 : -1),
      width: '8%',
      render: (text, record) => {
        const DocDate = get(record, 'docDate', '-')
        return (DocDate ? moment(DocDate).format('DD-MMM-YY') : null)
      }
    },
    {
      title: 'Vendor Code',
      dataIndex: 'partner_code',
      key: 'partner_code',
      width: '8%'
    },
    {
      title: 'Vendor Name',
      sorter: (a, b) => (a.partner_name > b.partner_name ? 1 : -1),
      width: '10%',
      render: (text, record) => {
        const user = get(record, 'partner_name', '-')
        return (
          <Truncate data={user} length={10} />
        )
      }
    },
    {
      title: 'Bank Amt',
      dataIndex: 'bankAmount',
      key: 'bankAmount',
      width: '7%'
    },
    {
      title: <Tooltip title='Transaction Type'>T.Type</Tooltip>,
      dataIndex: 'transfer_type',
      key: 'transfer_type',
      width: '5%'
    },
    {
      title: 'Acct Name',
      dataIndex: 'account_name',
      key: 'account_name',
      width: '10%'
    },

    {
      title: 'Bank Acct',
      dataIndex: 'account_no',
      key: 'account_no',
      width: '9%'
    },
    {
      title: 'IFSC Code',
      dataIndex: 'ifsc_code',
      key: 'ifsc_code',
      width: '8%'
    },
    {
      title: 'Payable Stat',
      width: '9%',
      render: (text, record) => {
        const user = get(record, 'payable_status', '-')
        return (
          <Truncate data={user} length={12} />
        )
      }
    },
    {
      title: 'Ref Number',
      width: '10%',
      render: (text, record) => {
        return (
          <Refno id={record.docNum} label={label} />
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '7%',
      render: (text, record) => {
        return (
          <Button
            size='small' type='primary' onClick={() => onSubmit(record, record.docNum)}
            disabled={!record.account_no}
            loading={disableBtn.loading && (disableBtn.selected_id === record.docNum)}
          >
            Execute
          </Button>
        )
      }
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={pendingtransaction}
      size='small'
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
      rowKey={(record) => record.docNum}
      loading={loading}
    />
  )
}

export default OutGoing
