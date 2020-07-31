import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { useRouter } from 'next/router'

const UPDATE_TRUCK_NO_MUTATION = gql`
mutation TruckNoEdit($truck_no:String,$id:Int) {
  update_truck(_set: {truck_no: $truck_no}, where: {id: {_eq: $id}}) {
    returning {
      id
      truck_no
    }
  }
}
`
const TruckNo = (props) => {
  const { truck_no, id } = props
  const router = useRouter()

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
        truck_no: text
      }
    })
    const url = '/trucks/[id]'
    const as = `/trucks/${text}`
    router.push(url, as, 'shallow')
  }

  return (
    <InlineEdit
      text={truck_no || 'No TruckNo'}
      onSetText={onSubmit}
    />
  )
}

export default TruckNo
