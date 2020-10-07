import { Row, Col, Switch, message } from 'antd'
import LabelWithData from '../../common/labelWithData'
import { gql, useQuery, useMutation } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../../lib/util'
import isEmpty from 'lodash/isEmpty'

const FUEL_CARD_QUERY = gql`
query all($partner_id: Int!) {
  partner(where: {id: {_eq: $partner_id}}) {
    fuel_card {
      number
      id
      mobile
      status
    }
    fuel_balance
  }
}
`
const UPDATE_FUEL_CARD_STATUS_MUTATION = gql`
mutation update_fuel_card_status($number:String!,$status:Boolean!,$provider:String!,$modifiedBy:String!){
  update_fuel_card(number:$number,status:$status,provider:$provider,modified_by:$modifiedBy){status
    description
  }
}
`
const PartnerFuelDetail = (props) => {
  const { partner_id } = props
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  const { loading, error, data } = useQuery(
    FUEL_CARD_QUERY, {
      variables: {
        partner_id: partner_id
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    })
  console.log('FuelCard error', error)
  console.log('FuelCard data', data)

  const [updateFuelCardStatus] = useMutation(
    UPDATE_FUEL_CARD_STATUS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const onChange = (checked) => {
    updateFuelCardStatus({
      variables: {
        number: card_number,
        provider: 'RELIANCE',
        status: checked,
        modifiedBy: context.email
      }
    })
  }

  let _data = {}
  if (!loading) {
    _data = data
  }
  const partner = get(_data, 'partner', [])
  const partner_info = partner[0] ? partner[0] : { name: 'ID does not exist' }

  const card_id = partner_info.fuel_card && partner_info.fuel_card.id
  const card_number = partner_info.fuel_card && partner_info.fuel_card.number
  const mobile = partner_info.fuel_card && partner_info.fuel_card.mobile
  const balance = partner_info && partner_info.fuel_balance
  return (
    <Row gutter={10} className='p10'>
      <Col xs={24}>
        <LabelWithData
          label='Card ID'
          data={card_id}
          labelSpan={8}
        />
        <LabelWithData
          label='Card Number'
          data={card_number}
          labelSpan={8}
        />
        <LabelWithData
          label='Balance'
          data={balance}
          labelSpan={8}
        />
        <LabelWithData
          label=' Linked Mobile'
          data={mobile}
          labelSpan={8}
        />
        <LabelWithData
          label='Status'
          data={
            <Switch
              size='small'
              defaultChecked
              onChange={onChange}
              disabled={!access}
            />
          }
          labelSpan={8}
        />
      </Col>
    </Row>
  )
}

export default PartnerFuelDetail
