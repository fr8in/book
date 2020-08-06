import { Checkbox, Row, Col,message } from 'antd'
import { gql,useMutation } from '@apollo/client'

const UPDATE_PARTNER_DND_MUTATION = gql`
mutation PartnerDnd($dnd:Boolean,$cardcode:String) {
  update_partner(_set: {dnd: $dnd}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      dnd
    }
  }
}
`
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

const PartnerStatus = (props) => {
  const {partnerInfo} =  props
console.log('partnerInfo',partnerInfo)
const admin = true

const [updateBlacklist] = useMutation(
  UPDATE_PARTNER_BLACKLIST_MUTATION,
  {
    onError (error) { message.error(error.toString()) },
    onCompleted () { message.success('Updated!!') }
  }
)
console.log('status',partnerInfo)
const blacklistChange = () => {
  updateBlacklist({
    variables: {
      cardcode: partnerInfo.cardcode,
      partner_status_id : partnerInfo.partner_status &&  partnerInfo.partner_status.id 
    }
  })
}

const [updateDeactivate] = useMutation(
  UPDATE_PARTNER_DE_ACTIVATE_MUTATION,
  {
    onError (error) { message.error(error.toString()) },
    onCompleted () { message.success('Updated!!') }
  }
)
console.log('status',partnerInfo)
const deActivateChange = () => {
  updateDeactivate({
    variables: {
      cardcode: partnerInfo.cardcode,
      partner_status_id :  partnerInfo.partner_status &&  partnerInfo.partner_status.id
    }
  })
}


const [updateDnd] = useMutation(
  UPDATE_PARTNER_DND_MUTATION,
  {
    onError (error) { message.error(error.toString()) },
    onCompleted () { message.success('Updated!!') }
  }
)
console.log('status',partnerInfo)
const dndChange = (e) => {
  updateDnd({
    variables: {
      cardcode : partnerInfo.cardcode ,
      dnd : e.target.checked 
    }
  })
}
const partner_status_id =  partnerInfo.partner_status &&  partnerInfo.partner_status.id 
  return (
    <Row>
      <Col xs={8}>
          <Checkbox 
            disabled={!admin && partner_status_id === 4 ? true : false} 
            onChange={blacklistChange}
            >
            BlackList
          </Checkbox>
      </Col>
      <Col xs={9}>
        <Checkbox 
              disabled={ partner_status_id === 4 ? true : false } 
              onChange={deActivateChange}
              >
             De-activate
          </Checkbox>
          </Col>
      <Col xs={7}>
          <Checkbox 
            checked={partnerInfo.dnd}
            disabled={partner_status_id === 4 || partner_status_id === 7 ? true : false } 
            onChange={dndChange} 
          >
            DND
          </Checkbox>
       </Col>
    </Row>
  )
}

export default PartnerStatus

