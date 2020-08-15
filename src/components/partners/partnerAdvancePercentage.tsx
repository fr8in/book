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
  const { advance_id, advance, cardcode } = props

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
  console.log('advancePercentage error', error)

  if (loading) return null
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
      value={advance_id}
      options={advancePercentage}
      handleChange={onChange}
      style={{ width: 110 }}
    />
  )
}

export default AdvancePercentage