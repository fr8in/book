import { Card, Table, Button, Input } from 'antd'
import moment from 'moment'
import Truncate from '../common/truncate'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import WalletTopup from './walletTopup'
import useShowHide from '../../hooks/useShowHide'

const INCOMING_PAYMENT = gql`
query customer_booking($cardcode: String) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    cardcode
    customer_incomings(where: {balance: {_neq: 0}}) {
      id
      created_at
      recevied
      booked
      balance
      comment
    }
  }
}
`
const PaymentTraceability = (props) => {
  const { selectedRowKeys, selectOnchange,cardcode,wallet_balance } = props
  const { visible, onShow, onHide } = useShowHide('')

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    {
      variables: {cardcode:cardcode} 
    }
  )

  console.log('Incoming Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer = get(_data, 'customer[0]', [])
  const customer_incomings = get(customer, 'customer_incomings', 0)

  const columns = [{
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '15%',
    render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
  },
  {
    title: 'Amount',
    dataIndex: 'recevied',
    key: 'recevied',
    width: '15%'
  },
  {
    title: 'Booked',
    dataIndex: 'booked',
    key: 'booked',
    width: '15%'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    width: '15%'
  },
  {
    title: 'Book Now',
    width: '15%',
    render: (text, record) => {
      return (
        // selectedRow && selectedRow.length > 0 && selectedRow.find(data => data.key === record.key)
        <Input />
      )
    }
  },
  {
    title: 'Remarks',
    dataIndex: 'comment',
    key: 'comment',
    width: '15%',
    render: (text, record) => <Truncate data={text} length={20} />
  }
  ]

  return (
    <Card
      size='small'
      className='card-body-0 mb10'
      title={wallet_balance}
      extra={<Button type='primary' size='small' onClick={() => onShow('wallet')} > Wallet Top-up </Button>}
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
        scroll={{ x: 780, y: 400 }}
        pagination={false}
      />
      {visible.wallet && (
                <WalletTopup visible={visible.wallet} onHide={onHide}  />
              )}
    </Card>
  )
}

export default PaymentTraceability
