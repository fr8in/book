import { Card, Table, Button, Input, message } from 'antd'
import moment from 'moment'
import Truncate from '../common/truncate'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import WalletTopup from './walletTopup'
import useShowHide from '../../hooks/useShowHide'
import _ from 'lodash'

const INCOMING_PAYMENT = gql`
query customer_incoming($walletcode: String!) {
  customer_sap_incoming( walletcode:$walletcode) {
    walletcode
    date
    wallet_moved_date
    docnum
    docentry
    remarks
    transaction_type
    doc_line
    doc_rate
    recevied
    booked
    balance
  }
}
`
const PaymentTraceability = (props) => {
  const { selectedRowKeys, selectOnchange, customer_id, amount, setAmount, form , walletcode, wallet_balance } = props
  const { visible, onShow, onHide } = useShowHide('')

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    {
      variables: { walletcode: walletcode },
      fetchPolicy: 'cache-and-network'
    }
  )

  console.log('Incoming Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer_incomings = get(_data, 'customer_sap_incoming', [])

  const onAmountChange = (e, balance) => {
    const value = parseFloat(e.target.value) || null
    if (value > balance) {
      message.error(`Don't enter more than ₹${balance}`)
    } else {
      setAmount(value)
      if (form) {
        form.setFieldsValue({ amount: value })
      }
    }
  }

  const columns = [{
    title: 'Date',
    dataIndex: 'date',
    width: '12%',
    render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
  },
  {
    title: 'Amount',
    dataIndex: 'recevied',
    width: '12%',
    sorter: (a, b) => (a.recevied > b.recevied ? 1 : -1)
  },
  {
    title: 'Booked',
    dataIndex: 'booked',
    width: '12%',
    sorter: (a, b) => (a.booked > b.booked ? 1 : -1)
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    width: '12%',
    sorter: (a, b) => (a.balance > b.balance ? 1 : -1)
  },
  {
    title: 'Book Now',
    dataIndex: 'amount',
    width: '12%',
    render: (text, record) => {
      const enableSelectedRows = _.includes(selectedRowKeys, record.docentry)
      return (
        <Input
          type='number'
          size='small'
          value={enableSelectedRows ? amount : null}
          disabled={!enableSelectedRows}
          onChange={(e) => onAmountChange(e, record.balance)}
        />
      )
    }
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    width: '40%',
    render: (text, record) => <Truncate data={text} length={32} />
  }
  ]

  return (
    <Card
      size='small'
      className='card-body-0'
      title={'Wallet Balance: ₹' + wallet_balance}
      extra={<Button type='primary' size='small' onClick={() => onShow('wallet')}> Wallet Top-up </Button>}
    >
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: selectOnchange,
          type: 'radio'
        }}
        columns={columns}
        dataSource={customer_incomings}
        rowKey={(record) => record.docentry}
        size='small'
        scroll={{ x: 780, y: 250 }}
        pagination={false}
        loading={loading}
      />
      {visible.wallet && (
        <WalletTopup visible={visible.wallet} onHide={onHide} customer_id={customer_id} />
      )}
    </Card>
  )
}

export default PaymentTraceability
