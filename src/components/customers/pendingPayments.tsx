
import { Row, Col, Tag } from 'antd'
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
              get(customer_exception, 'advance_pending_amount', null)
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
       <Col sm={9} xs={9}>
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
            label='Receipts/Invoice'
            data={
              get(customer_exception, 'advance_pending_for_more_than_5_days', null)
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
    </>

  )
}

export default PendingPayments
