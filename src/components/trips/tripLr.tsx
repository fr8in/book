import { Row, Col, Select, Checkbox, Space, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import FileUploadOnly from '../common/fileUploadOnly'
import DeleteFile from '../common/deleteFile'
import ViewFile from '../common/viewFile'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'

const UPDATE_LR_MUTATION = gql`
mutation lr_number_update ($lr: jsonb, $id: Int!,$updated_by: String!){
  update_trip(_set: {lr: $lr,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      lr
    }
  }
}`

const TripLr = (props) => {
  const { trip_info, customerConfirm, setCustomerConfirm } = props
  const context = useContext(userContext)

  const [updateLrNumber] = useMutation(
    UPDATE_LR_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const handleChange = (value) => {
    console.log(`Selected: ${value}`)
    updateLrNumber({
      variables: {
        id: trip_info.id,
        lr: value,
        updated_by: context.email
      }
    })
  }

  const onCustomerConfirm = e => {
    setCustomerConfirm(e.target.checked)
  }

  const lr_files = trip_info && trip_info.trip_files && trip_info.trip_files.filter(file => file.type === 'LR')

  const disableLr = trip_info.trip_status && trip_info.trip_status.name === 'Invoiced' &&
                    trip_info.trip_status.name === 'Paid' &&
                    trip_info.trip_status.name === 'Recieved' &&
                    trip_info.trip_status.name === 'Closed'
  const loaded = (trip_info.loaded === 'Yes')

  return (
    <Row gutter={8}>
      <Col xs={24} sm={12}>
        <Select
          id='lr'
          mode='tags'
          maxTagCount={7}
          style={{ width: '100%' }}
          placeholder='Enter valid LR numbers'
          disabled={disableLr}
          onChange={handleChange}
          value={trip_info.lr || []}
        />
      </Col>
      <Col xs={24} sm={12}>
        <Space>
          {lr_files && lr_files.length > 0 ? (
            <Space>
              <ViewFile
                id={trip_info.id}
                type='trip'
                file_type='LR'
                folder='pod/'
                file_list={lr_files}
              />
              <DeleteFile
                id={trip_info.id}
                type='trip'
                file_type='LR'
                file_list={lr_files}
              />
            </Space>)
            : (
              <FileUploadOnly
                id={trip_info.id}
                type='trip'
                folder='pod/'
                file_type='LR'
              />)}
          <Checkbox
            checked={trip_info.customer_confirmation || customerConfirm}
            disabled={customerConfirm && loaded}
            onChange={onCustomerConfirm}
          >Customer Confirmation
          </Checkbox>
        </Space>
      </Col>
    </Row>
  )
}

export default TripLr
