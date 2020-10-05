import { Row, Col, Select, Button, Checkbox, Space, message } from 'antd'
import { EyeOutlined, SaveOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import FileUploadOnly from '../common/fileUploadOnly'
import DeleteFile from '../common/deleteFile'
import ViewFile from '../common/viewFile'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

const UPDATE_LR_MUTATION = gql`
mutation lr_number_update ($lr: jsonb, $id: Int!,$updated_by: String!){
  update_trip(_set: {lr: $lr,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      lr
    }
  }
}`

const UPDATE_CUSTOMER_CONFIRMATION_MUTATION = gql`
mutation update_customer_confirmation ($customer_confirmation: Boolean, $id: Int!,$updated_by: String!){
  update_trip(_set: {customer_confirmation: $customer_confirmation,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      customer_confirmation
    }
  }
}`

const TripLr = (props) => {
  const { trip_info } = props

  const context = useContext(userContext)

  const [updateLrNumber] = useMutation(
    UPDATE_LR_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const [updateCustomerConfirmation] = useMutation(
    UPDATE_CUSTOMER_CONFIRMATION_MUTATION,
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
    console.log('checked = ', e.target.checked)
    updateCustomerConfirmation({
      variables: {
        id: trip_info.id,
        customer_confirmation: e.target.checked,
        updated_by: context.email
      }
    })
  }

  const lr_files = trip_info.trip_files.filter(file => file.type === 'LR')

  const disableLr = trip_info.trip_status && trip_info.trip_status.name === 'Invoiced' &&
                    trip_info.trip_status.name === 'Paid' &&
                    trip_info.trip_status.name === 'Recieved' &&
                    trip_info.trip_status.name === 'Closed'
  console.log('lr', lr_files)
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
          defaultValue={trip_info.lr || []}
          onChange={handleChange}
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
            checked={trip_info.customer_confirmation}
            disabled={false}
            onChange={onCustomerConfirm}
          >Customer Confirmation
          </Checkbox>
        </Space>
      </Col>
    </Row>
  )
}

export default TripLr
