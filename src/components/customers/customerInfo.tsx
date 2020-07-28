import { Row } from 'antd'
import LabelAndData from '../common/labelAndData'
import SystemMamul from '../customers/systemMamul'
import mockData from '../../../mock/customer/customerDetail'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import ManagedCustomer from './managedCustomer'
import CustomerExceptionDate from './customerExceptionDate'
import CustomerType from './customerType'

const CustomerInfo = (props) => {
  const { customerInfo } = props

  const modelInitial = {
    mamulVisible: false,
    mamulData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(modelInitial)

  return (
    <>
      <Row gutter={8}>
        <LabelAndData
          label='Type'
          data={<CustomerType type={customerInfo.type_id} cardcode={customerInfo.cardcode} />}
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
          data={customerInfo.paymentManager ? customerInfo.paymentManager.email : '-'}
          mdSpan={4}
          smSpan={8}
          xsSpan={24}
        />
        <LabelAndData
          label='S.Mamul'
          data={
            <label className='link' onClick={() => handleShow('mamulVisible', null, 'mamulData', mockData.mamulData)}>
              {mockData.systemMamul}
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
      {object.mamulVisible && (
        <SystemMamul visible={object.mamulVisible} onHide={handleHide} data={object.mamulData} />
      )}
    </>
  )
}

export default CustomerInfo
