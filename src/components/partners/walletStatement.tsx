import { Drawer, Row, Col, Tooltip } from 'antd'
import { gql, useQuery } from '@apollo/client'
import Loading from '../common/loading'
import get from 'lodash/get'
import {
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
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
      running_total
      mode
      trip_id
      comment
      type
      canceled_flag
      transaction_refno
      transaction_status
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
      closable
      onClose={onHide}
      visible={visible}
      width={window.innerWidth > 510 ? 510 : '100%'} 
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
                    const transactionStatus = get(transactionData, 'transaction_status', null)
                    const referrence_number = get(transactionData, 'transaction_refno', null)
                    return (
                      isEmpty(transactionData.mode) ? '' : (
                        <Row key={i} gutter={6}>
                          <Col span={15}>
                            <p><b>{transactionData.mode} {transactionData.trip_id || ''}</b>{get(transactionData, 'route', null) ? `- ${transactionData.route}` : ''}</p>
                            <p>{transactionData.mode === "Reversal( Paid To Bank )" ? get(transactionData, 'transaction_refno', null) :
                              transactionData.mode === "Paid To Bank"
                                ? get(transactionData, 'transaction_refno', null) &&
                                  transactionStatus === 'COMPLETED' && !get(transactionData, 'canceled_flag', null) ? <>
                                    <Tooltip title={transactionStatus}>
                                      <CheckCircleOutlined
                                        style={{
                                          color: '#28a745',
                                          fontSize: '18px',
                                          paddingTop: '5px'
                                        }}
                                      />
                                    </Tooltip>
                                &nbsp;&nbsp;{get(transactionData, 'transaction_refno', null)}</> :
                                  <>
                                    <Tooltip title={get(transactionData, 'canceled_flag', null) ? 'FAILED' : 'PENDING'}>
                                      <InfoCircleOutlined
                                        style={{
                                          color: get(transactionData, 'canceled_flag', null) ? '#dc3545' : '#FFA500',
                                          fontSize: '18px',
                                          paddingTop: '5px'
                                        }}
                                      />
                                    </Tooltip>
                                  &nbsp;&nbsp;
                                  {referrence_number ? get(transactionData, 'transaction_refno', null) :
                                      get(transactionData, 'canceled_flag', null) ? "FAILED" : "PENDING"
                                    }
                                  </> : ""} </p>
                            {transactionData.trip_id
                              && <p>{'#' + transactionData.trip_id}, {get(transactionData, 'trip.source.name', null)} - {get(transactionData, 'trip.destination.name', null)}</p>
                            }
                          </Col>
                          <Col span={4} className='text-right'>
                            <span className={transactionData.amount > 0 ? 'creditAmount'  : 'debitAmount'}>
                             {transactionData.amount > 0 ? `₹+${transactionData.amount}` : `₹${transactionData.amount}`}
                            </span>
                          </Col>
                          <Col span={5} className='text-right'>
                          <span>{transactionData.running_total ? `₹${transactionData.running_total}` : ''}</span>
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
