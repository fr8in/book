import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import u from '../../lib/util'
import get from 'lodash/get'

const UPDATE_PARTNER_NUMBER_MUTATION = gql`
mutation upsert_partner_mobile($mobile: String!, $partner_id: Int!, $is_primary: Boolean!) {
  upsert_partner_mobile(mobile_no: $mobile, partner_id: $partner_id, is_primary: $is_primary) {
    description
    status
  }
}`

const PartnerUserNumber = (props) => {
  const { id, mobile, loading } = props

  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]

  const [updateUserNumber] = useMutation(
    UPDATE_PARTNER_NUMBER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        message.success('Updated!!')
        const status = get(data, 'upsert_partner_mobile.status', null)
        const description = get(data, 'upsert_partner_mobile.description', null)
        if (status === 'OK') {
          message.success(description || 'Updated!')
        } else (message.error(description))
      }
    }
  )

  const onSubmit = (mobile) => {
    updateUserNumber({
      variables: {
        partner_id: id,
        mobile: mobile,
        is_primary: true
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={mobile || '-'}
        onSetText={onSubmit}
        edit_access={edit_access}
      />)
  )
}

export default PartnerUserNumber
