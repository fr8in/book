import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import EditableCell from '../common/editableCell'
import u from '../../lib/util'
import { useContext } from 'react'


const UPDATE_TRUCK_PAN_MUTATION = gql`
mutation truck_pan_edit($description:String, $topic:String, $truck_id: Int!,$updated_by: String!,$pan:String){
    insert_truck_comment(objects:{truck_id:$truck_id,topic:$topic,description:$description,created_by:$updated_by})
      {
        returning
        {
          id
        }
      }
    update_truck(_set: {pan: $pan,updated_by:$updated_by}, where: {id: {_eq: $truck_id}}) {
      returning {
        id
        pan
      }
    }
  }
`
const TruckPan = (props) => {
  const {  pan, loading, edit_access,truck_id } = props
  const { topic } = u
  

  const context = useContext(userContext)

  const [updatePan] = useMutation(
    UPDATE_TRUCK_PAN_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updatePan({
      variables: {
        pan: text,
        updated_by: context.email,description:`${topic.pan} updated by ${context.email}`,
        topic:topic.pan,
        truck_id: truck_id
      }
    })
  }

  return (
    <EditableCell
    label={pan || '-'}
    onSubmit={onSubmit}
    edit_access={edit_access}
  />
  )
}

export default TruckPan
