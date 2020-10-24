import { message } from 'antd'
import EditableCell from '../common/editableCell'
import get from 'lodash/get'
import u from '../../lib/util'
import { gql, useMutation } from '@apollo/client'

const FINAL_PAYMENT_UPDATE = gql`
mutation final_payment_update($date:Int!, $partner_id:Int!){
  update_partner(_set:{final_payment_date: $date}, where:{id:{_eq: $partner_id}}){
    returning {
      id
    }
  }
}`

const FinalPaymentEdit = (props) => {
  const { partnerInfo } = props
  const edit_access = [u.role.admin, u.role.rm, u.role.partner_manager, u.role.partner_support]

  const [final_payment_update] = useMutation(
    FINAL_PAYMENT_UPDATE,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    }
  )

  const onSubmit = (date) => {
    if (isNaN(date) || parseInt(date, 10) > 31) {
      message.error('Enter valid date')
    } else {
      final_payment_update({
        variables: {
          partner_id: partnerInfo.id,
          date: date
        }
      })
    }
  }
  return (
    <EditableCell
      label={get(partnerInfo, 'final_payment_date', null)}
      onSubmit={onSubmit}
      edit_access={edit_access}
    />
  )
}

export default FinalPaymentEdit
