import { Drawer, Row, Col } from 'antd'
import { gql, useQuery } from '@apollo/client' 

const PARTNER_WALLET_STATEMENT_QUERY = gql`
query partner_wallet_statement($cardcode: String) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    cardcode
    partner_wallet_statements {
      docnum
      partnercode
      date
      trans_type
      amount
      mode
      refid
      route
    }
  }
}
`

const WalletStatement = (props) => { 
  const { visible, onHide, wallet_balance,cardcode } = props

const { loading, error, data } = useQuery(
  PARTNER_WALLET_STATEMENT_QUERY,
    {
      variables:{cardcode:cardcode},
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('PartnersWalletStatement error', error)
  console.log('PartnersWalletStatement data', data)
 
  var partner_data = {}
  var partner_wallet_statements = []
  
  if (!loading) {
    const {partner}  = data   
    partner_data =  partner[0] ? partner[0] : { name: 'ID does not exist' }
    partner_wallet_statements = partner_data && partner_data.partner_wallet_statements
  }
 console.log('cardcode',cardcode)
  console.log('partner_wallet_statements',partner_wallet_statements)
  const statements = partner_wallet_statements.reduce((transactions, trans) => {
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
                        <span className={transactionData.trans_type === 'Credit' ? 'creditAmount' : 'debitAmount'}>
                          {`${transactionData.trans_type === 'Credit' } ₹${transactionData.amount}`}
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
