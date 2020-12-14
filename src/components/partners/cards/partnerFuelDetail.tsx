import { Row, Col, Switch, message, Button } from 'antd'
import LabelWithData from '../../common/labelWithData'
import { gql, useQuery, useMutation } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../../lib/util'

const FUEL_CARD_QUERY = gql`
query partner_fuel_detail($partner_id: Int!) {
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
const CREATE_FUEL_CARD_MUATION = gql`
mutation createFuelCard ($partner_id:Int!,$created_by:String!,$truck_id:Int!,$truck_no:String!,$mobile_no:String!){
  create_fuel_card_manual(companyId:$partner_id,createdBy:$created_by,deviceId:$truck_id,truck:$truck_no,driverNumber:$mobile_no){
    description
    status
  }
}
`

const PartnerFuelDetail = (props) => {
  const { partner_Info } = props
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = u.is_roles(edit_access, context)
  const truck_id = get(partner_Info, 'trucks[0].id', 0)
  const truck_no = get(partner_Info, 'trucks[0].truck_no', 0)
  const mobile_no = get(partner_Info, 'partner_users[0].mobile', 0)

  const { loading, error, data, refetch } = useQuery(
    FUEL_CARD_QUERY, {
    variables: {
      partner_id: partner_Info.id
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })
  console.log('FuelCard error', error)

  const [updateFuelCardStatus] = useMutation(
    UPDATE_FUEL_CARD_STATUS_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() {
        message.success('Updated!!')
        refetch()
      }
    }
  )
  const [createFuelCard] = useMutation(
    CREATE_FUEL_CARD_MUATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted(data) {
        const status = get(data, 'create_fuel_card_manual.status', null)
        const description = get(data, 'create_fuel_card_manual.description', null)
        if (status === 'OK') {
          message.success(description || 'Created Successfully!')
        } else (message.error(description))
      }
    }
  )
  const onChange = (checked) => {
    updateFuelCardStatus({
      variables: {
        number: fuel_card.card_number,
        provider: 'RELIANCE',
        status: checked,
        modifiedBy: context.email
      }
    })
  }
  const onAddFuelCard = () => {
    createFuelCard({
      variables: {
        partner_id: partner_Info.id,
        created_by: context.email,
        truck_id: truck_id,
        truck_no: `FR8${truck_no}`,
        mobile_no: mobile_no
      }
    })
  }
  let _data = {}
  if (!loading) {
    _data = data
  }
  const partner = get(_data, 'partner', [])
  const _partner = partner[0] ? partner[0] : { name: 'ID does not exist' }
  const fuel_card = get(_partner, 'fuel_card')

  return (
    <>{
      fuel_card ?
        <Row gutter={10} className='p10'>
          <Col xs={24}>
            <LabelWithData
              label='Card ID'
              data={fuel_card.id}
              labelSpan={8}
            />
            <LabelWithData
              label='Card Number'
              data={fuel_card.number}
              labelSpan={8}
            />
            <LabelWithData
              label='Balance'
              data={_partner.fuel_balance}
              labelSpan={8}
            />
            <LabelWithData
              label=' Linked Mobile'
              data={fuel_card.mobile}
              labelSpan={8}
            />
            <LabelWithData
              label='Status'
              data={
                <Switch
                  size='small'
                  defaultChecked={fuel_card.status === true}
                  onChange={onChange}
                  disabled={!access}
                />
              }
              labelSpan={8}
            />
          </Col>
        </Row> :
        <Row gutter={10} className='p10' justify='end'>
          <Button type='primary' onClick={onAddFuelCard}>Add FuelCard</Button>
        </Row>
    }</>
  )
}

export default PartnerFuelDetail
