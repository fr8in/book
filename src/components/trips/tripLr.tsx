import { Row, Col, Select, Checkbox, Space, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import FileUploadOnly from '../common/fileUploadOnly'
import DeleteFile from '../common/deleteFile'
import ViewFile from '../common/viewFile'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import get from 'lodash/get'
import u from '../../lib/util'

const UPDATE_LR_MUTATION = gql`
mutation lr_number_update ($lr: String, $id: Int!,$updated_by: String!){
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
    updateLrNumber({
      variables: {
        id: trip_info.id,
        lr: value.toString(),
        updated_by: context.email
      }
    })
  }

  const onCustomerConfirm = e => {
    setCustomerConfirm(e.target.checked)
  }

  const lr_files = trip_info && trip_info.trip_files && trip_info.trip_files.filter(file => file.type === u.fileType.lr)
  const trip_status = get(trip_info, 'trip_status.name', null)
  const disableLr = (trip_status === 'Invoiced' && trip_status === 'Paid' && trip_status === 'Recieved' && trip_status === 'Closed')
  const loaded = (trip_info.loaded === 'Yes')
  const lr = get(trip_info, 'lr', null)
  const lr_numbers = lr ? lr.split(',') : []
  const lock = get(trip_info, 'transaction_lock', null)

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
          value={lr_numbers}
        />
      </Col>
      <Col xs={24} sm={12}>
        <Space>
          {lr_files && lr_files.length > 0 ? (
            <Space>
              <ViewFile
                id={trip_info.id}
                type='trip'
                file_type={u.fileType.lr}
                folder={u.folder.pod_lr}
                file_list={lr_files}
              />
              <DeleteFile
                id={trip_info.id}
                type='trip'
                file_type={u.fileType.lr}
                file_list={lr_files}
                disable={lock}
              />
            </Space>)
            : (
              <FileUploadOnly
                id={trip_info.id}
                type='trip'
                folder={u.folder.pod_lr}
                file_type={u.fileType.lr}
                disable={lock}
              />)}
          <Checkbox
            checked={trip_info.customer_confirmation || customerConfirm}
            disabled={(trip_info.customer_confirmation && loaded) || lock}
            onChange={onCustomerConfirm}
          >Customer Confirmation
          </Checkbox>
        </Space>
      </Col>
    </Row>
  )
}

export default TripLr
