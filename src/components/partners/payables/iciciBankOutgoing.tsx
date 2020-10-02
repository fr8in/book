import React from 'react'
import { Table, Input, Row, Col, Button, Space, Tooltip,message } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { gql,useMutation,useQuery} from '@apollo/client'
import {useState,useContext}  from 'react'
import userContext from '../../../lib/userContaxt'
import Truncate from '../../common/truncate'
import get from 'lodash/get'

const pendingTransaction = gql`
query pendingTransaction {
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

const UPDATE_REFERENCE_NUMBER_MUTATION = gql`
mutation updateReferenceNumber ($doc_num:String!,$bank_reference_number:String!){
    update_pending_transaction(
      doc_num: $doc_num
      bank_reference_number: $bank_reference_number
    ) {
      description
      status
    }
  }
`

const Execute_Transfer= gql`
mutation executeTransfer($doc_num:String!,$updated_by:String!) {
  execute_transfer(doc_num:$doc_num, updated_by:$updated_by) {
    description
    status
  }
}`

const OutGoing = (props) => {
  const [state, setState] = useState('')
  const context = useContext(userContext)

  const { loading, error, data } = useQuery(
    pendingTransaction,{ notifyOnNetworkStatusChange: true}
  )
  console.log('pendingTransaction error', error)

  var pendingtransaction = []
  if (!loading) {
    pendingtransaction = data.pending_transaction
  }
 console.log('pendingtransaction',pendingtransaction)

  const [updateReferenceNumber] = useMutation(
    UPDATE_REFERENCE_NUMBER_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const [executeTransfer] = useMutation(
    Execute_Transfer,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!')
      }
    }
  )
  const handleChange = (record,e) => {
    setState(e.target.value)
  }
  console.log('refno', state)

   const onConfirm = (record,docNum) => {
    updateReferenceNumber({
    variables: {
      doc_num: docNum.toString(),
      bank_reference_number:state
    }
  })
  }

  const onSubmit = (record,docNum) => {
    executeTransfer({
        variables: {
          doc_num:docNum.toString(),
          updated_by: context.email
        }
      })
  }

  const OutGoing = [
    {
      title: 'Outgoing No',
      dataIndex: 'docNum',
      key: 'docNum',
      sorter: (a, b) => (a.docNum > b.docNum ? 1 : -1),
      width: '6%'
    },
    {
      title: 'DocDate',
      dataIndex: 'docDate',
      key: 'docDate',
      sorter: (a, b) => (a.docDate > b.docDate ? 1 : -1),
      width: '9%'
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
      width: '9%',
      render: (text, record) => {
        const user = get(record, 'partner_name', '-')
        return (
          <Truncate data={user} length={14} />
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
      title: 'Tran Type',
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
          <Truncate data={user} length={14} />
        )
      }
    },
    {
      title: 'Ref Number',
      width: '11%',
      render: (text,record) => {
      return(
        <Row className='m5'>
          <Space>
            <Col flex='100px'>
              <Input size='small' value={state} 
                 onChange={(e) => handleChange(record.docNum,e)} />
            </Col>
            <Col>
              <CheckCircleTwoTone  onClick={() => onConfirm(record,record.docNum)} />
            </Col>
          </Space>
        </Row>
      )}
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text,record) => {
        return(
          <Button size='small'  type='primary' onClick={()=> onSubmit(record,record.docNum)}
          disabled={!(record.bank_name === "ICICI Bank") || ! record.account_no}
           >
          Execute Transfer
          </Button>
      )
      }
    }
  ]

  
  return (
    <Table
      columns={OutGoing}
      dataSource={pendingtransaction}
      size='small'
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  )
}

export default OutGoing
