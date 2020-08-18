import { Checkbox, Row, Col, message } from 'antd'
import { gql, useMutation } from '@apollo/client'

const UPDATE_PARTNER_BLACKLIST_MUTATION = gql`
mutation PartnerBlacklist($partner_status_id:Int,$cardcode:String){
  update_partner( _set: {partner_status_id: $partner_status_id }, where: {cardcode:{_eq: $cardcode}} 
  ){
    returning{
      cardcode
      partner_status_id
    }
  }
}
`
const UPDATE_PARTNER_DE_ACTIVATE_MUTATION = gql`
mutation PartnerDeActivate($partner_status_id:Int,$cardcode:String){
  update_partner( _set: {partner_status_id: $partner_status_id}, where: {cardcode:{_eq: $cardcode}} 
  ){
    returning{
      cardcode
      partner_status_id
    }
  }
}
`

const UPDATE_PARTNER_DND_MUTATION = gql`
mutation PartnerDnd($dnd:Boolean,$cardcode:String) {
  update_partner(_set: {dnd: $dnd}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      cardcode
      dnd
    }
  }
}
`


const PartnerStatus = (props) => {
  const { partnerInfo } = props
  const is_blacklisted = partnerInfo && partnerInfo.partner_status && partnerInfo.partner_status.id && partnerInfo.partner_status.id === 4
  const is_deactivate = partnerInfo && partnerInfo.partner_status && partnerInfo.partner_status.id && partnerInfo.partner_status.id === 7

  console.log('partnerStatus', is_blacklisted)
  const admin = true

  const [updateBlacklist] = useMutation(
    UPDATE_PARTNER_BLACKLIST_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )
  const blacklistChange = (e) => {
    updateBlacklist({
      variables: {
        cardcode: partnerInfo.cardcode,
        partner_status_id: e.target.checked ? 4 : 2 
      }
    })
  }

  const [updateDeactivate] = useMutation(
    UPDATE_PARTNER_DE_ACTIVATE_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )
  const deActivateChange = (e) => {
    updateDeactivate({
      variables: {
        cardcode: partnerInfo.cardcode,
        partner_status_id:  e.target.checked ? 7 : 2 
      }
    })
  }

  const [updateDnd] = useMutation(
    UPDATE_PARTNER_DND_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )
  const dndChange = (e) => {
    updateDnd({
      variables: {
        cardcode: partnerInfo.cardcode,
        dnd: e.target.checked
      }
    })
  }

  return (
    <Row>
      <Col xs={8}>
        <Checkbox
          checked={is_blacklisted }
          disabled={!admin && is_blacklisted }
          onChange={blacklistChange}
        >
          BlackList
          </Checkbox>
      </Col>
      <Col xs={9}>
        <Checkbox
          checked={is_deactivate}
          disabled={is_blacklisted}
          onChange={deActivateChange}
        >
          De-activate
          </Checkbox>
      </Col>
      <Col xs={7}>
        <Checkbox
          checked={partnerInfo.dnd}
          disabled={is_blacklisted || is_deactivate }
          onChange={dndChange}
        >
          DND
          </Checkbox>
      </Col>
    </Row>
  )
}

export default PartnerStatus

