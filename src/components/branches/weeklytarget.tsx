import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import EditableCell from '../common/editableCell'

const UPDATE_BRABCH_WEEKLY_TARGET_MUTATION = gql`
mutation update_branch_weekly_target($trip_target: Int!, $branch_id: Int!, $week: Int!, $year: Int!){
    update_branch_weekly_target(_set:{trip_target: $trip_target}, where:{branch_id: {_eq:$branch_id}, week: {_eq:$week}, year:{_eq: $year}}){
      returning{
        trip_target
        branch_id
      }
    }
  }
  `
  
  const WeeklyTarget = (props) => {
    const { id, label,Week,Year } = props
  
    const [updateTruckNo] = useMutation(
        UPDATE_BRABCH_WEEKLY_TARGET_MUTATION,
      {
        onError (error) { message.error(error.toString()) },
        onCompleted () { message.success('Saved!!') }
      }
    )
  
    const onSubmit = (value) => {
      updateTruckNo({
        variables: {
          branch_id: id,
          week: Week,
          year: Year,
          trip_target: value
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
  
  export default WeeklyTarget