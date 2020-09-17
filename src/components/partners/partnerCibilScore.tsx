import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'

const UPDATE_CIBIL_SCORE_MUTATION = gql`
mutation partner_cibil_score_edit($cibil:String,$cardcode:String) {
  update_partner(_set: {cibil: $cibil}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      cibil
    }
  }
}
`
const PartnerCibilScore = (props) => {
  const { cardcode, cibil, loading } = props

  const [updateCibilScore] = useMutation(
    UPDATE_CIBIL_SCORE_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updateCibilScore({
      variables: {
        cardcode: cardcode,
        cibil: text
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={cibil || '-'}
        onSetText={onSubmit}
      />)
  )
}

export default PartnerCibilScore
