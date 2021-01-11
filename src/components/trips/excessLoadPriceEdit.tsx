import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import EditableCell from '../common/editableCell'
import u from '../../lib/util'



const UPDATE_TRIP_PRICE_MUTATION = gql `mutation trip($tripId:Int!,$price:Float!){
    update_trip(where:{id:{_eq:$tripId}},_set:{customer_price:$price}){
      affected_rows
    }
  }`



  const TripPrceEdit = (props) => {
      const { role } = u
      const {id,price} = props
    const [updateTripPrice] = useMutation(
        UPDATE_TRIP_PRICE_MUTATION,
        {
          onError (error) { message.error(error.toString()) },
          onCompleted () { message.success('Updated!!') }
        }
      )
    
      const handleChange = (value) => {
          console.log("value",value)
        updateTripPrice({
          variables: {
            tripId: id,
            price: value
          }
        })
      }
      return (
        (
          <EditableCell
            label={price}
            onSubmit={handleChange}
            edit_access={[role.user]}
          />)
      )
  }
  


  export default TripPrceEdit
