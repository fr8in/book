import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import { useContext } from 'react'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

const TRUCKS_TYPE_QUERY = gql`
  query truck_type{
  truck_type(where:{active:{_eq:true}}) {
      id
      name
  }
}
`
const UPDATE_TRUCK_TYPE_MUTATION = gql`
mutation truck_type_edit($description:String, $topic:String, $truck_id: Int,$updated_by: String!,$truck_no:String,$truck_type_id:Int){
  insert_truck_comment(objects:{truck_id:$truck_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
    update_truck(_set:{truck_type_id: $truck_type_id,updated_by:$updated_by}, where:{truck_no: {_eq:$truck_no}}) {
      returning{
        id
        truck_type_id
      }
    }
  }


`

const TruckType = (props) => {
  const { truckTypeId, truckType, truck_no,truck_id } = props
  const context = useContext(userContext)

  const { role,topic } = u
  const edit_access = [role.user]

  const { loading, error, data } = useQuery(
    TRUCKS_TYPE_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  const [updateTruckTypeId] = useMutation(
    UPDATE_TRUCK_TYPE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('TruckType error', error)

  const { truck_type } = data
  const truckList = truck_type.map(data => {
    return { value: data.id, label: data.name }
  })

  const onChange = (value) => {
    updateTruckTypeId({
      variables: {
        truck_no,
        truck_type_id: value,
        updated_by: context.email,
        description:`${topic.truck_type} updated by ${context.email}`,
        topic:topic.truck_type,
        truck_id: truck_id
      }
    })
  }

  return (
    <InlineSelect
      label={truckType}
      value={truckTypeId}
      options={truckList}
      handleChange={onChange}
      style={{ width: 110 }}
      edit_access={edit_access}
    />
  )
}

export default TruckType
