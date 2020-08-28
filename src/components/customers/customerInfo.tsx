import { Row } from 'antd'
import LabelAndData from '../common/labelAndData'
import SystemMamul from '../customers/systemMamul'
import mockData from '../../../mock/customer/customerDetail'
import useShowHide from '../../hooks/useShowHide'
import ManagedCustomer from './managedCustomer'
import CustomerExceptionDate from './customerExceptionDate'
import CustomerType from './customerType'
import CustomerPaymentManager from './customerPaymentManager'

const CustomerInfo = (props) => {
  const { customerInfo } = props

  const modelInitial = { mamulVisible: false }
  const { visible, onHide, onShow } = useShowHide(modelInitial)
  const system_mamul = customerInfo.customer_mamul_summary &&
                        customerInfo.customer_mamul_summary.length > 0 &&
                        customerInfo.customer_mamul_summary[0].system_mamul_avg ? customerInfo.customer_mamul_summary[0].system_mamul_avg : 0
  return (
    <>
      <Row gutter={8}>
        <LabelAndData
          label='Type'
          data={<CustomerType type={customerInfo.customer_type && customerInfo.customer_type.name} cardcode={customerInfo.cardcode} />}
          mdSpan={4}
          smSpan={8}
          xsSpan={12}
        />
        <LabelAndData
          label='Managed'
          data={<ManagedCustomer isManaged={customerInfo.managed} cardcode={customerInfo.cardcode} />}
          mdSpan={4}
          smSpan={8}
          xsSpan={12}
        />
        <LabelAndData
          label='Exception'
          data={<CustomerExceptionDate exceptionDate={customerInfo.exception_date} cardcode={customerInfo.cardcode} />}
          mdSpan={4}
          smSpan={8}
          xsSpan={12}
        />
        <LabelAndData
          label='Payment Manager'
          data={
            <CustomerPaymentManager
              paymentManager={customerInfo.payment_manager && customerInfo.payment_manager.email}
              paymentManagerId={customerInfo.payment_manager && customerInfo.payment_manager.id}
              cardcode={customerInfo.cardcode}
            />
          }
          mdSpan={4}
          smSpan={8}
          xsSpan={24}
        />
        <LabelAndData
          label='S.Mamul'
          data={
            <label className='link' onClick={system_mamul ? () => onShow('mamulVisible') : () => {}}>
              {system_mamul}
            </label>
          }
          mdSpan={4}
          smSpan={8}
          xsSpan={24}
        />
        <LabelAndData
          label='Pending'
          data={<label>{mockData.paymentPending}</label>}
          mdSpan={4}
          smSpan={8}
          xsSpan={24}
        />
      </Row>
      {visible.mamulVisible && (
        <SystemMamul visible={visible.mamulVisible} onHide={onHide} cardcode={customerInfo.cardcode} />
      )}
    </>
  )
}

export default CustomerInfo
