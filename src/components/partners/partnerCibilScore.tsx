import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_CIBIL_SCORE_MUTATION } from './container/query/updatePartnerCibilScoreMutation'

const PartnerCibilScore = (props) => {
  const { cardcode, cibil } = props

  const [updateCibilScore] = useMutation(
    UPDATE_CIBIL_SCORE_MUTATION,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const onSubmit = (text) => {
    updateCibilScore({
      variables: {
        cardcode,
        cibil: text
      }
    })
  }

  return (
    <InlineEdit
      text={cibil || 'No CibilScore'}
      onSetText={onSubmit}
    />
  )
}

export default PartnerCibilScore


