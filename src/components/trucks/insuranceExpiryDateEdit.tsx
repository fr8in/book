import moment from 'moment'
import { DatePicker, Form ,message} from 'antd'
import { gql, useMutation } from '@apollo/client'
import { EditTwoTone,CloseCircleTwoTone } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'

const UPDATE_TRUCK_INSURANCE_MUTATION = gql`
mutation truck_info($id:Int,$insurance_expiry_at:timestamp){
  update_truck(_set: {insurance_expiry_at:$insurance_expiry_at}, where: {id: {_eq:$id }}){
    returning{
      id
      
    }
  }
}`

const TruckInsuranceExpiry = (props) => {

  const initial = { selectType: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const {record} = props
    
  const [updateTruckInsuranceExpiry] = useMutation(
    UPDATE_TRUCK_INSURANCE_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Saved!!')
        onHide()
      }
    }
  )

  const onSubmit = (dateString) => {
    updateTruckInsuranceExpiry({
        variables: {
          id: record.id,
          insurance_expiry_at:dateString
        }
      })
    }

  return (
    <Form.Item
      name='insurance_expiry_at'
    >
      <div>
        {!visible.selectType ? (
       <label>
         {record.insurance_expiry_at ? moment(record.insurance_expiry_at).format('DD-MMM-YY') : ''}
          <EditTwoTone
          onClick={() => onShow('selectType')}
        />
        </label>)
         : (
          <span>
             <DatePicker
        showTime
        allowClear
        format='YYYY-MM-DD HH:mm'
        placeholder='Select Time'
        style={{ width: '100%' }}
        onChange={onSubmit}
        size="small"
      />{' '}
      <CloseCircleTwoTone onClick={onHide} />
          </span>)}
    </div>
     
    </Form.Item>
  )
}

export default TruckInsuranceExpiry
