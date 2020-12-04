
import { Row, Col, Alert } from 'antd'
import LabelWithData from '../common/labelWithData'
import get from 'lodash/get'
import { InfoCircleOutlined } from '@ant-design/icons'

const PendingPayments = (props) => {
  const { customer_info } = props
  const customer_exception = get(customer_info, 'customer_exception', [])
  const receivable_ratio = get(customer_exception, 'receipts_and_receivables_ratio', null)
  return (
    <>
      <Row>
        <Col xs={24} sm={12} md={7}>
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
        <Col xs={24} sm={12} md={7}>
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
        <Col xs={24} sm={12} md={7}>
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
            data={receivable_ratio ? receivable_ratio.toFixed(2) : null}
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
        </Col>
        <Col xs={24} sm={12} md={7}>
          <LabelWithData
            label='Invoiced'
            data={get(customer_exception, 'total_outstanding', null)}
            mdSpan={4}
            smSpan={8}
            xsSpan={12}
          />
        </Col>
      </Row>
      <br />
      <h3> <InfoCircleOutlined /> Criteria for Payment Block </h3>
      <p>{'a) Advance Pending (> 5D) = 0'}<br />
        {'b) Receipts (<30 D) > Invoiced (>30 D)'}<br />
        {'No Payment block for managed customers.'}</p>
    </>
  )
}
 
export default PendingPayments
