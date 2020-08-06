import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'

const PARTNER_ADVANCE_PERCENTAGE_QUERY = gql`
  query partnerAdvancePercentage{
   partner_advance_percentage{
    id
    name
  }
}
`
const UPDATE_PARTNER_ADVANCE_PERCENTAGE_MUTATION = gql`
mutation partnerAdvancePercentage($partner_advance_percentage_id:Int,$cardcode:String) {
  update_partner(_set:{partner_advance_percentage_id:$partner_advance_percentage_id }, where:{cardcode:{_eq:$cardcode}}){
    returning{
      id
      partner_advance_percentage_id
    }
  }
}
`
const AdvancePercentage = (props) => {
  const { advanceId, advance, cardcode } = props

  const { loading, error, data } = useQuery(
    PARTNER_ADVANCE_PERCENTAGE_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [UpdateAdvancePercentage] = useMutation(
    UPDATE_PARTNER_ADVANCE_PERCENTAGE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('advancePercentage error', error)

  const { partner_advance_percentage } = data
  const advancePercentage = partner_advance_percentage.map(data => {
    return { value: data.id, label: data.name }
  })

  const onChange = (value) => {
    UpdateAdvancePercentage({
      variables: {
        cardcode,
        partner_advance_percentage_id : value
      }
    })
  }

  return (
    <InlineSelect
      label={advance}
      value={advanceId}
      options={advancePercentage}
      handleChange={onChange}
      style={{ width: 110 }}
    />
  )
}

export default AdvancePercentage