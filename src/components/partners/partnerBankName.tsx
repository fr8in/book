import { message } from 'antd'
import { useQuery, useMutation } from '@apollo/client'
import { PARTNER_BANK_QUERY } from './container/query/partnerBankQuery'
import { UPDATE_PARTNER_BANK_MUTATION } from './container/query/updatePartnerBankMutation'
import InlineSelect from '../common/inlineSelect'

const PartnerBank = (props) => {
  const { partnerBankId, partnerBank, cardcode } = props

  const { loading, error, data } = useQuery(
    PARTNER_BANK_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updatePartnerBankId] = useMutation(
    UPDATE_PARTNER_BANK_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('partnerBank error', error)

  const { bank } = data
  const bankList = bank.map(data => {
    return { value: data.id, label: data.name }
  })

  const onChange = (value) => {
    updatePartnerBankId({
      variables: {
        cardcode,
        bank_id: value
      }
    })
  }

  return (
    <InlineSelect
      label={partnerBank}
      value={partnerBankId}
      options={bankList}
      handleChange={onChange}
      style={{ width: 110 }}
    />
  )
}

export default PartnerBank