
import { Row, Col, Alert } from 'antd'
import LabelWithData from '../common/labelWithData'
import get from 'lodash/get'

const PendingPayments = (props) => {
  const { customer_info } = props
  const customer_exception = get(customer_info, 'customer_exception', [])

  return (
    <>
      <Row>
       <Col sm={7} xs={7}>
          <LabelWithData
            label='Advance Pending'
            data={
              get(customer_exception, 'total_advance_pending_amount', null)
            }
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
          <LabelWithData
            label='Invoice Pending'
            data={get(customer_exception, 'invoice_pending', null)}
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
        </Col>
        <Col sm={7} xs={7}>
          <LabelWithData
            label='Invoiced (>30 D)'
            data={get(customer_exception, 'payment_pending_for_more_than_30_days', null)}
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
          <LabelWithData
            label='Receipts (<30 D)'
            data={get(customer_exception, 'final_payment_received_in_the_last_30_days', null)}
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
        </Col>
       <Col sm={8} xs={8}>
          <LabelWithData
            label='Advance Pending (>5 D)'
            data={
              get(customer_exception, 'advance_pending_for_more_than_5_days', null)
            }
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
           <LabelWithData
            label='Receivable Ratio'
            data={
              get(customer_exception, 'receipts_and_receivables_ratio', null)
            }
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
        </Col>
       <Col sm={7} xs={7}>
          <LabelWithData
            label='Invoiced'
            data={get(customer_exception, 'total_outstanding', null)}
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
        </Col>
      </Row>
      <Row>
        <Alert 
        message=' 
        Transporter- Managed No Exception.
        
       Transporter- Non Managed:
        a) Advance pending for more than 5 days
        b) Final Payment Pending For More than 30 Days => 10000 and  receipt to receivables ratio < 1.00. 
        
         Brokers
        Final Payment Pending For More than 30 Days.'
        type="warning"
        showIcon
        />
      </Row>
    </>

  )
}

export default PendingPayments
