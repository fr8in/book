import { Drawer, Row, Col } from 'antd'
import { gql, useQuery } from '@apollo/client'
import Loading from '../common/loading'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const PARTNER_WALLET_STATEMENT_QUERY = gql`
query partner_wallet_statement($cardcode: String) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    cardcode
    partner_accounting {
      cleared
      wallet_balance
      onhold
      commission
      billed
    }
    partner_wallet_statement(order_by:{created_at:desc,docnum:desc}) {
      docnum
      cardcode
      created_at
      amount
      mode
      trip_id
      comment
      type
      route
      trip{
        source{ 
          id 
          name 
        }
        destination{ 
          id 
          name 
        }
        truck{ 
          truck_no 
        }
      }
    }
  }
}
`

const WalletStatement = (props) => {
  const { visible, onHide, cardcode } = props

  const { loading, error, data } = useQuery(
    PARTNER_WALLET_STATEMENT_QUERY,
    {
      variables: { cardcode: cardcode },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('PartnersWalletStatement error', error)

  let _data = {}

  if (!loading) {
    _data = data
  }

  const partner_wallet_statements = get(_data, 'partner[0].partner_wallet_statement', [])
  const wallet_balance = get(_data, 'partner[0].partner_accounting.wallet_balance', 0)

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

  return (
    <Drawer
      title={`Wallet: ₹${wallet_balance ? wallet_balance.toFixed(2) : 0}`}
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
                {!isEmpty(transactionDetails)
                  ? transactionDetails.map((transactionData, i) => {
                    return (
                      isEmpty(transactionData.mode) ? '' : (
                        <Row key={i}>
                          <Col span={18}>
                            <p><b>{transactionData.mode} {transactionData.trip_id || ''}</b></p>
                            {transactionData.trip_id
                              ? <p>{'#' + transactionData.trip_id}, {get(transactionData, 'trip.source.name', null)} - {get(transactionData, 'trip.destination.name', null)}</p>
                              : <p>{transactionData.route || ''}</p>}
                          </Col>
                          <Col span={6} className='text-right'>
                            <span className={transactionData.type === 'Credit' ? 'creditAmount' : 'debitAmount'}>
                              {`₹${transactionData.amount}`}
                            </span>
                          </Col>
                        </Row>)
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
