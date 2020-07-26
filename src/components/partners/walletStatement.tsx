import { Drawer, Row, Col, Spin } from 'antd'
import { statement } from '../../../mock/partner/statement'

const WalletStatement = (props) => {
  const { visible, onHide } = props
  const walletStatement = statement.walletStatement
  return (
    <Drawer
      title={`Wallet: ₹${statement.walletBalance}`}
      placement='right'
      closable={false}
      onClose={onHide}
      visible={visible}
      width={360}
    >
      <>
        {walletStatement.map((data, i) => {
          const transactionDetails = data.transactions
          return (
            <div key={i} className='walletList'>
              <h4>{data.date}</h4>
              {transactionDetails && transactionDetails.length > 0
                ? transactionDetails.map((transactionData, i) => {
                  return (
                    // transactionData.type === 'Credit'
                    <Row key={i}>
                      <Col span={18}>
                        <p><b>{transactionData.mode}</b></p>
                        {transactionData.refId && <p>{transactionData.refId},{transactionData.route}</p>}
                      </Col>
                      <Col span={6} className='text-right'>
                        <span className={transactionData.type === 'Credit' ? 'creditAmount' : 'debitAmount'}>
                          {`${transactionData.type === 'Credit' ? '+' : '-'} ₹${transactionData.amount}`}
                        </span>
                      </Col>
                    </Row>
                  )
                })
                : <div />}
            </div>
          )
        })}
      </>
    </Drawer>
  )
}

export default WalletStatement
