import { Card, Table, Button, Input, message } from 'antd'
import moment from 'moment'
import Truncate from '../common/truncate'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import WalletTopup from './walletTopup'
import useShowHide from '../../hooks/useShowHide'
import _ from 'lodash'

const INCOMING_PAYMENT = gql`
query customer_booking($cardcode: String) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    cardcode
    walletcode
    customer_accounting {
      wallet_balance
    }
    customer_incomings(where: {balance: {_neq: 0}}) {
      id
      created_at
      recevied
      booked
      balance
      comment
      customer_incoming_id
    }
  }
}
`
const PaymentTraceability = (props) => {
  const { selectedRowKeys, selectOnchange, cardcode, amount, setAmount, form } = props
  const { visible, onShow, onHide } = useShowHide('')

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    {
      variables: { cardcode: cardcode }
    }
  )

  console.log('Incoming Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer = get(_data, 'customer[0]', null)
  const customer_incomings = get(customer, 'customer_incomings', [])
  const wallet_balance = get(customer, 'customer_accounting.wallet_balance', 0)

  const onAmountChange = (e, balance) => {
    const value = parseFloat(e.target.value) || 0
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
    dataIndex: 'created_at',
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
      const enableSelectedRows = _.includes(selectedRowKeys, record.id)
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
    dataIndex: 'comment',
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
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 780, y: 250 }}
        pagination={false}
      />
      {visible.wallet && (
        <WalletTopup visible={visible.wallet} onHide={onHide} customer_id={customer.id} />
      )}
    </Card>
  )
}

export default PaymentTraceability
