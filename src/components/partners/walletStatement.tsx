import { Drawer, Row, Col } from 'antd'

const data = [
  {
    docnum: 216593,
    partnercode: 'ST001895',
    date: '2018-03-21',
    trans_type: 'Credit',
    amount: 32348,
    mode: 'Wallet TopUp',
    refid: '',
    route: ' - '
  },
  {
    docnum: 216664,
    partnercode: 'ST001895',
    date: '2018-03-21',
    trans_type: 'Debit',
    amount: -32348,
    mode: 'Paid to Bank',
    refid: '16020110061794',
    route: '-'
  },
  {
    docnum: 216822,
    partnercode: 'ST001895',
    date: '2018-03-21',
    trans_type: 'Credit',
    amount: 33500,
    mode: 'Advance for  WB11D5816',
    refid: '119853',
    route: 'Hyderabad - Bhubaneswar'
  },
  {
    docnum: 216826,
    partnercode: 'ST001895',
    date: '2018-03-21',
    trans_type: 'Credit',
    amount: 13500,
    mode: 'Advance for  ',
    refid: '210318',
    route: ' - '
  },
  {
    docnum: 216830,
    partnercode: 'ST001895',
    date: '2018-03-21',
    trans_type: 'Debit',
    amount: -47000,
    mode: 'Paid to Bank',
    refid: '16020110061794',
    route: '-'
  },
  {
    docnum: 216850,
    partnercode: 'ST001895',
    date: '2018-03-21',
    trans_type: 'Credit',
    amount: 32348,
    mode: 'Advance for  WB11D5816',
    refid: '119853',
    route: 'Hyderabad - Bhubaneswar'
  },
  {
    docnum: 216851,
    partnercode: 'ST001895',
    date: '2018-03-21',
    trans_type: 'Credit',
    amount: -32348,
    mode: 'Wallet TopUp',
    refid: '',
    route: ' - '
  },
  {
    docnum: 218071,
    partnercode: 'ST001895',
    date: '2018-03-23',
    trans_type: 'Credit',
    amount: 9322,
    mode: 'Advance for  WB11D5816',
    refid: '119853',
    route: 'Hyderabad - Bhubaneswar'
  },
  {
    docnum: 218110,
    partnercode: 'ST001895',
    date: '2018-03-23',
    trans_type: 'Debit',
    amount: -9322,
    mode: 'Paid to Bank',
    refid: '16020110061794',
    route: '-'
  },
  {
    docnum: 218550,
    partnercode: 'ST001895',
    date: '2018-03-24',
    trans_type: 'Credit',
    amount: 2250,
    mode: 'Others for ',
    refid: '',
    route: ' - '
  }
]

const WalletStatement = (props) => {
  const { visible, onHide, wallet_balance } = props

  const statements = data.reduce((transactions, trans) => {
    const date = trans.date
    if (!transactions[date]) {
      transactions[date] = []
    }
    transactions[date].push(trans)
    return transactions
  }, {})
  const wallet_statement = Object.keys(statements).map((date) => {
    return {
      date,
      transactions: statements[date]
    }
  })

  console.log('statement_group', wallet_statement)
  return (
    <Drawer
      title={`Wallet: ₹${wallet_balance}`}
      placement='right'
      closable={false}
      onClose={onHide}
      visible={visible}
      width={360}
    >
      <div className='walletList'>
        {wallet_statement.map((data, i) => {
          const transactionDetails = data.transactions
          return (
            <div key={i}>
              <h4>{data.date}</h4>
              {transactionDetails && transactionDetails.length > 0
                ? transactionDetails.map((transactionData, i) => {
                  return (
                    // transactionData.type === 'Credit'
                    <Row key={i}>
                      <Col span={18}>
                        <p><b>{transactionData.mode}</b></p>
                        {transactionData.refid && <p>{transactionData.refid},{transactionData.route}</p>}
                      </Col>
                      <Col span={6} className='text-right'>
                        <span className={transactionData.type === 'Credit' ? 'creditAmount' : 'debitAmount'}>
                          {`${transactionData.trans_type === 'Credit' ? '+' : '-'} ₹${transactionData.amount}`}
                        </span>
                      </Col>
                    </Row>
                  )
                })
                : <div />}
            </div>
          )
        })}
      </div>
    </Drawer>
  )
}

export default WalletStatement
