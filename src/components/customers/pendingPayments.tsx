
import { Row, Col,Tag} from 'antd'
import LabelWithData from '../common/labelWithData'
import get from 'lodash/get'

const PendingPayments = (props) => {
  const {customer_info} = props
     const customer_exception = get(customer_info,'customer_exception',[])

const payment_block = get(customer_exception,'is_exception',null)

  return (
    <>
    <Row>
    <Col xs={12} sm={11}>
    <Row>
     <Col xs={12} sm={12}>
     <label>Exception</label>
    </Col>
    <Col style={{ textAlign: 'right' }}>
      <Tag color={payment_block ? '#dc3545' : '#28a745'}>{payment_block ? 'Yes' : 'No'}</Tag>
      </Col>
      </Row>
        <LabelWithData
        label='Advance Pending'
        data={
          get(customer_exception,'advance_pending_amount',null)
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      /> 
      <LabelWithData
        label='Invoice Pending'
        data={get(customer_exception,'invoice_pending',null)}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelWithData
        label= 'Invoiced'
        data={get(customer_exception,'total_outstanding',null)}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
    </Col>

     <Col xs={12} sm={13}>
     <LabelWithData
     label='Advance Pending (>5 D)'
     data={
      get(customer_exception,'advance_pending_for_more_than_5_days',null)
     }
     mdSpan={4}
     smSpan={8}
     xsSpan={12}
   />
   <LabelWithData
     label='Invoiced (>30 D)'
     data={get(customer_exception,'payment_pending_for_more_than_30_days',null)}
     mdSpan={4}
     smSpan={8}
     xsSpan={12}
   />
   <LabelWithData
     label='Receipts (<30 D)'
     data={get(customer_exception,'final_payment_received_in_the_last_30_days',null)}
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
