import React from 'react'
import EditableCell from '../common/editableCell'
import get from 'lodash/get'
import u from '../../lib/util'

const FinalPaymentEdit = (props) => {
  const { partnerInfo } = props
  const edit_access = [u.role.admin, u.role.rm, u.role.partner_manager, u.role.partner_support]

  const onSubmit = (date) => {
    console.log('onsubmit Clicked!', date)
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
