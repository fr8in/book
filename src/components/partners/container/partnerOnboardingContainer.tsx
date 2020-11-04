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

const UPDATE_PARTNER_MUTATION = gql`
mutation update_partner(
  $partner_id: Int!,
  $cibil: String!,
  $city_id: Int!,
  $name: String!,
  $pan_no: String!,
  $account_holder: String!,
  $account_number: String!,
  $ifsc_code: String!,
  $updated_by:String!,
  $onboarded_by_id: Int!,
  $partner_advance_percentage_id: Int!
){
  update_partner_track(
    partner_id: $partner_id,
    personal_detail: {
      cibil: $cibil, 
      city_id: $city_id, 
      name: $name, 
      pan_no: $pan_no,
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
    }
  ){
    description
    status
    
  }
}`

const ADDRESS_UPDATE = gql`
mutation partner_address($id: Int!, $address: jsonb){
  update_partner(where:{id: {_eq:$id}}, _set:{address:$address}){
    returning{ id }
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
      variables: { id: parseInt(partner_id, 10) },
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

  const [updatePartner] = useMutation(
    UPDATE_PARTNER_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'update_partner_track.status', null)
        const description = get(data, 'update_partner_track.description', null)
        if (status === 'OK') {
          onAddressUpdate()
          setDisableAddTruck(false)
          message.success(description || 'Updated!')
        } else {
          message.error(description)
          setDisableButton(false)
        }
      }
    }
  )

  const [update_address] = useMutation(
    ADDRESS_UPDATE,
    {
      onError (error) {
        message.error(error.toString())
      }
    }
  )

  const onAddressUpdate = () => {
    const address = {
      no: form.getFieldValue('no'),
      address: form.getFieldValue('address'),
      city: form.getFieldValue('city').split(',')[0],
      state: form.getFieldValue('state'),
      pin_code: form.getFieldValue('pin_code')
    }
    update_address({
      variables: {
        id: partner_id,
        address: address
      }
    })
  }

  const onPartnerSubmit = (form) => {
    setDisableButton(true)
    updatePartner({
      variables: {
        partner_id: parseInt(partner_id, 10),
        // personal_detail
        cibil: form.cibil,
        city_id: parseInt(city) || get(partner_info, 'city.id', null),
        name: form.name,
        pan_no: form.pan_no,
        // bank_detail
        account_holder: form.account_holder_name,
        account_number: form.account_no,
        ifsc_code: form.ifsc,
        updated_by: context.email,
        // fr8_detail
        onboarded_by_id: form.on_boarded_by,
        partner_advance_percentage_id: form.advance_percentage
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
