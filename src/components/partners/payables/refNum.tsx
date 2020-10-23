import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import EditableCell from '../../common/editableCell'

const UPDATE_REFERENCE_NUMBER_MUTATION = gql`
mutation updateReferenceNumber ($doc_num:String!,$bank_reference_number:String!){
    update_pending_transaction(
      doc_num: $doc_num
      bank_reference_number: $bank_reference_number
    ) {
      description
      status
    }
  }
`
const Referencenumber = (props) => {
  const { id, label } = props

  const [updateReferenceNumber] = useMutation(
    UPDATE_REFERENCE_NUMBER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const onSubmit = (value) => {
    updateReferenceNumber({
      variables: {
        doc_num: id.toString(),
        bank_reference_number: value
      }
    })
  }

  return (
    <EditableCell
      label={label}
      onSubmit={onSubmit}
    />
  )
}

export default Referencenumber
