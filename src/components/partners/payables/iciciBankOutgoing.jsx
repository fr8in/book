import { useContext, useState } from 'react'
import { Table, Button, message, Tooltip, Space } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'
import { RocketFilled ,EyeOutlined} from '@ant-design/icons'
import userContext from '../../../lib/userContaxt'
import Truncate from '../../common/truncate'
import get from 'lodash/get'
import moment from 'moment'
import Refno from './refNum'
import u from '../../../lib/util'
import useShowHidewithRecord from '../../../hooks/useShowHideWithRecord'
import PayablesStatus from './payablesStatus'

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
  const execute_access = u.is_roles([u.role.admin, u.role.accounts_manager, u.role.accounts], context)
  const initial = { loading: false, selected_id: null ,payable_status:false,doc_num:null}
  const [disableBtn, setDisableBtn] = useState(initial)
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

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
        if (status === 'OK') {
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
      width: '8%',
      defaultSortOrder: 'descend',
    },
    {
      title: 'DocDate',
      sorter: (a, b) => (a.docDate > b.docDate ? 1 : -1),
      width: '7%',
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
      width: '8%',
      render: (text, record) => {
        const user = get(record, 'payable_status', '-')
        return (
          <Truncate data={user} length={12} />
        )
      }
    },
    {
      title: 'Ref Number',
      width: '9%',
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
      width: '11%',
      render: (text, record) => {
        return (
          <>
          <Space>
          <Tooltip title='Execute'>
          <Button
            size='small' type='link' icon={<RocketFilled />} onClick={() => onSubmit(record, record.docNum)}
            disabled={!(record.account_no && execute_access)}
            loading={disableBtn.loading && (disableBtn.selected_id === record.docNum)}
          />
          </Tooltip>
           <Tooltip title='Status'>
          <Button size='small' shape='circle'  icon={<EyeOutlined />} type='primary' className='btn-success' onClick={() =>handleShow('payable_status', null, 'doc_num', record.docNum)}/>
          </Tooltip>
        </Space>
        </>
        )
      }
    }
  ]

  return (
    <>
    <Table
      columns={columns}
      dataSource={pendingtransaction}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
      rowKey={(record) => record.docNum}
      loading={loading}
    />
      {object.payable_status && (
        <PayablesStatus
          visible={object.payable_status}
          doc_num={object.doc_num}
          onHide={handleHide}
        />
      )}
    </>
  )
}

export default OutGoing
