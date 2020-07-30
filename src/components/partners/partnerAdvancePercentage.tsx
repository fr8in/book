import { message } from 'antd'
import { useQuery, useMutation } from '@apollo/client'
import { PARTNER_ADVANCE_PERCENTAGE_QUERY } from './container/query/partnerAdvancePercentageQuery'
import { UPDATE_PARTNER_ADVANCE_PERCENTAGE_MUTATION } from './container/query/updateAdvancePercentageMutation'
import InlineSelect from '../common/inlineSelect'

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
    return { value: data.id, label: data.value }
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