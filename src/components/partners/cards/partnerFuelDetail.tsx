import { Row, Col, Switch } from 'antd'
import LabelWithData from '../../common/labelWithData'
import fuelDetail from '../../../../mock/card/fuelCard'
import { gql,useQuery } from '@apollo/client'
import get from 'lodash/get'
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
const PartnerFuelDetail = (props) => {
const {partner_id} = props
console.log('partner_id',partner_id)
  const { loading, error, data } = useQuery(
    FUEL_CARD_QUERY, {
      variables:{
        partner_id:partner_id
      },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })
  console.log('FuelCard error', error)
  console.log('FuelCard data', data)

  var _data = {}
  if (!loading) {
    _data = data
  }
  const partner = get(_data, 'partner', [])
  const partner_info = partner[0] ? partner[0] : { name: 'ID does not exist' }

  const card_id =  partner_info.fuel_card &&  partner_info.fuel_card.id 
  const card_number =  partner_info.fuel_card &&  partner_info.fuel_card.number 
  const mobile =  partner_info.fuel_card &&  partner_info.fuel_card.mobile 
  const status =  partner_info.fuel_card &&  partner_info.fuel_card.status 
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
          data={<Switch 
            size='small' 
            checked = {status}
            defaultChecked
             />}
          labelSpan={8}
        />
      </Col>
    </Row>
  )
}

export default PartnerFuelDetail
