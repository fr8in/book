import { Modal, message } from 'antd'
import { QuestionCircleTwoTone } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

const UPDATE_FASTAG_SUSPEND_MUTATION = gql`
mutation suspend_tag($truckId:Int!,$modifiedBy:String!){
  suspend_fastag(truck_id:$truckId,modified_by:$modifiedBy)
  {
    status
    description
}
}
`
const FastagSuspend = (props) => {
  const { visible, onHide, truck_id } = props

  const [suspend_fastag] = useMutation(
    UPDATE_FASTAG_SUSPEND_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const onSubmit = () => {
    suspend_fastag({
      variables: {
        truckId: truck_id,
        modifiedBy: 'pravalika.k@fr8.in'
      }
    })
    onHide()
  }

  return (
    <Modal visible={visible} onOk={onSubmit} onCancel={onHide}>
      <br />
      <h3>
        <QuestionCircleTwoTone twoToneColor='#ffc107' /> Suspended Tags will get
        permanently deactivated. This action cannot be undone
      </h3>
      <br />
      <p>Do you want to proceed?</p>
    </Modal>
  )
}

export default FastagSuspend
