import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

const UPDATE_TRUCK_NO_MUTATION = gql`
mutation truck_no_edit($truck_no:String,$id:Int,$updated_by: String!) {
  update_truck(_set: {truck_no: $truck_no,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      truck_no
    }
  }
}
`
const TruckNo = (props) => {
  const { truck_no, id , loading } = props
  const router = useRouter()
  const context = useContext(userContext)

  const { role } = u
  const edit_access = [role.user]

  const [updateTruckNo] = useMutation(
    UPDATE_TRUCK_NO_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const onSubmit = (text) => {
    updateTruckNo({
      variables: {
        id,
        truck_no: text,
        updated_by: context.email
      }
    })
    const url = '/trucks/[id]'
    const as = `/trucks/${text}`
    router.push(url, as, 'shallow')
  }

  return (
    loading ? null : (
      <InlineEdit
        text={truck_no || 'No TruckNo'}
        onSetText={onSubmit}
        edit_access={edit_access}
      />)
  )
}

export default TruckNo
