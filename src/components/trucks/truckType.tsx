import { Select, message } from 'antd'
import { CloseCircleTwoTone, EditTwoTone } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/client'
import { TRUCKS_TYPE_QUERY } from './container/query/trucksTypeQuery'
import { UPDATE_TRUCK_TYPE_MUTATION } from './container/query/updateTruckTypeMutation'
import useShowHide from '../../hooks/useShowHide'

const TruckType = (props) => {
  const { type, truck_no } = props

  const initial = { selectType: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const { loading, error, data } = useQuery(
    TRUCKS_TYPE_QUERY,
    {
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
  const typeList = truck_type.map(data => {
    return { value: data.value, label: data.comment }
  })

  const handleChange = (value) => {
    console.log(`selected ${value}`)
    updateTruckTypeId({
      variables: {
        truck_no,
       truck_type_id: value
      }
    })
    onHide()
  }

  return (
    <div>
      {!visible.selectType ? (
        <label>
          {type}{' '}
          <EditTwoTone onClick={() => onShow('selectType')} />
        </label>)
        : (
          <span>
            <Select
              size='small'
              style={{ width: 110 }}
              placeholder='Select Type'
              options={typeList}
              value={type}
              onChange={handleChange}
            />{' '}
            <CloseCircleTwoTone onClick={onHide} />
          </span>)}
    </div>
  )
}

export default TruckType
