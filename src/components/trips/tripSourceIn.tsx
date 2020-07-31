import moment from 'moment'
import { UPDATE_TRIP_SOURCEIN_MUTATION } from './containers/query/tripSourceInMutation'
import { useMutation } from '@apollo/client'
import useShowHide from '../../hooks/useShowHide'
import { message, DatePicker, Button } from 'antd'

const SourceInDate = (props) => {
    const { sourcein, id } = props
  
    const initial = { datePicker: false }
    const { visible, onHide, onShow } = useShowHide(initial)
   
    const [updateSourceIn] = useMutation(
        UPDATE_TRIP_SOURCEIN_MUTATION,
      {
        onError (error) { message.error(error.toString()) },
      }
    )

    const onSubmit = (date, dateString) => {
      console.log(dateString)
      updateSourceIn({
        variables: {
          id ,
          source_in: dateString
        }
      })
      onHide()
    }
  
    const dateFormat = 'DD-MMM-YYYY HH:mm'
  
    return (
      <div>
        {!visible.datePicker ? (
          <label>
            {sourcein ? moment(sourcein).format(dateFormat) : '-'}{' '}
            
          </label>)
          : (
            <span>
              <DatePicker
                placeholder='Source-In Date'
                disabled={false}
                format={dateFormat}
                value={sourcein ? moment(sourcein, dateFormat) : moment()}
                onChange={onSubmit} 
                size='small'
              />{' '}
               <Button type='primary' >Ok</Button>
            </span>)}
           
      </div>
    )
  }
  
  export default SourceInDate
  