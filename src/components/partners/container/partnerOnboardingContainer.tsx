import userContext from '../../../lib/userContaxt'
import { useState, useContext, useEffect } from 'react'
import { Form, message } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import u from '../../../lib/util'
import { useRouter } from 'next/router'
import CreatePartner from '../createPartner'
import KycApproval from '../kycApproval'

const PARTNER_DETAIL_QUERY = gql`
query partner($id: Int!) {
  partner(where:{id:{_eq:$id}}){
    id
    cardcode
    name
    pan
    cibil
    partner_users(where:{is_admin:{_eq:true}}){
      name
      email
      mobile
    }
    account_holder
    display_account_number
    ifsc_code
    address
    partner_status{
      id
      name
    }
    city{
      id
      name
    }
    partner_advance_percentage{
      id
      name
    }
    onboarded_by{
      id
      email
    }
  }
}`

const INSERT_PARTNER_MUTATION = gql`
mutation create_partner_mutation(
  $name: String, $email: String, $cibil: String, $address: jsonb,
  $mobile: String, $pan_no: String, $contact_name: String, 
  $partner_status_id:Int,$city_id:Int,
  $partner_advance_percentage_id:Int,$onboarded_by_id:Int,$created_by:String ) 
  {
  insert_partner(
    objects: {
      name: $name,
      pan: $pan_no, 
      cibil: $cibil, 
      address: $address, 
      created_by:$created_by,
      partner_users:
      {data: {
        mobile: $mobile,
          name: $contact_name,
          email: $email,
          is_admin: true}
        },
      partner_status_id:$partner_status_id,
      city_id:$city_id,
      partner_advance_percentage_id:$partner_advance_percentage_id,
      onboarded_by_id:$onboarded_by_id
    }) {
    returning {
      id
      account_number
      account_holder
      ifsc_code
    }
  }
}`

const UPDATE_ACCOUNT_NO = gql`
mutation update_account_no($id: Int!, $account_number: String!, $account_holder: String!, $ifsc_code: String!, $updated_by: String!) {
  update_account_no(id: $id, account_number: $account_number, account_holder: $account_holder, ifsc_code: $ifsc_code, updated_by:$updated_by) {
    description
    status
  }
}`

const PartnerOnboardingContainer = (props) => {
  const { partner_id } = props
  const [city, setCity] = useState(null)
  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)
  const [disableAddTruck, setDisableAddTruck] = useState(true)
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

  const { loading, data, error } = useQuery(
    PARTNER_DETAIL_QUERY,
    {
      variables: { id: partner_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('PartnerOnboardingContainer Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const partner_info = get(_data, 'partner[0]', null)

  const [update_account_no] = useMutation(
    UPDATE_ACCOUNT_NO,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted (data) {
        const status = get(data, 'update_account_no.status', null)
        const description = get(data, 'update_account_no.description', null)
        if (status === 'OK') {
          message.success(description || 'Account Created!')
          router.push('/partners')
        } else (message.error(description))
      }
    }
  )

  const [insertPartner] = useMutation(
    INSERT_PARTNER_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        message.success('Partner Created!!')
        const partner_id = get(data, 'insert_partner.returning[0].id', null)
        onUpdateAccount(partner_id)
        setDisableButton(false)
      }
    }
  )

  const onPartnerSubmit = (form) => {
    setDisableButton(true)
    const address = {
      no: form.no,
      address: form.address,
      city: form.city.split(',')[0],
      state: form.state,
      pin_code: form.pin_code
    }
    insertPartner({
      variables: {
        name: form.name,
        contact_name: form.contact_name,
        mobile: form.mobile,
        email: form.email,
        pan_no: form.pan_no,
        cibil: form.cibil,
        address: address,
        partner_status_id: 1,
        partner_advance_percentage_id: form.advance_percentage,
        city_id: parseInt(city),
        created_by: context.email,
        onboarded_by_id: form.on_boarded_by
      }
    })
  }

  const onUpdateAccount = (id) => {
    update_account_no({
      variables: {
        id: id,
        account_number: form.getFieldValue('account_no'),
        account_holder: form.getFieldValue('account_holder_name'),
        ifsc_code: form.getFieldValue('ifsc'),
        updated_by: context.email
      }
    })
  }

  return (
    <>
      <CreatePartner
        onSubmit={onPartnerSubmit}
        form={form}
        city={city}
        setCity={setCity}
        disableButton={disableButton}
        loading={loading}
        partner_info={partner_info}
      />
      <KycApproval partner_id={partner_id} disableAddTruck={disableAddTruck} />
    </>
  )
}
export default PartnerOnboardingContainer
