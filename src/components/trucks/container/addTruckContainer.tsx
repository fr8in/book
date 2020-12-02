import userContext from '../../../lib/userContaxt'
import { useState, useContext } from 'react'
import { Row, Col, Card, message } from 'antd'
import Link from 'next/link'
import { gql, useQuery, useMutation } from '@apollo/client'

import get from 'lodash/get'
import { useRouter } from 'next/router'
import AddTruck from '../addTruck'

const ADD_TRUCK_QUERY = gql`
query add_truck ( $cardcode: String!){
  partner(where: {cardcode: {_eq: $cardcode}}) {
    id
    cardcode
    name
  }
  truck_type {
    id
    name
  }
}`

const INSERT_ADD_TRUCK_MUTATION = gql`
mutation add_truck($truck_no:String,  $partner_id: Int!,$city_id:Int,$truck_type_id:Int, $driver_id: Int,$created_by:String ,$insurance_expiry_at:timestamp) {
  insert_truck(objects: {truck_no: $truck_no,created_by:$created_by, partner_id: $partner_id,  truck_type_id: $truck_type_id, city_id: $city_id, driver_id: $driver_id,insurance_expiry_at:$insurance_expiry_at, truck_status_id: 6}) {
    returning {
      id
      truck_no
    }
  }
}`

const AddTruckContainer = (props) => {
  const { cardcode } = props
  const [city_id, setCity_id] = useState(null)
  const [driver_id, setDriver_id] = useState(null)
  const router = useRouter()
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

  const onCityChange = (city_id) => {
    setCity_id(city_id)
  }

  const driverChange = (driver_id) => {
    setDriver_id(driver_id)
  }


  const { loading, error, data } = useQuery(
    ADD_TRUCK_QUERY,
    {
      variables: { cardcode: cardcode },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )



  let _data = {}

  if (!loading) {
    _data = data
  }

  const partner_info = get(_data, 'partner[0]', { name: 'ID does not exist' })
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
      onCompleted (data) {
        setDisableButton(false)
        const value = get(data, 'insert_truck.returning', [])
        message.success('Created!!')
        const url = '/trucks/[id]'
        const as = `/trucks/${value[0].truck_no}`
        router.push(url, as, { shallow: true })
      }
    }
  )

  const onSubmit = (form) => {
    setDisableButton(true)
  
    insertTruck({
      variables: {
        partner_id: partner_info.id,
        city_id: parseInt(city_id, 10),
        truck_no: (form.truck_no),
        created_by: context.email,
        truck_type_id: parseInt(form.truck_type, 10),
        driver_id: driver_id,
        insurance_expiry_at:form.insurance_expiry_at.format('YYYY-MM-DD')
      }
    })
  }

  return (
    <Card
      title={
        <h3>Add Truck:&nbsp;
          <Link href='/partners/[id]' as={`/partners/${cardcode}`}>
            <a>{partner_info.name}</a>
          </Link>
        </h3>
      }
      size='small'
      className='border-top-blue'
    >
      <Row>
        <Col sm={8} offset={8}>
          <AddTruck
            partner_info={partner_info}
            onSubmit={onSubmit}
            typeList={typeList}
            driverChange={driverChange}
            onCityChange={onCityChange}
            disableButton={disableButton}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default AddTruckContainer
