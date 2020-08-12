import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'

const PARTNERS_LEAD_CITY_QUERY = gql`
  query partnerLeadCity{
    city{
        id
        name
   }
}
`
const UPDATE_LEAD_CITY_MUTATION = gql`
mutation updateLeadCity ($city_id: Int,$id:Int!) {
    update_partner(_set: {city_id: $city_id}, where: {id: {_eq: $id}}) {
      returning {
        id
        city_id
      }
    }
  }
  
`
const PartnerLeadCity = (props) => {
  const { leadCityId, leadCity, id } = props

  const { loading, error, data } = useQuery(
    PARTNERS_LEAD_CITY_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updateLeadCity] = useMutation(
    UPDATE_LEAD_CITY_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('PartnerLeadCity error', error)

  const { city } = data
  const cityList = city.map(data => {
    return { value: data.id, label: data.name }
  })

  const handleChange = (value) => {
    updateLeadCity({
      variables: {
        id:id,
        city_id: value
      }
    })
  }

  return (
    <InlineSelect
      label={leadCity}
      value={leadCityId}
      options={cityList}
      handleChange={handleChange}
      style={{ width: '80%' }}
    />
  )
}

export default PartnerLeadCity
