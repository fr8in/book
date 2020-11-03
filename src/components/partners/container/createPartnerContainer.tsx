import userContext from '../../../lib/userContaxt'
import { useState, useContext, useEffect } from 'react'
import { Form, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'
import u from '../../../lib/util'
import { useRouter } from 'next/router'
import CreatePartner from '../createPartner'

const INSERT_PARTNER_MUTATION = gql`
mutation create_partner(
  $address: String!,
  $cibil: String!,
  $city_id: Int!,
  $name: String!,
  $pan_no: String!,
  $account_holder: String!,
  $account_number: String!,
  $ifsc_code: String!,
  $updated_by:String!,
  $onboarded_by_id: Int!,
  $partner_advance_percentage_id: Int!,
  $contact_name: String!,
  $email:String!,
  $mobile: String!
) {
  create_partner_track(
    personal_detail: {
      address: $address, 
      cibil: $cibil, 
      city_id: $city_id, 
      name: $name, 
      pan_no: $pan_no
    }, 
    bank_detail: {
      account_holder: $account_holder, 
      account_number: $account_number, 
      ifsc_code: $ifsc_code, 
      updated_by: $updated_by
    }, 
    fr8_detail: {
      onboarded_by_id: $onboarded_by_id, 
      partner_advance_percentage_id: $partner_advance_percentage_id
    }, 
    partner_user: {
      contact_name: $contact_name, 
      email: $email, 
      mobile: $mobile
    }) {
    description
    status
  }
}`

const PartnerOnboardingContainer = () => {
  const [city, setCity] = useState(null)
  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)
  const router = useRouter()
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = u.is_roles(edit_access, context)

  useEffect(() => {
    if (!access) {
      router.push('/')
    }
  })

  const [insertPartner] = useMutation(
    INSERT_PARTNER_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        message.success('Partner Created!!')
        setDisableButton(false)
      }
    }
  )

  const onPartnerSubmit = (form) => {
    setDisableButton(true)
    insertPartner({
      variables: {
        no: form.no,
        address: form.address,
        city: form.city.split(',')[0],
        state: form.state,
        pin_code: form.pin_code,
        cibil: form.cibil,
        city_id: parseInt(city),
        name: form.name,
        pan_no: form.pan_no,
        account_holder: form.account_holder_name,
        account_number: form.account_no,
        ifsc_code: form.ifsc,
        updated_by: context.email,
        onboarded_by_id: form.on_boarded_by,
        partner_advance_percentage_id: form.advance_percentage,
        contact_name: form.contact_name,
        email: form.email,
        mobile: form.mobile
      }
    })
  }

  return (
    <CreatePartner
      onSubmit={onPartnerSubmit}
      form={form}
      city={city}
      setCity={setCity}
      disableButton={disableButton}
    />
  )
}
export default PartnerOnboardingContainer
