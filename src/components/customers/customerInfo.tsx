import { Row, Avatar } from 'antd'
import LabelAndData from '../common/labelAndData'
import SystemMamul from '../customers/systemMamul'
import useShowHide from '../../hooks/useShowHide'
import ManagedCustomer from './managedCustomer'
import CustomerType from './customerType'
import CustomerPaymentManager from './customerPaymentManager'
import get from 'lodash/get'
import u from '../../lib/util'
import Link from 'next/link'

const CustomerInfo = (props) => {
  const { customer_info } = props
  
  const { role } = u
  const customerTypeEdit = [role.admin, role.accounts_manager, role.accounts]
  const paymentManagerEdit = [role.admin, role.accounts_manager]
  const managedCustomerEdit = [role.admin, role.accounts_manager]
  const customerMamulEdit = [role.admin,role.rm]
  const modelInitial = { mamulVisible: false }
  const { visible, onHide, onShow } = useShowHide(modelInitial)
  const system_mamul = get(customer_info, 'system_mamul', 0)
  const customer_exception = get(customer_info,'is_exception',null)
  const telegram_group = get(customer_info,'telegram[0].group_link',null)
 const standard_mamul =get(customer_info,'standard_mamul',0)
  return (
    <>
      <Row gutter={8}>
        <LabelAndData
          label='Type'
          data={<CustomerType type={get(customer_info, 'customer_type.name', '-')} cardcode={customer_info.cardcode} customer_id={customer_info.id} edit_access={customerTypeEdit}/>}
          mdSpan={4}
          smSpan={8}
          xsSpan={12}
        />
        <LabelAndData
          label='Managed'
          data={<ManagedCustomer isManaged={customer_info.managed} cardcode={customer_info.cardcode} customer_id={customer_info.id} edit_access={managedCustomerEdit}/>}
          mdSpan={4}
          smSpan={8}
          xsSpan={12}
        />
        <LabelAndData
          label='Exception'
          data={<Avatar shape='square' size='small' style={{ backgroundColor: customer_exception ? '#dc3545' : '#28a745' }} />}
          mdSpan={4}
          smSpan={8}
          xsSpan={12}
        />
        <LabelAndData
          label='Payment Manager'
          data={
            <CustomerPaymentManager
              paymentManager={get(customer_info, 'payment_manager.email', '-')}
              paymentManagerId={get(customer_info, 'payment_manager.id', null)}
              cardcode={customer_info.cardcode}
              edit_access={paymentManagerEdit}
              customer_id={customer_info.id}
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
              {Math.max(system_mamul, standard_mamul)}
            </label>
          }
          mdSpan={4}
          smSpan={8}
          xsSpan={24}
        />
        <LabelAndData
          label='Telegram group'
          data={
            telegram_group 
            ? <Link href={telegram_group}><a>Click here</a></Link>
            : 'Telegram group not created'
          }
          mdSpan={4}
          smSpan={8}
          xsSpan={24}
        />
        {/* <LabelAndData
          label='Pending'
          data={<label>{mockData.paymentPending}</label>}
          mdSpan={4}
          smSpan={8}
          xsSpan={24}
        /> */}
      </Row>
      {visible.mamulVisible && (
        <SystemMamul visible={visible.mamulVisible} onHide={onHide} cardcode={customer_info.cardcode} edit_access = {customerMamulEdit} standard_mamul={standard_mamul} system_mamul={system_mamul}/>
      )}
    </>
  )
}

export default CustomerInfo
