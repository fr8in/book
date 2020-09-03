import { Drawer, Row, Col } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import Loading from '../common/loading'
import get from 'lodash/get'

const PARTNER_WALLET_STATEMENT_QUERY = gql`
subscription partner_wallet_statement($cardcode: String) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    cardcode
    partner_wallet_statement_aggregate {
      aggregate{
        sum{
          amount
        }
      }
    }
    partner_wallet_statement(order_by:{created_at:desc}) {
      docnum
      cardcode
      created_at
      amount
      mode
      refid
      comment
      type
    }
  }
}
`

const WalletStatement = (props) => {
  const { visible, onHide, cardcode } = props

  const { loading, error, data } = useSubscription(
    PARTNER_WALLET_STATEMENT_QUERY,
    {
      variables: { cardcode: cardcode }
    }
  )
  console.log('PartnersWalletStatement error', error)

  let _data = {}

  if (!loading) {
    _data = data
  }

  const partner_wallet_statements = get(_data, 'partner[0].partner_wallet_statement', [])
  const wallet_balance = get(_data, 'partner[0].partner_wallet_statement_aggregate.aggregate.sum.amount', 0)

  const statements = partner_wallet_statements.reduce((transactions, trans) => {
    const date = trans.created_at.split('T')[0]
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
      title={`Wallet: ₹${wallet_balance.toFixed(2)}`}
      placement='right'
      closable={false}
      onClose={onHide}
      visible={visible}
      width={360}
    >
      {loading ? <Loading /> : (
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
                          {transactionData.refid && <p>{transactionData.refid}, {transactionData.comment}</p>}
                        </Col>
                        <Col span={6} className='text-right'>
                          <span className={transactionData.type === 'Credit' ? 'creditAmount' : 'debitAmount'}>
                            {`₹${transactionData.amount}`}
                          </span>
                        </Col>
                      </Row>
                    )
                  })
                  : <div />}
              </div>
            )
          })}
        </div>)}
    </Drawer>
  )
}

export default WalletStatement
