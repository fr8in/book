import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import get from 'lodash/get'
import AddTruck from '../trucks/addTruck'
import Modal from 'antd/lib/modal/Modal'

const TRUCK_TYPE_QUERY = gql`
query add_truck{
  truck_type {
    id
    name
  }
}`

const INSERT_ADD_TRUCK_MUTATION = gql`
mutation add_truck($truck_no:String,  $partner_id: Int!, $breadth:float8,$length:float8,$height:float8,$city_id:Int,$truck_type_id:Int, $driver_id: Int,$created_by:String ) {
  insert_truck(objects: {truck_no: $truck_no,breadth: $breadth, height: $height, length: $length,created_by:$created_by, partner_id: $partner_id,  truck_type_id: $truck_type_id, city_id: $city_id, driver_id: $driver_id, truck_status_id: 6}) {
    returning {
      id
      truck_no
    }
  }
}`

const NewTruck = (props) => {
  const { partner_info, disableAddTruck ,visible,onHide} = props
  const [city_id, setCity_id] = useState(null)
  const [driver_id, setDriver_id] = useState(null)
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

  const onCityChange = (city_id) => {
    setCity_id(city_id)
  }

  const driverChange = (driver_id) => {
    setDriver_id(driver_id)
  }

  const { loading, error, data } = useQuery(
    TRUCK_TYPE_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('NewTruck error', error)

  let _data = {}

  if (!loading) {
    _data = data
  }

  const truck_type = get(_data, 'truck_type', [])

  const typeList = truck_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const [insertTruck] = useMutation(
    INSERT_ADD_TRUCK_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Created!!')
        onHide()
      }
    }
  )

  const onSubmit = (form) => {
    setDisableButton(true)
    insertTruck({
      variables: {
        partner_id: partner_info.id,
        city_id: parseInt(city_id, 10),
        length: parseFloat(form.length),
        breadth: parseFloat(form.breadth),
        height: parseFloat(form.height),
        truck_no: (form.truck_no),
        created_by: context.email,
        truck_type_id: parseInt(form.truck_type, 10),
        driver_id: driver_id
      }
    })
  }

  return (
    <>
    <Modal
     visible={visible}
     onCancel={onHide}
     footer={[]}
    >
      <AddTruck
        partner_info={partner_info}
        onSubmit={onSubmit}
        typeList={typeList}
        driverChange={driverChange}
        onCityChange={onCityChange}
        disableButton={disableButton}
        grid_column={24}
        disableAddTruck={disableAddTruck}
      />
      </Modal>
    </>
  )
}

export default NewTruck
